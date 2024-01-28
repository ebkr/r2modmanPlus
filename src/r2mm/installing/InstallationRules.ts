import GameManager from '../../model/game/GameManager';
import * as path from 'path';
import { GAME_NAME } from '../../r2mm/installing/profile_installers/ModLoaderVariantRecord';

export type CoreRuleType = {
    gameName: GAME_NAME,
    rules: RuleSubtype[],
    relativeFileExclusions?: string[],
}

export type RuleSubtype = {
    route: string,
    trackingMethod: "SUBDIR" | "STATE" | "NONE" | "SUBDIR_NO_FLATTEN" | "PACKAGE_ZIP" | "SUBDIR_TRACKED",
    subRoutes: RuleSubtype[],
    defaultFileExtensions: string[],
    isDefaultLocation?: boolean
}

export type ManagedRule = {
    route: string,
    ref: RuleSubtype,
    trackingMethod: string,
    extensions: string[],
    isDefaultLocation: boolean
}

export default class InstallationRules {

    private static _RULES: CoreRuleType[] = [];

    static get RULES(): CoreRuleType[] {
        return [...this._RULES];
    }

    static set RULES(value: CoreRuleType[]) {
        this._RULES = value;
    }

    public static validate() {
        GameManager.gameList.forEach(value => {
            if (this._RULES.find(rule => rule.gameName === value.internalFolderName) === undefined) {
                throw new Error(`Missing installation rule for game: ${value.internalFolderName}`);
            }
        })
    }

    /**
     * Produce a flattened structure of all navigable paths maintained by the install rules.
     * @param rules
     * @param pathBuilder
     */
    public static getAllManagedPaths(rules: RuleSubtype[], pathBuilder?: string): ManagedRule[] {
        const paths: ManagedRule[] = [];
        rules.forEach(value => {
            if (pathBuilder === undefined) {
                paths.push({
                    route: value.route,
                    trackingMethod: value.trackingMethod,
                    extensions: value.defaultFileExtensions,
                    isDefaultLocation: value.isDefaultLocation || false,
                    ref: value
                });
            } else {
                paths.push({
                    route: path.join(pathBuilder, value.route),
                    trackingMethod: value.trackingMethod,
                    extensions: value.defaultFileExtensions,
                    isDefaultLocation: value.isDefaultLocation || false,
                    ref: value
                });
            }
            let subPath = pathBuilder === undefined ? value.route : path.join(pathBuilder, value.route);
            this.getAllManagedPaths(value.subRoutes, subPath).forEach(value1 => {
                paths.push(value1);
            });
        });
        return paths;
    }

    public static getRuleSubtypeFromManagedRule(managedRule: ManagedRule, rule: CoreRuleType): RuleSubtype {
        for (const value of rule.rules) {
            if (value.route === managedRule.route) {
                return value;
            } else {
                const nested = this.getRuleSubtypeFromManagedRuleInner(managedRule, value, value.route);
                if (nested !== undefined) {
                    return nested;
                }
            }
        }
        console.log("ManagedRule:", managedRule);
        throw new Error("RuleSubtype does not exist for ManagedRule.");
    }

    private static getRuleSubtypeFromManagedRuleInner(managedRule: ManagedRule, subType: RuleSubtype, realRoute: string): RuleSubtype | undefined {
        if (realRoute === managedRule.route) {
            return subType;
        } else {
            for (const subRoute of subType.subRoutes) {
                const nested = this.getRuleSubtypeFromManagedRuleInner(managedRule, subRoute, path.join(realRoute, subRoute.route));
                if (nested !== undefined) {
                    return nested;
                }
            }
        }
        return;
    }

    public static getManagedRuleForSubtype(rule: CoreRuleType, subType: RuleSubtype): ManagedRule {
        return this.getAllManagedPaths(rule.rules).find(value => this.getRuleSubtypeFromManagedRule(value, rule) === subType)!;
    }

}
