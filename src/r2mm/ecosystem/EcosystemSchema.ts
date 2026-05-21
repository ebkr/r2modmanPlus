import bundledEcosystem from "../../assets/data/ecosystem.json";
import {R2Modman, ThunderstoreEcosystem} from "../../assets/data/ecosystemTypes";
import GameImageProvider from "../../providers/generic/image/GameImageProvider";
import jsonSchema from "../../assets/data/ecosystemJsonSchema.json";
import R2Error from "../../model/errors/R2Error";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import PathResolver from "../manager/PathResolver";
import path from "../../providers/node/path/path";
import FsProvider from "../../providers/generic/file/FsProvider";
import VersionNumber from "../../model/VersionNumber";
import ManagerInformation from "../../_managerinf/ManagerInformation";
import {EcosystemModloaderPackages, EcosystemSupportedGames} from "../../model/schema/ThunderstoreSchema";
import {updateModLoaderExports} from "../installing/profile_installers/ModLoaderVariantRecord";
import LoggerProvider, {LogSeverity} from "../../providers/ror2/logging/LoggerProvider";
import {getAxiosWithTimeouts} from "../../utils/HttpUtils";
import {retry} from "../../utils/Common";

export type VersionedThunderstoreEcosystem = ThunderstoreEcosystem & {
    version: string;
    lastModified?: string;
};

type LatestSchemaFetchResult =
    | {kind: "not-modified"}
    | {kind: "fetched", schema: ThunderstoreEcosystem, lastModified?: string}
    | {kind: "failed"};

const REMOTE_ECOSYSTEM_DATA_URL = "https://thunderstore.io/api/experimental/schema/dev/latest/";
const LOCAL_ECOSYSTEM_DATA_URL = "/_local/latest.json";
const LOCAL_HEALTHZ_URL = "/_local/healthz";

async function isLocalSchemaReachable(): Promise<boolean> {
    try {
        const res = await fetch(LOCAL_HEALTHZ_URL);
        return res.ok;
    } catch {
        return false;
    }
}

async function resolveEcosystemDataUrl(): Promise<string> {
    if (import.meta.env.MODE === "development" && await isLocalSchemaReachable()) {
        return LOCAL_ECOSYSTEM_DATA_URL;
    }
    return REMOTE_ECOSYSTEM_DATA_URL;
}

async function getMergedEcosystemPath(): Promise<string> {
    return path.join(PathResolver.ROOT, "latest-ecosystem-schema.json");
}

function validateSchema(schema: unknown): ThunderstoreEcosystem {
    const ajv = new Ajv();
    addFormats(ajv);

    const validate = ajv.compile(jsonSchema);
    const isOk = validate(schema);

    if (!isOk) {
        throw new R2Error("Schema validation error", ajv.errorsText(validate.errors));
    }

    return schema as ThunderstoreEcosystem;
}

function loadBundledSchema(): ThunderstoreEcosystem {
    return validateSchema(bundledEcosystem);
}

function createEmptySchema(): ThunderstoreEcosystem {
    return {
        schemaVersion: "",
        communities: {},
        games: {},
        modloaderPackages: [],
        packageInstallers: {},
    };
}

function mergeSchemas(
    bundledSchema: ThunderstoreEcosystem,
    latestSchema: ThunderstoreEcosystem
): ThunderstoreEcosystem {
    const modloaderMap = new Map(
        [...bundledSchema.modloaderPackages, ...latestSchema.modloaderPackages]
            .map(pkg => [pkg.packageId, pkg])
    );

    return {
        schemaVersion: latestSchema.schemaVersion,
        communities: {
            ...bundledSchema.communities,
            ...latestSchema.communities,
        },
        games: {
            ...bundledSchema.games,
            ...latestSchema.games,
        },
        modloaderPackages: [...modloaderMap.values()],
        packageInstallers: {
            ...bundledSchema.packageInstallers,
            ...latestSchema.packageInstallers,
        },
    };
}

async function fetchLatestSchema(
    currentSchema: VersionedThunderstoreEcosystem | null
): Promise<LatestSchemaFetchResult> {
    const timeout = 5000;
    const requestConfig = {
        validateStatus: (status: number) => {
            if (status === 304) {
                return true;
            }
            return status >= 200 && status < 300;
        },
        ...(currentSchema?.lastModified ? {headers: {"If-Modified-Since": currentSchema.lastModified}} : {}),
    };

    try {
        const url = await resolveEcosystemDataUrl();
        const axios = getAxiosWithTimeouts(timeout, timeout * 2);
        const response = await retry(
            () => axios.get(url, requestConfig),
            {attempts: 3, interval: 1000, throwLastErrorAsIs: true}
        );
        const lastModified = typeof response.headers["last-modified"] === "string"
            ? response.headers["last-modified"]
            : undefined;

        if (response.status === 304) {
            return {kind: "not-modified"};
        }

        return {
            kind: "fetched",
            schema: validateSchema(response.data),
            ...(lastModified ? {lastModified} : {}),
        };
    } catch (e) {
        console.error(e);
        return {kind: "failed"};
    }
}

