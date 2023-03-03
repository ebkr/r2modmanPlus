import type { CoreRuleType } from '../../InstallationRules';
import * as path from 'path';
import { GAME_NAME } from "../../profile_installers/ModLoaderVariantRecord";
import { RuleSubtype } from "../../InstallationRules";


export function buildMelonLoaderRules(gameName: GAME_NAME, extraRules?: RuleSubtype[]): CoreRuleType {
    return {
        gameName: gameName,
        relativeFileExclusions: ["manifest.json", "icon.png", "README.md", "LICENCE"],
        rules: [
            {
                route: path.join('Mods'),
                defaultFileExtensions: ['.dll'],
                trackingMethod: 'STATE',
                subRoutes: []
            },
            {
                route: path.join('UserData', 'ModManager'),
                isDefaultLocation: true,
                defaultFileExtensions: [],
                trackingMethod: 'SUBDIR_NO_FLATTEN',
                subRoutes: []
            },
            {
                route: path.join('UserLibs'),
                defaultFileExtensions: ['.lib.dll'],
                trackingMethod: 'STATE',
                subRoutes: []
            },
            {
                route: path.join('MelonLoader'),
                defaultFileExtensions: [],
                trackingMethod: 'STATE',
                subRoutes: [
                    {
                        route: path.join('Managed'),
                        defaultFileExtensions: ['.managed.dll'],
                        trackingMethod: 'STATE',
                        subRoutes: []
                    },
                    {
                        // Unused but kept so anything installed here isn't kept there.
                        route: path.join('Libs'),
                        defaultFileExtensions: [],
                        trackingMethod: 'STATE',
                        subRoutes: []
                    }
                ]
            },
            ...(extraRules ? extraRules : []),
        ],
    }
}
