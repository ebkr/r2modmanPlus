import { PackageLoader } from '../../model/installing/PackageLoader';
import GameManager from '../../model/game/GameManager';

export type RuleType = {
    packageLoader: PackageLoader,
    gameName: string,
    _defaultPath: string,
    rules: {
        [ruleDef: string]: any,
    }
}

export default class InstallationRules {

    private static _RULES: RuleType[] = [];

    static get RULES(): RuleType[] {
        return [...this._RULES];
    }

    static set RULES(value: RuleType[]) {
        this._RULES = value;
    }

    public static validate() {
        GameManager.gameList.forEach(value => {
            if (this._RULES.find(rule => rule.gameName === value.internalFolderName) === undefined) {
                throw new Error(`Missing installation rule for game: ${value.internalFolderName}`);
            }
        })
    }

}
