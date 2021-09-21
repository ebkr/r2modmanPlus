import type { RuleType } from '../../InstallationRules';
import { PackageLoader } from '../../../../model/installing/PackageLoader';
import * as path from 'path';

export default function(): RuleType {

    return {
        gameName: "BONEWORKS",
        packageLoader: PackageLoader.MELON_LOADER,
        _defaultPath: "Mods",
        rules: {
            Mods: {_files: [".dll"]},
            Plugins: {_files: [".plugin.dll"]},
            MelonLoader: {
                Managed: {_files: [".managed.dll"]},
                Libs: {_files: [".lib.dll"]}
            },
            UserData: {
                CustomItems: {_files: [".melon"]},
                CustomMaps: {_files: [".bcm", ".cma"]},
                PlayerModels: {_files: [".body"]},
                CustomLoadScreens: {_files: [".load"]},
                Music: {_files: [".wav"]},
                Food: {_files: [".food"]},
                Scoreworks: {_files: [".sw"]},
                CustomSkins: {_files: [".png"]},
                Grenades: {_files: [".grenade"]}
            }
        }
    }

}
