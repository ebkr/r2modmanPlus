import type { RuleType } from '../../InstallationRules';
import { PackageLoader } from '../../../../model/installing/PackageLoader';
import * as path from 'path';

export default function(): RuleType {

    return {
        gameName: "H3VR",
        packageLoader: PackageLoader.BEPINEX,
        rules: {
            _defaultPath: path.join("BepInEx", "plugins"),
            core: path.join("BepInEx", "core"),
            patchers: path.join("BepInEx", "patchers"),
            monomod: path.join("BepInEx", "monomod"),
            plugins: path.join("BepInEx", "plugins"),
            config: path.join("BepInEx", "config"),
            Sideloader: path.join("BepInEx", "Sideloader"),
        }
    }

}
