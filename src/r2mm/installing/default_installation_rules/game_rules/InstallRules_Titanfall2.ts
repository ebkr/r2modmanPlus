import type { CoreRuleType } from '../../InstallationRules';
import * as path from 'path';

export default function(): CoreRuleType {

    return {
        gameName: "Titanfall2",
        relativeFileExclusions: ["manifest.json", "README.md", "icon.png", "LICENCE"],
        rules: [
            {
                route: path.join("R2Northstar", "mods"),
                defaultFileExtensions: [],
                trackingMethod: "STATE",
                subRoutes: [],
            }
        ]
    }

}

