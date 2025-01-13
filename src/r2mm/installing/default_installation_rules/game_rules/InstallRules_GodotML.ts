import { CoreRuleType } from "../../InstallationRules";
import * as path from 'path';

export function buildGodotMLRules(gameName: string): CoreRuleType {
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
