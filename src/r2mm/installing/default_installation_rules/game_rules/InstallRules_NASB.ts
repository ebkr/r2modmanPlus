import type { CoreRuleType } from '../../InstallationRules';
import * as path from 'path';

export default function(): CoreRuleType {

    return {
        gameName: "NASB",
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
                route: path.join("BepInEx", "CustomSongs"),
                defaultFileExtensions: [],
                trackingMethod: 'STATE',
                subRoutes: []
            },
            {
                route: path.join("BepInEx", "Voicepacks"),
                defaultFileExtensions: [".voicepack"],
                trackingMethod: 'SUBDIR',
                subRoutes: []
            },
            {
                route: path.join("BepInEx", "Skins"),
                defaultFileExtensions: [".nasbskin"],
                trackingMethod: 'SUBDIR',
                subRoutes: []
            }
        ]
    }

}
