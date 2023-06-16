import ThunderstoreMod from '../../model/ThunderstoreMod';
import Game from '../../model/game/Game';
import ApiResponse from '../../model/api/ApiResponse';
import ConnectionProvider from '../../providers/generic/connection/ConnectionProvider';
import ThunderstoreVersion from 'src/model/ThunderstoreVersion';

export default class ThunderstorePackages {

    public static PACKAGES: ThunderstoreMod[] = [];
    public static PACKAGES_MAP: Map<String, ThunderstoreMod> = new Map();
    public static VERSIONS_MAP: Map<String, ThunderstoreVersion> = new Map();
    public static EXCLUSIONS: string[] = [];

    /**
     * Fetch latest V1 API data and apply to {PACKAGES}
     */
    public static async update(game: Game) {
        this.EXCLUSIONS = await ConnectionProvider.instance.getExclusions();
        const response = await ConnectionProvider.instance.getPackages(game);
        this.handlePackageApiResponse(response);

        return response;
    }

    /**
     * Transform {response.data} to ThunderstoreMod list and map.
     * @param response api/v1/package data.
     */
    public static handlePackageApiResponse(response: ApiResponse) {
        ThunderstorePackages.PACKAGES = response.data
            .map(ThunderstoreMod.parseFromThunderstoreData)
            .filter((mod) => !ThunderstorePackages.EXCLUSIONS.includes(mod.getFullName()));

        ThunderstorePackages.PACKAGES_MAP = ThunderstorePackages.PACKAGES.reduce((map, pkg) => {
            map.set(pkg.getFullName(), pkg);
            return map;
        }, new Map<String, ThunderstoreMod>());

        ThunderstorePackages.VERSIONS_MAP = ThunderstorePackages.PACKAGES
            .flatMap(value => value.getVersions())
            .reduce((map, version) => {
                map.set(version.getFullName(), version);
                return map;
        }, new Map<String, ThunderstoreVersion>())
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
