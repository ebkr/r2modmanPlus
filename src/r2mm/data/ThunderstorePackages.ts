import ThunderstoreMod from '../../model/ThunderstoreMod';
import Game from '../../model/game/Game';
import ApiResponse from '../../model/api/ApiResponse';
import ConnectionProvider from '../../providers/generic/connection/ConnectionProvider';
import * as PackageDb from '../manager/PackageDexieStore';

export default class ThunderstorePackages {

    public static PACKAGES_MAP: Map<String, ThunderstoreMod> = new Map();
    // TODO: would IndexedDB or Vuex be more suitable place for exclusions?
    public static EXCLUSIONS: string[] = [];

    /**
     * Fetch latest V1 API data and apply to {PACKAGES}
     */
    public static async update(game: Game) {
        this.EXCLUSIONS = await ConnectionProvider.instance.getExclusions();
        const response = await ConnectionProvider.instance.getPackages(game);
        await this.handlePackageApiResponse(game.internalFolderName, response);

        return response;
    }

    /**
     * Transform {response.data} to ThunderstoreMod list and map.
     * @param response api/v1/package data.
     */
    public static async handlePackageApiResponse(gameName: string, response: ApiResponse) {
        const packages = response.data
            .filter((p) => !ThunderstorePackages.EXCLUSIONS.includes(p["full_name"]));

        // TODO: see if this can be hooked into the progress bar in Splash screen.
        await PackageDb.updateFromApiResponse(gameName, packages);
    }

    public static getDeprecatedPackageMap(packages: ThunderstoreMod[]): Map<string, boolean> {
        ThunderstorePackages.PACKAGES_MAP = packages.reduce((map, pkg) => {
            map.set(pkg.getFullName(), pkg);
            return map;
        }, new Map<String, ThunderstoreMod>());

        const result = new Map<string, boolean>();
        packages.forEach(pkg => {
            this.populateDeprecatedPackageMapForModChain(pkg, result);
        });
        return result;
    }

    /**
     * TODO: This doesn't really do what the dosctring below says:
     *       deprecated dependencies do NOT mark the dependant deprecated.
     *
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
