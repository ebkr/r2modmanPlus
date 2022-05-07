import type { CoreRuleType } from '../../InstallationRules';
import * as path from 'path';

export default function(): CoreRuleType {

    return {
        gameName: "Subnautica",
        relativeFileExclusions: ["manifest.json", "icon.png", "README.md"],
        rules: [
            {
                route: path.join("BepInEx", "plugins"),
                isDefaultLocation: true,
                defaultFileExtensions: [".dll"],
                trackingMethod: "STATE",
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
                trackingMethod: "STATE",
                subRoutes: []
            },
            {
                route: path.join("BepInEx", "monomod"),
                defaultFileExtensions: [".mm.dll"],
                trackingMethod: "STATE",
                subRoutes: []
            },
            {
                route: path.join("BepInEx", "config"),
                defaultFileExtensions: [],
                trackingMethod: "NONE",
                subRoutes: []
            },
            {
                route: path.join("QMods"),
                defaultFileExtensions: [],
                trackingMethod: "STATE",
                subRoutes: []
            },
        ]
    }

}
