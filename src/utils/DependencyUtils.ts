import Game from "../model/game/Game";
import ManifestV2 from "../model/ManifestV2";
import ThunderstoreCombo from "../model/ThunderstoreCombo";
import ThunderstoreVersion from "../model/ThunderstoreVersion";
import { getCombosByDependencyStrings } from '../r2mm/manager/PackageDexieStore';

/**
 * ModpackDependencyStrategy controls how dependencies are resolved for mod packs:
 * - USE_EXACT_VERSION: Use exactly the version specified in the mod pack. (This is the default behaviour).
 * - USE_LATEST_VERSION: Use the latest version instead
 *
 * For regular mods (non-modpacks), the latest version of dependencies is always used.
 */
export enum ModpackDependencyStrategy {
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
 * - When installing a regular mods, always install the latest versions of dependencies.
 * - When installing a mod pack we usually want to ensure compatibility by installing the exact
 *      versions of dependencies, even if it means upgrading/downgrading already installed mods.
 *   - If, however, modpackDependencyStrategy is set to USE_LATEST_VERSION, we install the latest
 *      versions of dependencies for mod packs too.
 * - When installing latest versions of dependencies, already installed mods are filtered out.
 * - The order of the input combos array matters, combos earlier on the array get their dependencies'
 *      versions prioritised over later ones.
 */
export async function getFullDependencyList(
    combos: ThunderstoreCombo[],
    game: Game,
    installedMods: ManifestV2[],
    modpackDependencyStrategy: ModpackDependencyStrategy
) {
    const originalCombos = [...combos];
    for (const combo of originalCombos) {
        const isModpack = combo.getMod().getCategories().some(value => value === "Modpacks");
        const dependencyVersionStrategy = isModpack ? modpackDependencyStrategy : ModpackDependencyStrategy.USE_LATEST_VERSION;

        let dependencies: ThunderstoreCombo[] = [];
        await buildDependencySet(combo.getVersion(), game, dependencies, dependencyVersionStrategy);

        combos.push(...dependencies.filter(dependency => {
            const isNotAlreadyFound = !combos.some(alreadyAdded => alreadyAdded.getMod().getFullName() === dependency.getMod().getFullName());
            const isNotInstalled = !installedMods.some(installed => installed.getName() === dependency.getMod().getFullName());

            return isNotAlreadyFound && (isNotInstalled || dependencyVersionStrategy === ModpackDependencyStrategy.USE_EXACT_VERSION);
        }));
    }

    await sortDependencyOrder(combos);
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
