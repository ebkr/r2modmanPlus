import { GAME_NAME } from "../../profile_installers/ModLoaderVariantRecord";
import { CoreRuleType } from "../../InstallationRules";
import * as path from 'path';

export function buildGodotMLRules(gameName: GAME_NAME): CoreRuleType {
    return {
        gameName: gameName,
        rules: [
            {
                route: path.join('mods'),
                isDefaultLocation: true,
                defaultFileExtensions: [],
                trackingMethod: 'PACKAGE_ZIP',
                subRoutes: []
            },
        ]
    }
}
