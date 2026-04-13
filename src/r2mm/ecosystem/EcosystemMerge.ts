import bundledEcosystem from "../../assets/data/ecosystem.json";
import {R2Modman, ThunderstoreEcosystem} from "../../assets/data/ecosystemTypes";
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
import {getAxiosWithTimeouts} from "../../utils/HttpUtils";
import {retry} from "../../utils/Common";

type EcosystemCacheMetadata = {
    version: string;
    lastCheckedAt?: number;
    lastModified?: string;
};

type EcosystemCacheWriteMetadata = {
    lastCheckedAt?: number;
    lastModified?: string;
};

type LatestSchemaFetchResult =
    | {kind: "skipped"}
    | {kind: "not-modified", lastCheckedAt: number, lastModified?: string}
    | {kind: "fetched", schema: ThunderstoreEcosystem, lastCheckedAt: number, lastModified?: string}
    | {kind: "failed"};

export type MergedThunderstoreEcosystem = ThunderstoreEcosystem & EcosystemCacheMetadata;

const ECOSYSTEM_DATA_URL = "https://thunderstore.io/api/experimental/schema/dev/latest/";
const ECOSYSTEM_REFRESH_INTERVAL_MS = 12 * 60 * 60 * 1000;

function createEmptySchema(): ThunderstoreEcosystem {
    return {
        schemaVersion: "",
        communities: {},
        games: {},
        modloaderPackages: [],
        packageInstallers: {},
    };
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

function isSchemaRefreshDue(schema: MergedThunderstoreEcosystem | null): boolean {
    if (schema == null || schema.lastCheckedAt == null) {
        return true;
    }
    return (Date.now() - schema.lastCheckedAt) >= ECOSYSTEM_REFRESH_INTERVAL_MS;
}

function mergeSchemas(
    bundledSchema: ThunderstoreEcosystem,
    latestSchema: ThunderstoreEcosystem
): ThunderstoreEcosystem {
    const mergedSchema: ThunderstoreEcosystem = createEmptySchema();
    mergedSchema.schemaVersion = latestSchema.schemaVersion;
    mergedSchema.communities = {
        ...bundledSchema.communities,
        ...latestSchema.communities,
    }
    mergedSchema.games = {
        ...bundledSchema.games,
        ...latestSchema.games,
    };
    // Convert to map to handle duplicate keys nicely
    const modloaderMap = new Map(
        [...bundledSchema.modloaderPackages, ...latestSchema.modloaderPackages]
            .map(pkg => [pkg.packageId, pkg])
    );
    mergedSchema.modloaderPackages = [...modloaderMap.values()];
    mergedSchema.packageInstallers = {
        ...bundledSchema.packageInstallers,
        ...latestSchema.packageInstallers,
    };
    return mergedSchema;
}

function createCacheMetadata(
    lastCheckedAt: number,
    lastModified?: string
): EcosystemCacheWriteMetadata {
    const metadata: EcosystemCacheWriteMetadata = {lastCheckedAt};
    if (lastModified != null) {
        metadata.lastModified = lastModified;
    }
    return metadata;
}

async function getMergedEcosystemPath(): Promise<string> {
    return path.join(PathResolver.ROOT, "ecosystem-merge.json");
}

export async function updateLatestMergedEcosystemSchema(): Promise<void> {
    const bundledSchema = await loadBundledSchema();
    const currentMergedSchema = await getValidSavedMergedEcosystemSchema();
    const latestSchema = await fetchLatestSchema(currentMergedSchema);

    if (latestSchema.kind === "skipped") {
        return;
    }

    if (latestSchema.kind === "not-modified") {
        if (currentMergedSchema == null) {
            return;
        }

        const lastModified = latestSchema.lastModified ?? currentMergedSchema.lastModified;
        await writeLatestMergedEcosystemSchema(
            currentMergedSchema,
            createCacheMetadata(latestSchema.lastCheckedAt, lastModified)
        );
        return;
    }

    if (latestSchema.kind === "failed") {
        if (currentMergedSchema != null) {
            return;
        }

        const mergedSchema = mergeSchemas(bundledSchema, createEmptySchema());
        await writeLatestMergedEcosystemSchema(mergedSchema);
        await internalUpdateEcosystemReactives(mergedSchema);
        return;
    }

    const mergedSchema = mergeSchemas(bundledSchema, latestSchema.schema);
    await writeLatestMergedEcosystemSchema(
        mergedSchema,
        createCacheMetadata(latestSchema.lastCheckedAt, latestSchema.lastModified)
    );
    await internalUpdateEcosystemReactives(mergedSchema);
}

async function writeLatestMergedEcosystemSchema(
    schema: ThunderstoreEcosystem,
    metadata?: EcosystemCacheWriteMetadata
): Promise<void> {
    const asMergedSchema: MergedThunderstoreEcosystem = {
        ...schema,
        version: ManagerInformation.VERSION.toString(),
        ...(metadata || {}),
    };
    const writable = JSON.stringify(asMergedSchema);
    return FsProvider.instance.writeFile(await getMergedEcosystemPath(), writable);
}

async function getLastSavedMergedEcosystemSchema(): Promise<MergedThunderstoreEcosystem> {
    const contentBuffer = await FsProvider.instance.readFile(await getMergedEcosystemPath());
    const content = contentBuffer.toString("utf8");
    return JSON.parse(content);
}

async function loadBundledSchema(): Promise<ThunderstoreEcosystem> {
    return validateSchema(bundledEcosystem);
}

async function fetchLatestSchema(
    currentSchema: MergedThunderstoreEcosystem | null
): Promise<LatestSchemaFetchResult> {
    if (!isSchemaRefreshDue(currentSchema)) {
        return {kind: "skipped"};
    }

    const timeout = 5000;
    const options = {attempts: 3, interval: 1000, throwLastErrorAsIs: true};
    const requestConfig = {
        validateStatus: (status: number) => status === 304 || (status >= 200 && status < 300),
        ...(currentSchema?.lastModified ? {headers: {"If-Modified-Since": currentSchema.lastModified}} : {}),
    };

    try {
        const axios = getAxiosWithTimeouts(timeout, timeout * 2);
        const response = await retry(
            () => axios.get(ECOSYSTEM_DATA_URL, requestConfig),
            options
        );
        const lastCheckedAt = Date.now();
        const lastModified = typeof response.headers["last-modified"] === "string"
            ? response.headers["last-modified"]
            : undefined;

        if (response.status === 304) {
            return {
                kind: "not-modified",
                lastCheckedAt,
                ...(currentSchema?.lastModified ? {lastModified: currentSchema.lastModified} : {}),
            };
        }

        return {
            kind: "fetched",
            schema: validateSchema(response.data),
            lastCheckedAt,
            ...(lastModified ? {lastModified} : {}),
        };
    } catch (e) {
        console.error(e);
        return {kind: "failed"};
    }
}

async function getValidSavedMergedEcosystemSchema(): Promise<MergedThunderstoreEcosystem | null> {
    const mergeFilePath = await getMergedEcosystemPath();
    if (!(await FsProvider.instance.exists(mergeFilePath))) {
        return null;
    }

    const content = await getLastSavedMergedEcosystemSchema();
    if (!new VersionNumber(content.version).isEqualTo(ManagerInformation.VERSION)) {
        return null;
    }

    return content;
}

async function resolveMergedEcosystemSchema(): Promise<MergedThunderstoreEcosystem> {
    const bundledSchema = async () => ({...(await loadBundledSchema()), version: ManagerInformation.VERSION.toString()});
    const content = await getValidSavedMergedEcosystemSchema();
    if (content == null) {
        return bundledSchema();
    }

    return content;
}

async function internalUpdateEcosystemReactives(schema: ThunderstoreEcosystem): Promise<void> {
    const result: [string, R2Modman][] = []
    for (const [identifier, game] of Object.entries(schema.games)) {
        if (game.r2modman == null) continue;
        for (const entry of game.r2modman) {
            result.push([identifier, entry]);
        }
    }
    EcosystemSupportedGames.value = result;
    EcosystemModloaderPackages.value = schema.modloaderPackages;
    updateModLoaderExports();
}

export async function updateEcosystemReactives() {
    const mergedSchema = await resolveMergedEcosystemSchema();
    await internalUpdateEcosystemReactives(mergedSchema);
}
