import ThunderstoreMod from '../../model/ThunderstoreMod';
import axios from 'axios';
import Game from '../../model/game/Game';
import ApiCacheUtils from '../../utils/ApiCacheUtils';
import ApiResponse from '../../model/api/ApiResponse';
import LoggerProvider, { LogSeverity } from '../../providers/ror2/logging/LoggerProvider';
import ConnectionProvider from '../../providers/generic/connection/ConnectionProvider';

export default class ThunderstorePackages {

    public static PACKAGES: ThunderstoreMod[] = [];
    public static PACKAGES_MAP: Map<String, ThunderstoreMod> = new Map();
    public static EXCLUSIONS: Map<string, boolean> = new Map<string, boolean>();

    /**
     * Fetch latest V1 API data and apply to {PACKAGES}
     * @return Empty promise
     */
    public static async update(game: Game): Promise<any> {
        this.EXCLUSIONS = await ConnectionProvider.instance.getExclusions();
        return axios.get(game.thunderstoreUrl, {
            timeout: 30000
        })
            .then(value => {
                this.handlePackageApiResponse(value);
                return value;
            });
    }

    /**
     * Transform {response.data} to ThunderstoreMod list.
     * @param response api/v1/package data.
     */
    public static handlePackageApiResponse(response: ApiResponse) {
        ApiCacheUtils.storeLastRequest(response.data);
        let tsMods: ThunderstoreMod[] = [];
        if (response.data !== undefined) {
            response.data.forEach((mod: any) => {
                let tsMod = new ThunderstoreMod().parseFromThunderstoreData(mod);
                if (!ThunderstorePackages.EXCLUSIONS.has(tsMod.getFullName())) {
                    tsMods.push(tsMod.parseFromThunderstoreData(mod));
                }
            });
        } else {
            LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, `Response data from API was undefined: ${JSON.stringify(response)}`);
        }
        var tsPackageMap = tsMods.reduce((map, pkg) => {
            (map as Map<String, ThunderstoreMod>).set(pkg.getFullName(), pkg);
            return map;
        }, new Map<String, ThunderstoreMod>());
        [ThunderstorePackages.PACKAGES, ThunderstorePackages.PACKAGES_MAP] = [tsMods, tsPackageMap];
    }

    public static getDeprecatedPackageMap(): Map<string, boolean> {
        const result = new Map<string, boolean>();
        this.PACKAGES.forEach(pkg => {
            this.populateDeprecatedPackageMapForModChain(pkg, result);
        });
        return result;
    }

    /**
     * "Smart" package deprecation determination by keeping track of previously determine dependencies.
     * This ensures that we hit as few iterations as possible to speed up calculation time.
     *
     * @param mod The mod to check for deprecation status / deprecated dependencies
     * @param map A map to record previously hit items
     * @private
     */
    private static populateDeprecatedPackageMapForModChain(mod: ThunderstoreMod, map: Map<string, boolean>) {
        if (map.get(mod.getFullName()) != undefined) {
            return; // Deprecation status has already been decided.
        } else {
            if (mod.isDeprecated()) {
                map.set(mod.getFullName(), true);
            } else {
                for (const value of mod.getDependencies()) {
                    const tsVariant = this.PACKAGES_MAP.get(value)
                    if (tsVariant === undefined) {
                        continue;
                    }
                    this.populateDeprecatedPackageMapForModChain(tsVariant, map);
                }
                // If mod was not set down the chain then has no deprecated dependencies.
                // This means the mod does not result in a deprecation status.
                if (map.get(mod.getFullName()) === undefined) {
                    map.set(mod.getFullName(), false);
                }
            }
        }
    }

}
