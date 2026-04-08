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

export type MergedThunderstoreEcosystem = ThunderstoreEcosystem & {version: string};

async function getMergedEcosystemPath(): Promise<string> {
    return path.join(PathResolver.ROOT, "ecosystem-merge.json");
}

export async function updateLatestMergedEcosystemSchema(): Promise<void> {
    const bundledSchema = await loadBundledSchema();
    const latestSchema = await fetchLatestSchema();
    const mergedSchema: ThunderstoreEcosystem = {
        schemaVersion: "",
        communities: {},
        games: {},
        modloaderPackages: [],
        packageInstallers: {},
    };
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
    await writeLatestMergedEcosystemSchema(mergedSchema);
    await internalUpdateEcosystemReactives(mergedSchema);
}

async function writeLatestMergedEcosystemSchema(schema: ThunderstoreEcosystem): Promise<void> {
    const asMergedSchema: MergedThunderstoreEcosystem = {
        ...schema,
        version: ManagerInformation.VERSION.toString(),
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

async function resolveMergedEcosystemSchema(): Promise<MergedThunderstoreEcosystem> {
    const mergeFilePath = await getMergedEcosystemPath();
    const bundledSchema = async () => ({...(await loadBundledSchema()), version: ManagerInformation.VERSION.toString()});
    if (!(await FsProvider.instance.exists(mergeFilePath))) {
        return bundledSchema();
    }
    const content = await getLastSavedMergedEcosystemSchema();
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
}

export async function updateEcosystemReactives() {
    const mergedSchema = await resolveMergedEcosystemSchema();
    await internalUpdateEcosystemReactives(mergedSchema);
}
