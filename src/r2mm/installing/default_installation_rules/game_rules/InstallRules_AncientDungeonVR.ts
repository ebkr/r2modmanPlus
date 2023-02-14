import type { CoreRuleType } from '../../InstallationRules';
import * as path from 'path';

export function InstallRules_AncientDungeonVR(): CoreRuleType {

    return {
        gameName: 'AncientDungeonVR',
        rules: [
            {
                route: path.join('mods'),
                isDefaultLocation: true,
                defaultFileExtensions: [],
                trackingMethod: 'SUBDIR_NO_FLATTEN',
                subRoutes: []
            },
        ]
    };

}

