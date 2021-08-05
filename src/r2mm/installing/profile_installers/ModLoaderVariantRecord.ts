import ModLoaderPackageMapping from '../../../model/installing/ModLoaderPackageMapping';
import { PackageLoader } from '../../../model/installing/PackageLoader';

/**
 * Used to record which package to handle based on the current game.
 *
 * Mapping is:
 * game's InternalFolderName: Mapping
 */
export const MOD_LOADER_VARIANTS: {[key: string]: ModLoaderPackageMapping[]} = {
    RiskOfRain2: [new ModLoaderPackageMapping("bbepis-BepInExPack", "BepInExPack", PackageLoader.BEPINEX)],
    DysonSphereProgram: [new ModLoaderPackageMapping("xiaoye97-BepInEx", "BepInExPack", PackageLoader.BEPINEX)],
    Valheim: [
        new ModLoaderPackageMapping("denikson-BepInExPack_Valheim", "BepInExPack_Valheim", PackageLoader.BEPINEX),
        new ModLoaderPackageMapping("1F31A-BepInEx_Valheim_Full", "BepInEx_Valheim_Full", PackageLoader.BEPINEX),
    ],
    GTFO: [new ModLoaderPackageMapping("BepInEx-BepInExPack_GTFO", "BepInExPack_GTFO", PackageLoader.BEPINEX)],
    Outward: [new ModLoaderPackageMapping("BepInEx-BepInExPack_Outward", "BepInExPack_Outward", PackageLoader.BEPINEX)],
    TaleSpire: [new ModLoaderPackageMapping("bbepisTaleSpire-BepInExPack", "BepInExPack", PackageLoader.BEPINEX)],
    H3VR: [new ModLoaderPackageMapping("BepInEx-BepInExPack_H3VR", "BepInExPack_H3VR", PackageLoader.BEPINEX)],
    ThunderstoreBeta: [new ModLoaderPackageMapping("bbepis-BepInExPack", "BepInExPack", PackageLoader.BEPINEX)],
    ROUNDS: [new ModLoaderPackageMapping("BepInEx-BepInExPack_ROUNDS", "BepInExPack_ROUNDS", PackageLoader.BEPINEX)],
    Mechanica: [new ModLoaderPackageMapping("Zinal001-BepInExPack_MECHANICA", "BepInExPack_MECHANICA", PackageLoader.BEPINEX)],
    Muck: [new ModLoaderPackageMapping("BepInEx-BepInExPack_Muck", "BepInExPack_Muck", PackageLoader.BEPINEX)],
    BONEWORKS: [new ModLoaderPackageMapping("LavaGang-MelonLoader", "", PackageLoader.MELON_LOADER)]
}
