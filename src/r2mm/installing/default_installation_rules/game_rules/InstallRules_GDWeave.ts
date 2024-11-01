import type { CoreRuleType } from '../../InstallationRules';
import * as path from 'path';
import { GAME_NAME } from '../../profile_installers/ModLoaderVariantRecord';
import { RuleSubtype } from "../../InstallationRules";

export function buildGDWeaveRules(gameName: GAME_NAME, extraRules?: RuleSubtype[]): CoreRuleType {
    return {
        gameName: gameName,
        rules: [
            {
                route: path.join("GDWeave", "mods"),
                isDefaultLocation: true,
                defaultFileExtensions: [".dll"],
                trackingMethod: "SUBDIR",
                subRoutes: []
            },
            {
                route: path.join("GDWeave", "core"),
                defaultFileExtensions: [],
                trackingMethod: "SUBDIR",
                subRoutes: []
            },
            {
                route: path.join("GDWeave", "config"),
                defaultFileExtensions: [],
                trackingMethod: "NONE",
                subRoutes: []
            },
            ...(extraRules ? extraRules : []),
        ],
    }
}
