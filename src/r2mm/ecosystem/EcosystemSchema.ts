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
import LoggerProvider, {LogSeverity} from "src/providers/ror2/logging/LoggerProvider";

export type VersionedThunderstoreEcosystem = ThunderstoreEcosystem & {version: string};

async function getMergedEcosystemPath(): Promise<string> {
    return path.join(PathResolver.ROOT, "latest-ecosystem-schema.json");
}

export async function updateLatestEcosystemSchema(): Promise<void> {
    const latestSchema = await fetchLatestSchema();
    await writeLatestEcosystemSchema(latestSchema);
    await internalUpdateEcosystemReactives(latestSchema);
}

async function writeLatestEcosystemSchema(schema: ThunderstoreEcosystem): Promise<void> {
    const asMergedSchema: VersionedThunderstoreEcosystem = {
        ...schema,
        version: ManagerInformation.VERSION.toString(),
    };
    const writable = JSON.stringify(asMergedSchema);
    return FsProvider.instance.writeFile(await getMergedEcosystemPath(), writable);
}

async function getLastSavedEcosystemSchema(): Promise<VersionedThunderstoreEcosystem> {
    const contentBuffer = await FsProvider.instance.readFile(await getMergedEcosystemPath());
    const content = contentBuffer.toString("utf8");
    return JSON.parse(content);
}

async function loadBundledSchema(): Promise<ThunderstoreEcosystem> {
    const ajv = new Ajv();
    addFormats(ajv);

    const validate = ajv.compile(jsonSchema);
    const isOk = validate(bundledEcosystem);

    if (!isOk) {
        throw new R2Error("Schema validation error", ajv.errorsText(validate.errors));
    }

    return bundledEcosystem as ThunderstoreEcosystem;
}

async function fetchLatestSchema(): Promise<ThunderstoreEcosystem> {
    // TODO - Implement fetching of latest resource
    return {
        schemaVersion: "",
        communities: {},
        games: {},
        modloaderPackages: [],
        packageInstallers: {},
    };
}

async function resolveCachedEcosystemSchema(): Promise<VersionedThunderstoreEcosystem> {
    const mergeFilePath = await getMergedEcosystemPath();
    const bundledSchema = async () => ({...(await loadBundledSchema()), version: ManagerInformation.VERSION.toString()});
    if (!(await FsProvider.instance.exists(mergeFilePath))) {
        return bundledSchema();
    }
    let content: VersionedThunderstoreEcosystem;
    try {
        content = await getLastSavedEcosystemSchema();
    } catch (e) {
        const err = e as unknown as Error;
        LoggerProvider.instance.Log(
            LogSeverity.ERROR,
            `Failed to load cached ecosystem schema, falling back to bundled schema\n${err.message}`
        );
        return bundledSchema();
    }
    if (!new VersionNumber(content.version).isEqualTo(ManagerInformation.VERSION)) {
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
    const mergedSchema = await resolveCachedEcosystemSchema();
    await internalUpdateEcosystemReactives(mergedSchema);
}
