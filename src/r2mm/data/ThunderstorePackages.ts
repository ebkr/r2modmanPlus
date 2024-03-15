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

        const deprecationMap = new Map<string, boolean>();
        const currentChain = new Set<string>();

        packages.forEach(pkg => {
            this._populateDeprecatedPackageMapForModChain(pkg, deprecationMap, currentChain);
        });

        return deprecationMap;
    }

    /**
     * "Smart" package deprecation determination by keeping track of previously determined dependencies.
     * This ensures that we hit as few iterations as possible to speed up calculation time.
     *
     * @param mod The mod to check for deprecation status / deprecated dependencies
     * @param deprecationMap A map to record previously hit items
     * @param currentChain A set to record recursion stack to avoid infinite loops
     * @public (to allow tests to mock the function)
     */
    public static _populateDeprecatedPackageMapForModChain(
        mod: ThunderstoreMod,
        deprecationMap: Map<string, boolean>,
        currentChain: Set<string>
    ): boolean {
        const previouslyCalculatedValue = deprecationMap.get(mod.getFullName());
        if (previouslyCalculatedValue !== undefined) {
            return previouslyCalculatedValue;
        }

        // No need to check dependencies if the mod itself is deprecated.
        // Dependencies will be checked by the for-loop in the calling
        // function anyway.
        if (mod.isDeprecated()) {
            deprecationMap.set(mod.getFullName(), true);
            return true;
        }

        for (const dependencyNameAndVersion of mod.getLatestVersion().getDependencies()) {
            const dependencyName = dependencyNameAndVersion.substring(0, dependencyNameAndVersion.lastIndexOf('-'));

            if (currentChain.has(dependencyName)) {
                continue;
            }
            const dependency = this.PACKAGES_MAP.get(dependencyName);

            // Package isn't available on Thunderstore, so we can't tell
            // if it's deprecated or not. This will also include deps of
            // packages uploaded into wrong community since the
            // PACKAGES_MAP contains only packages from this community.
            // Based on manual testing with real data, caching these to
            // deprecationMap doesn't seem to improve overall performance.
            if (dependency === undefined) {
                continue;
            }

            // Keep track of the dependency chain currently under
            // investigation to avoid infinite recursive loops.
            currentChain.add(mod.getFullName());
            const dependencyDeprecated = this._populateDeprecatedPackageMapForModChain(
                dependency, deprecationMap, currentChain
            );
            currentChain.delete(mod.getFullName());
            deprecationMap.set(dependencyName, dependencyDeprecated);

            // Eject early on the first deprecated dependency for performance.
            if (dependencyDeprecated) {
                deprecationMap.set(mod.getFullName(), true);
                return true;
            }
        }

        // Package is not depreceated by itself nor due to dependencies.
        deprecationMap.set(mod.getFullName(), false);
        return false;
    }
}
