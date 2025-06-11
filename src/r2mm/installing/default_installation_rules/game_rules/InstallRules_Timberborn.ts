import type { CoreRuleType } from '../../InstallationRules';
import * as path from 'path';

export default function(): CoreRuleType {

    return {
        gameName: "Timberborn",
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
            {
                route: path.join("BepInEx", "Maps"),
                defaultFileExtensions: [],
                trackingMethod: "SUBDIR",
                subRoutes: []
            },
        ],
        relativeFileExclusions: null
    }

}
