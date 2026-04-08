import {ModloaderPackage, R2Modman} from "../../assets/data/ecosystemTypes";
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

export const EcosystemSupportedGames = ref<[string, R2Modman][]>([]);
export const EcosystemModloaderPackages = ref<ModloaderPackage[]>([]);
