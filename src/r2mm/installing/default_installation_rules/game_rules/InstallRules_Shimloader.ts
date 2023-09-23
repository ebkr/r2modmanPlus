import type { CoreRuleType } from '../../InstallationRules';
import * as path from 'path';
import { GAME_NAME } from '../../profile_installers/ModLoaderVariantRecord';
import { RuleSubtype } from "../../InstallationRules";

export function buildShimloaderRules(gameName: GAME_NAME, extraRules?: RuleSubtype[]): CoreRuleType {
    return {
        gameName: gameName,
        relativeFileExclusions: ["manifest.json", "README.md", "icon.png", "LICENCE"],
        rules: [
            {
                route: path.join("shimloader/lua"),
                defaultFileExtensions: [".lua"],
                trackingMethod: "SUBDIR_TRACKED",
                subRoutes: []
            },
            {
                route: path.join("shimloader/pak"),
                defaultFileExtensions: [".pak"],
                trackingMethod: "SUBDIR_TRACKED",
                subRoutes: [],
            },
            {
                route: path.join("shimloader/cfg"),
                defaultFileExtensions: [".cfg"],
                trackingMethod: "NONE",
                subRoutes: [],
            }
        ]
    }
}
