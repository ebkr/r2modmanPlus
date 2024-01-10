import ThunderstoreMod from '../../model/ThunderstoreMod';
import ThunderstoreVersion from '../../model/ThunderstoreVersion';
import ManifestV2 from '../../model/ManifestV2';
import ThunderstorePackages from '../data/ThunderstorePackages';

interface CachedMod {
    tsMod: ThunderstoreMod | undefined;
    isLatest: boolean;
}

interface ModCache {
    [key: string]: CachedMod;
}

export default class ModBridge {
    private static CACHE: ModCache = {}

    public static getLatestVersion(mod: ManifestV2, modList: ThunderstoreMod[]): ThunderstoreVersion | undefined {
        const matchingMod: ThunderstoreMod | undefined = modList.find((tsMod: ThunderstoreMod) => tsMod.getFullName() === mod.getName());
        if (matchingMod === undefined) {
            return;
        }
        // Compare version numbers and reduce.
        return matchingMod.getVersions().reduce(reduceToNewestVersion);
    }

    public static getThunderstoreModFromMod(mod: ManifestV2, modList: ThunderstoreMod[]): ThunderstoreMod | undefined {
        return modList.find((tsMod: ThunderstoreMod) => tsMod.getFullName() === mod.getName());
    }

    public static isLatestVersion(vueMod: any): boolean {
        const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
        const latestVersion: ThunderstoreVersion | void = ModBridge.getLatestVersion(mod, ThunderstorePackages.PACKAGES);
        if (latestVersion instanceof ThunderstoreVersion) {
            return mod.getVersionNumber().isEqualOrNewerThan(latestVersion.getVersionNumber());
        }
        return true;
    }

    private static getCached(mod: ManifestV2): CachedMod {
        const cacheKey = `${mod.getName()}-${mod.getVersionNumber()}`;

        if (ModBridge.CACHE[cacheKey] === undefined) {
            const tsMod = ThunderstorePackages.PACKAGES.find((tsMod) => tsMod.getFullName() === mod.getName());

            if (tsMod === undefined) {
                ModBridge.CACHE[cacheKey] = { tsMod: undefined, isLatest: true };
            } else {
                const latestVersion = tsMod.getVersions().reduce(reduceToNewestVersion);
                const isLatest = mod.getVersionNumber().isEqualOrNewerThan(latestVersion.getVersionNumber());
                ModBridge.CACHE[cacheKey] = { tsMod, isLatest };
            }
        }

        return ModBridge.CACHE[cacheKey];
    }

    public static getCachedThunderstoreModFromMod(mod: ManifestV2): ThunderstoreMod | undefined {
        return ModBridge.getCached(mod).tsMod;
    }

    public static isCachedLatestVersion(mod: ManifestV2): boolean {
        return ModBridge.getCached(mod).isLatest;
    }

    public static clearCache() {
        ModBridge.CACHE = {};
    }
}

const reduceToNewestVersion = (v1: ThunderstoreVersion, v2: ThunderstoreVersion) => {
    if (v1.getVersionNumber().isNewerThan(v2.getVersionNumber())) {
        return v1;
    }
    return v2;
};
