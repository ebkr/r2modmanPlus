import {ModloaderPackage, R2Modman as GameConfig} from "../../assets/data/ecosystemTypes";
import {ref} from "@vue/reactivity";

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
