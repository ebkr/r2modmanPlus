import type { RuleType } from '../../InstallationRules';
import { PackageLoader } from '../../../../model/installing/PackageLoader';

export default function(): RuleType {

    return {
        gameName: "",
        packageLoader: PackageLoader.BEPINEX,
        _defaultPath: "",
        rules: {}
    }

}
