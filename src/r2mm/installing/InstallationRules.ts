import * as path from 'path';

import { InstallRule as ThunderstoreEcosystemInstallRule } from '../../assets/data/ecosystem.d';
import { EcosystemSchema } from '../../model/schema/ThunderstoreSchema';
import R2Error from '../../model/errors/R2Error';
import GameManager from '../../model/game/GameManager';
import { GetInstallerIdForPlugin } from '../../model/installing/PackageLoader';

export type CoreRuleType = {
    gameName: string,
    rules: RuleSubtype[],
    relativeFileExclusions: string[] | null,
}

type TrackingMethod = "SUBDIR" | "STATE" | "NONE" | "SUBDIR_NO_FLATTEN" | "PACKAGE_ZIP";

export type RuleSubtype = {
    route: string,
    trackingMethod: TrackingMethod,
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

export function trackingMethodFromString(method: string): TrackingMethod {
    switch (method.toLocaleLowerCase()) {
        case "subdir": return "SUBDIR";
        case "state": return "STATE";
        case "none": return "NONE";
        case "subdir-no-flatten": return "SUBDIR_NO_FLATTEN";
        case "package-zip": return "PACKAGE_ZIP";
    }

    throw new R2Error(
        "Invalid tracking method identifier",
        `${method} is not a valid tracking method.`
    );
}

function normalizeRuleSubtype(apiData: ThunderstoreEcosystemInstallRule): RuleSubtype {
    return {
        ...apiData,
        trackingMethod: trackingMethodFromString(apiData.trackingMethod),
        subRoutes: apiData.subRoutes.map(normalizeRuleSubtype)
    };
}

export default class InstallationRules {

    private static _RULES: CoreRuleType[] = [];

    static get RULES(): CoreRuleType[] {
        return [...this._RULES];
    }

    static set RULES(value: CoreRuleType[]) {
        this._RULES = value;
    }

    public static apply() {
        this._RULES = EcosystemSchema.supportedGames.map((x) => ({
            gameName: x.internalFolderName,
            rules: x.installRules.map(normalizeRuleSubtype),
            relativeFileExclusions: x.relativeFileExclusions,
        }));
    }

    public static validate() {
        GameManager.gameList.forEach(value => {
            if (this._RULES.find(rule => rule.gameName === value.internalFolderName) === undefined) {
                if (GetInstallerIdForPlugin(value.packageLoader) === null) {
                    throw new Error(`Missing installation rule for game: ${value.internalFolderName}`);
                }
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
            const route = !pathBuilder ? value.route : path.join(pathBuilder, value.route);
            paths.push({
                route: route,
                trackingMethod: value.trackingMethod,
                extensions: value.defaultFileExtensions,
                isDefaultLocation: value.isDefaultLocation || false,
                ref: value
            });
            this.getAllManagedPaths(value.subRoutes, route).forEach(x => paths.push(x));
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
