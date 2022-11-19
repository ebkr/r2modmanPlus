import type { CoreRuleType } from '../../InstallationRules';
import * as path from 'path';

export default function(): CoreRuleType {

    return {
        gameName: 'BONELAB',
        relativeFileExclusions: ["manifest.json", "icon.png", "README.md", "LICENCE"],
        rules: [
            {
                route: path.join('Mods'),
                isDefaultLocation: true,
                defaultFileExtensions: ['.dll'],
                trackingMethod: 'STATE',
                subRoutes: []
            },
            {
                route: path.join('Plugins'),
                defaultFileExtensions: ['.plugin.dll'],
                trackingMethod: 'STATE',
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
            {
                route: path.join('UserData'),
                defaultFileExtensions: [],
                trackingMethod: 'STATE',
                subRoutes: [
                    {
                        route: path.join('CustomItems'),
                        defaultFileExtensions: ['.melon'],
                        trackingMethod: 'STATE',
                        subRoutes: []
                    },
                    {
                        route: path.join('CustomMaps'),
                        defaultFileExtensions: ['.bcm', '.cma'],
                        trackingMethod: 'STATE',
                        subRoutes: []
                    },
                    {
                        route: path.join('PlayerModels'),
                        defaultFileExtensions: ['.body'],
                        trackingMethod: 'STATE',
                        subRoutes: []
                    },
                    {
                        route: path.join('CustomLoadScreens'),
                        defaultFileExtensions: ['.load'],
                        trackingMethod: 'STATE',
                        subRoutes: []
                    },
                    {
                        route: path.join('Music'),
                        defaultFileExtensions: ['.wav'],
                        trackingMethod: 'STATE',
                        subRoutes: []
                    },
                    {
                        route: path.join('Food'),
                        defaultFileExtensions: ['.food'],
                        trackingMethod: 'STATE',
                        subRoutes: []
                    },
                    {
                        route: path.join('Scoreworks'),
                        defaultFileExtensions: ['.sw'],
                        trackingMethod: 'STATE',
                        subRoutes: []
                    },
                    {
                        route: path.join('CustomSkins'),
                        defaultFileExtensions: ['.png'],
                        trackingMethod: 'STATE',
                        subRoutes: []
                    },
                    {
                        route: path.join('Grenades'),
                        defaultFileExtensions: ['.grenade'],
                        trackingMethod: 'STATE',
                        subRoutes: []
                    }
                ]
            }
        ]
    };

}

