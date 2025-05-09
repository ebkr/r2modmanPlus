import Game from "../model/game/Game";
import ManifestV2 from "../model/ManifestV2";
import ThunderstoreCombo from "../model/ThunderstoreCombo";
import ThunderstoreVersion from "../model/ThunderstoreVersion";
import { getCombosByDependencyStrings } from '../r2mm/manager/PackageDexieStore';

export enum InstallMode {
    INSTALL_SPECIFIC = 0,  // Use when installing a single mod or modpack
    UPDATE_ALL = 1  // Use when updating all mods currently in a profile
};

/**
 * ModpackDependencyStrategy controls how dependencies are resolved for mod packs:
 * - USE_EXACT_VERSION: Use exactly the version specified in the mod pack. (This is the default behaviour).
 * - USE_LATEST_VERSION: Use the latest version instead
 *
 * For regular mods (non-modpacks), the latest version of dependencies is always used.
 */
enum ModpackDependencyStrategy {
    USE_EXACT_VERSION = 0,
    USE_LATEST_VERSION = 1
};

export const splitToNameAndVersion = (dependencyString: string): [string, string] => {
    const parts = dependencyString.split('-');

    // Legacy team names can contain hyphens, so we can't be sure how
    // many there are in a dependency string.
    if (parts.length < 3) {
        throw new Error(`Invalid dependency string "${dependencyString}"`);
    }

    const version = parts.pop()!;
    const fullName = parts.join('-');
    return [fullName, version];
};

/**
 * There's no formal specification about how the dependency resolution should
 * work. Instead, there's established practice for how it should work on the
 * use cases supported by the UI (documented below). When adding new use cases,
 * consider carefully what behaviour that particular case should warrant and
 * document it here.
 *
 * 1. When installing a mod
 *   - `combos` must contain only the mod being installed
 *   - `installMode` must be `INSTALL_SPECIFIC`
 *   - Returned array contains the mod/version in `combos` and latest
 *     versions of the dependencies, excluding any dependencies that are
 *     already installed. We do not want to update installed mods in case
 *     they're version pinned in a modpack
 * 2. When installing a modpack
 *   - `combos` must contain only the modpack being installed
 *   - `installMode` must be `INSTALL_SPECIFIC`
 *   - Returned array contains the modpack/version in `combos` and exact
 *     versions of the dependencies as defined by the modpack's
 *     dependencies. Exact versions are used to ensure compatibility
 *     between users who install the same modpack
 * 3. When updating all packages in the profile
 *   - `combos` must contain exact (=latest) versions of all packages
 *     to be updated. These versions of these packages are used, even if
 *     dependencies contain other versions.
 *   - `installMode` must be `UPDATE_ALL`
 *   - Returned array contains the the exact versions in `combos` and
 *     latest versions of any new dependencies.
 *   - Latest versions of both the input packages and their dependencies
 *     are used as this is used by the "Update all" UI feature, which
 *     can't differentiate if a package is present because it's installed
 *     directly or as a dependency
 *     - The UI feature for updating a single package acts as installing
 *       a single package
 */
export async function getFullDependencyList(
    combos: ThunderstoreCombo[],
    game: Game,
    installedMods: ManifestV2[],
    installMode: InstallMode
): Promise<ThunderstoreCombo[]> {
    const results = [...combos];

    for (const combo of combos) {
        const isModpack = combo.getMod().getCategories().some(value => value === "Modpacks");
        const dependencyVersionStrategy = installMode === InstallMode.INSTALL_SPECIFIC && isModpack
            ? ModpackDependencyStrategy.USE_EXACT_VERSION
            : ModpackDependencyStrategy.USE_LATEST_VERSION;

        let dependencies: ThunderstoreCombo[] = [];
        await buildDependencySet(combo.getVersion(), game, dependencies, dependencyVersionStrategy);

        if (installMode === InstallMode.INSTALL_SPECIFIC && !isModpack) {
            dependencies = dependencies.filter(
                (dependency) => !installedMods.some(installed => installed.getName() === dependency.getMod().getFullName())
            );
        }

        results.push(...dependencies.filter(
            (dependency) => !results.some(alreadyAdded => alreadyAdded.getMod().getFullName() === dependency.getMod().getFullName())
        ));
    }

    await sortDependencyOrder(results);
    return results;
}

async function sortDependencyOrder(deps: ThunderstoreCombo[]) {
    deps.sort((a, b) => {
        if (a.getVersion().getDependencies().find(value => value.startsWith(b.getMod().getFullName() + "-"))) {
            return 1;
        } else {
            return -1;
        }
    })
}

async function buildDependencySet(
    mod: ThunderstoreVersion,
    game: Game,
    builder: ThunderstoreCombo[],
    dependencyVersionStrategy: ModpackDependencyStrategy
) {
    const useLatestVersion = Boolean(dependencyVersionStrategy);
    let foundDependencies = await getCombosByDependencyStrings(game, mod.getDependencies(), useLatestVersion);

    // Filter out already added AFTER reading packages from the DB to
    // ensure the recursion works as expected.
    const alreadyAdded = builder.map((seenMod) => seenMod.getMod().getFullName());
    foundDependencies = foundDependencies.filter(
        (dep) => !alreadyAdded.includes(dep.getMod().getFullName())
    );

    foundDependencies.forEach(found => builder.push(found));

    for (const dependency of foundDependencies) {
        await buildDependencySet(dependency.getVersion(), game, builder, dependencyVersionStrategy);
    }
}
