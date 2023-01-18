import type { CoreRuleType } from '../../InstallationRules';
import * as path from 'path';
import { GAME_NAME } from '../../profile_installers/ModLoaderVariantRecord';
import { RuleSubtype } from "../../InstallationRules";

export function buildBepInExRules(gameName: GAME_NAME, extraRules?: RuleSubtype[]): CoreRuleType {
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
            },
            ...(extraRules ? extraRules : []),
        ],
    }
}