function getNonBundledIconUrls(
    mergedSchema: ThunderstoreEcosystem,
    bundledSchema: ThunderstoreEcosystem
): string[] {
    const bundledKeys = new Set(Object.keys(bundledSchema.games));
    const urls: string[] = [];
    for (const [key, game] of Object.entries(mergedSchema.games)) {
        if (bundledKeys.has(key)) {
            continue;
        }
        if (game.r2modman) {
            for (const entry of game.r2modman) {
                if (entry.meta.iconUrl) {
                    urls.push(entry.meta.iconUrl)
                }
            }
        }
    }
    return urls;
}

export async function updateLatestEcosystemSchema(): Promise<void> {
    const bundledSchema = loadBundledSchema();
    const currentSchema = await loadSavedEcosystemSchema();
    const result = await fetchLatestSchema(currentSchema);

    const updateIcons = async (mergedSchema: ThunderstoreEcosystem): Promise<void> => {
        const nonBundledIconUrls = getNonBundledIconUrls(mergedSchema, bundledSchema);
        if (nonBundledIconUrls.length > 0) {
            void GameImageProvider.prefetchAll(nonBundledIconUrls);
        }
    }

    if (result.kind === "not-modified") {
        const mergedSchema = await resolveCachedEcosystemSchema();
        await updateIcons(mergedSchema);
        await internalUpdateEcosystemReactives(mergedSchema);
        return;
    }

    if (result.kind === "failed") {
        if (currentSchema == null) {
            await writeLatestEcosystemSchema(bundledSchema);
            await internalUpdateEcosystemReactives(bundledSchema);
        }
        updateEcosystemReactives();
        throw new Error("Failed to update game list");
    }

    const mergedSchema = mergeSchemas(bundledSchema, result.schema);
    await writeLatestEcosystemSchema(mergedSchema, result.lastModified);
    await internalUpdateEcosystemReactives(mergedSchema);
    await updateIcons(mergedSchema);
}

async function writeLatestEcosystemSchema(
    schema: ThunderstoreEcosystem,
    lastModified?: string
): Promise<void> {
    const asMergedSchema: VersionedThunderstoreEcosystem = {
        ...schema,
        version: ManagerInformation.VERSION.toString(),
        ...(lastModified != null ? {lastModified} : {}),
    };
    const writable = JSON.stringify(asMergedSchema);
    return FsProvider.instance.writeFile(await getMergedEcosystemPath(), writable);
}

async function readSavedEcosystemSchema(): Promise<VersionedThunderstoreEcosystem> {
    const contentBuffer = await FsProvider.instance.readFile(await getMergedEcosystemPath());
    const content = contentBuffer.toString("utf8");
    const parsedContent = JSON.parse(content);
    const {version, lastModified, ...schemaContent} = parsedContent as VersionedThunderstoreEcosystem;
    void version;
    void lastModified;
    validateSchema(schemaContent);
    return parsedContent as VersionedThunderstoreEcosystem;
}

async function loadSavedEcosystemSchema(): Promise<VersionedThunderstoreEcosystem | null> {
    const mergeFilePath = await getMergedEcosystemPath();
    if (!(await FsProvider.instance.exists(mergeFilePath))) {
        return null;
    }

    try {
        const content = await readSavedEcosystemSchema();
        if (!new VersionNumber(content.version).isEqualTo(ManagerInformation.VERSION)) {
            return null;
        }
        return content;
    } catch (e) {
        const err = e as unknown as Error;
        LoggerProvider.instance.Log(
            LogSeverity.ERROR,
            `Failed to load cached ecosystem schema, falling back to bundled schema\n${err.message}`
        );
        return null;
    }
}

async function resolveCachedEcosystemSchema(): Promise<ThunderstoreEcosystem> {
    const content = await loadSavedEcosystemSchema();
    if (content != null) {
        return content;
    }
    return loadBundledSchema();
}

async function internalUpdateEcosystemReactives(schema: ThunderstoreEcosystem): Promise<void> {
    const result: [string, R2Modman][] = []
    for (const [identifier, game] of Object.entries(schema.games)) {
        if (game.r2modman == null) continue;
        for (const entry of game.r2modman) {
            result.push([identifier, entry]);
        }
    }
    console.log(result);
    EcosystemSupportedGames.value = result;
    EcosystemModloaderPackages.value = schema.modloaderPackages;
    updateModLoaderExports();
}

export async function updateEcosystemReactives() {
    const mergedSchema = await resolveCachedEcosystemSchema();
    await internalUpdateEcosystemReactives(mergedSchema);
}

export async function useBundledForEcosystemReactives() {
    const bundledSchema = await loadBundledSchema();
    await internalUpdateEcosystemReactives(bundledSchema);
}
