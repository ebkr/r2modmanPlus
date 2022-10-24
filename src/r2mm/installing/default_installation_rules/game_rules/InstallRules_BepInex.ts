import type { CoreRuleType } from '../../InstallationRules';
import * as path from 'path';
import { MOD_LOADER_VARIANTS } from '../../profile_installers/ModLoaderVariantRecord';

export function buildBepInExRules(gameName: keyof typeof MOD_LOADER_VARIANTS): CoreRuleType {
    return {
        gameName: gameName,
        rules: [
            {
                route: path.join("BepInEx", "plugins"),
                isDefaultLocation: true,
                defaultFileExtensions: [".dll"],
                trackingMethod: "SUBDIR",
                subRoutes: []
            },
            {
                route: path.join("BepInEx", "core"),
                defaultFileExtensions: [],
                trackingMethod: "SUBDIR",
                subRoutes: []
            },
            {
                route: path.join("BepInEx", "patchers"),
                defaultFileExtensions: [],
                trackingMethod: "SUBDIR",
                subRoutes: []
            },
            {
                route: path.join("BepInEx", "monomod"),
                defaultFileExtensions: [".mm.dll"],
                trackingMethod: "SUBDIR",
                subRoutes: []
            },
            {
                route: path.join("BepInEx", "config"),
                defaultFileExtensions: [],
                trackingMethod: "NONE",
                subRoutes: []
            }
        ]
    }
}
