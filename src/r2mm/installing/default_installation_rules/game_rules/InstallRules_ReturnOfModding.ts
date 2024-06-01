import type { CoreRuleType } from '../../InstallationRules';
import * as path from 'path';
import { GAME_NAME } from '../../profile_installers/ModLoaderVariantRecord';
import { RuleSubtype } from "../../InstallationRules";

export function buildReturnOfModdingRules(gameName: GAME_NAME, extraRules?: RuleSubtype[]): CoreRuleType {
    return {
        gameName: gameName,
        rules: [
            {
                route: path.join("ReturnOfModding", "plugins"),
                isDefaultLocation: true,
                defaultFileExtensions: [".lua"],
                trackingMethod: "SUBDIR",
                subRoutes: []
            },
            {
                route: path.join("ReturnOfModding", "plugins_data"),
                defaultFileExtensions: [],
                trackingMethod: "SUBDIR",
                subRoutes: []
            },
            {
                route: path.join("ReturnOfModding", "config"),
                defaultFileExtensions: [],
                trackingMethod: "SUBDIR",
                subRoutes: []
            },
            ...(extraRules ? extraRules : []),
        ],
    }
}
