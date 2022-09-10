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
    ThunderstoreDev: [new ModLoaderPackageMapping("xiaoxiao921-BepInExPack", "BepInExPack", PackageLoader.BEPINEX)],
    DysonSphereProgram: [new ModLoaderPackageMapping("xiaoye97-BepInEx", "BepInExPack", PackageLoader.BEPINEX)],
    Valheim: [
        new ModLoaderPackageMapping("denikson-BepInExPack_Valheim", "BepInExPack_Valheim", PackageLoader.BEPINEX),
        new ModLoaderPackageMapping("1F31A-BepInEx_Valheim_Full", "BepInEx_Valheim_Full", PackageLoader.BEPINEX),
    ],
    GTFO: [new ModLoaderPackageMapping("BepInEx-BepInExPack_GTFO", "BepInExPack_GTFO", PackageLoader.BEPINEX)],
    Outward: [new ModLoaderPackageMapping("BepInEx-BepInExPack_Outward", "BepInExPack_Outward", PackageLoader.BEPINEX)],
    OutwardDe: [new ModLoaderPackageMapping("BepInEx-BepInExPack_Outward", "BepInExPack_Outward", PackageLoader.BEPINEX)],
    TaleSpire: [new ModLoaderPackageMapping("bbepisTaleSpire-BepInExPack", "BepInExPack", PackageLoader.BEPINEX)],
    H3VR: [new ModLoaderPackageMapping("BepInEx-BepInExPack_H3VR", "BepInExPack_H3VR", PackageLoader.BEPINEX)],
    ThunderstoreBeta: [new ModLoaderPackageMapping("bbepis-BepInExPack", "BepInExPack", PackageLoader.BEPINEX)],
    ROUNDS: [new ModLoaderPackageMapping("BepInEx-BepInExPack_ROUNDS", "BepInExPack_ROUNDS", PackageLoader.BEPINEX)],
    Mechanica: [new ModLoaderPackageMapping("Zinal001-BepInExPack_MECHANICA", "BepInExPack_MECHANICA", PackageLoader.BEPINEX)],
    Muck: [new ModLoaderPackageMapping("BepInEx-BepInExPack_Muck", "BepInExPack_Muck", PackageLoader.BEPINEX)],
    BONEWORKS: [new ModLoaderPackageMapping("LavaGang-MelonLoader", "", PackageLoader.MELON_LOADER)],
    LethalLeagueBlaze: [new ModLoaderPackageMapping("BepInEx-BepInExPack_LLBlaze", "BepInExPack_LLBlaze", PackageLoader.BEPINEX)],
    Timberborn: [new ModLoaderPackageMapping("BepInEx-BepInExPack_Timberborn", "BepInExPack_Timberborn", PackageLoader.BEPINEX)],
    TABS: [new ModLoaderPackageMapping("BepInEx-BepInExPack_TABS", "BepInExPack_TABS", PackageLoader.BEPINEX)],
    NASB: [new ModLoaderPackageMapping("BepInEx-BepInExPack_NASB", "BepInExPack_NASB", PackageLoader.BEPINEX)],
    Inscryption: [new ModLoaderPackageMapping("BepInEx-BepInExPack_Inscryption", "BepInExPack_Inscryption", PackageLoader.BEPINEX)],
    Starsand: [new ModLoaderPackageMapping("BepInEx-BepInExPack_Starsand", "BepInExPack_Starsand", PackageLoader.BEPINEX)],
    CatsAreLiquidABP: [new ModLoaderPackageMapping("BepInEx-BepInExPack_CaLABP", "BepInExPack_CaLABP", PackageLoader.BEPINEX)],
    PotionCraft: [new ModLoaderPackageMapping("BepInEx-BepInExPack_PotionCraft", "BepInExPack_PotionCraft", PackageLoader.BEPINEX)],
    NearlyDead: [new ModLoaderPackageMapping("BepInEx-BepInExPack_NearlyDead", "BepInExPack_NearlyDead", PackageLoader.BEPINEX)],
    AGAINST: [new ModLoaderPackageMapping("BepInEx-BepInExPack_AGAINST", "BepInExPack_AGAINST", PackageLoader.BEPINEX)],
    RogueTower: [new ModLoaderPackageMapping("bbepis-BepInEx_Rogue_Tower", "", PackageLoader.BEPINEX)],
    HOTDS: [new ModLoaderPackageMapping("BepInEx-BepInExPack_HOTDS", "BepInExPack_HOTDS", PackageLoader.BEPINEX)],
    ForTheKing: [new ModLoaderPackageMapping("BepInEx-BepInExPack_ForTheKing", "BepInExPack_ForTheKing", PackageLoader.BEPINEX)],
    Subnautica: [
        new ModLoaderPackageMapping("Subnautica_Modding-BepInExPack_Subnautica", "BepInExPack_Subnautica", PackageLoader.BEPINEX),
        new ModLoaderPackageMapping("Subnautica_Modding-BepInExPack_Subnautica_Experimental", "BepInExPack_Subnautica_Experimental", PackageLoader.BEPINEX)
    ],
    SubnauticaBZ: [new ModLoaderPackageMapping("Subnautica_Modding-BepInExPack_BelowZero", "BepInExPack_BelowZero", PackageLoader.BEPINEX)],
    CoreKeeper: [new ModLoaderPackageMapping("BepInEx-BepInExPack_Core_Keeper", "BepInExPack_Core-Keeper", PackageLoader.BEPINEX)],
    Titanfall2: [new ModLoaderPackageMapping("Northstar-Northstar", "Northstar", PackageLoader.NORTHSTAR)],
    Peglin: [new ModLoaderPackageMapping("BepInEx-BepInExPack_Peglin", "BepInExPack_Peglin", PackageLoader.BEPINEX)],
    VRising: [new ModLoaderPackageMapping("BepInEx-BepInExPack_V_Rising", "BepInExPack_V_Rising", PackageLoader.BEPINEX)],
    HardBullet: [new ModLoaderPackageMapping("LavaGang-MelonLoader", "", PackageLoader.MELON_LOADER)],
    GreenHellVR: [new ModLoaderPackageMapping("PCVR_Modders-BepInExPack_GHVR", "BepInExPack_GHVR", PackageLoader.BEPINEX)],
    "20MinutesTillDawn": [new ModLoaderPackageMapping("BepInExPackMTD-BepInExPack_20MTD", "BepInExPack_20MTD", PackageLoader.BEPINEX)],
    VTOL_VR: [new ModLoaderPackageMapping("BepInEx-BepInExPack_VTOL_VR", "BepInExPack_VTOL_VR", PackageLoader.BEPINEX)],
    BackpackHero: [new ModLoaderPackageMapping("LavaGang-MelonLoader", "", PackageLoader.MELON_LOADER)],
    Stacklands: [new ModLoaderPackageMapping("BepInEx-BepInExPack_Stacklands", "BepInExPack_Stacklands", PackageLoader.BEPINEX)],
    ETG: [new ModLoaderPackageMapping("BepInEx-BepInExPack_EtG", "BepInExPack_EtG", PackageLoader.BEPINEX)],
    Ravenfield: [new ModLoaderPackageMapping("BepInEx-BepInExPack_Ravenfield", "BepInExPack_Ravenfield", PackageLoader.BEPINEX)],
    Aloft: [new ModLoaderPackageMapping("BepInEx-BepInExPack_Aloft", "BepInExPack_Aloft", PackageLoader.BEPINEX)],
}
