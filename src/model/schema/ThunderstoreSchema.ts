import {ModloaderPackage, R2Modman as GameConfig} from "../../assets/data/ecosystemTypes";
import {ref} from "vue";

// Re-export generated types/Enums to avoid having the whole codebase
// tightly coupled with the generated ecosystemTypes.
export {
    GameInstanceType,
    GameSelectionDisplayMode,
    Loader as PackageLoader,
    TrackingMethod,
    Platform,
} from "../../assets/data/ecosystemTypes";

export const EcosystemSupportedGames = ref<[string, GameConfig][]>([]);
export const EcosystemModloaderPackages = ref<ModloaderPackage[]>([]);

export function getGameConfigBySettingsIdentifier(settingsIdentifier: string): GameConfig | undefined {
    const config = EcosystemSupportedGames.value.find(
        ([_id, config]) => config.settingsIdentifier === settingsIdentifier
    );

    return config ? config[1] : undefined;
}

/**
 * @param packageId Package's name in "TeamName-PackageName" format excluding version number.
 */
export function getModLoaderMapping(packageId: string): ModloaderPackage|undefined {
    return EcosystemModloaderPackages.value.find(pkg => pkg.packageId.toLowerCase() === packageId.toLowerCase());
}

/**
 * @param packageId Package's name in "TeamName-PackageName" format excluding version number.
 * @param settingsIdentifier Game's settings identifier.
 */
export function getRecommendedVersion(packageId: string, settingsIdentifier: string): string|undefined {
    // Use hardcoded values until this information available via Thunderstore Ecosystem API.
    if (packageId === "LavaGang-MelonLoader" && settingsIdentifier === "BONEWORKS") {
        return "0.5.4";
    }

    return undefined;
}

/**
 * @param packageId Package's name in "TeamName-PackageName" format excluding version number.
 */
export function isModLoaderPackage(packageId: string): boolean {
    return EcosystemModloaderPackages.value.some(pkg => pkg.packageId.toLowerCase() === packageId.toLowerCase());
}
