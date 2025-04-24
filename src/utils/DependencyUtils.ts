import Game from "../model/game/Game";
import { ImmutableProfile } from "../model/Profile";
import ManifestV2 from "../model/ManifestV2";
import { throwForR2Error } from "../model/errors/R2Error";
import ThunderstoreCombo from "../model/ThunderstoreCombo";
import ThunderstoreVersion from "../model/ThunderstoreVersion";
import { getCombosByDependencyStrings } from '../r2mm/manager/PackageDexieStore';
import ProfileModList from "../r2mm/mods/ProfileModList";

enum DependencySetBuilderMode {
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

export async function getFullDependencyList(combos: ThunderstoreCombo[], game: Game, installedMods: ManifestV2[]) {
    for (const combo of combos) {
        const isModpack = combo.getMod().getCategories().find(value => value === "Modpacks") !== undefined;
        const versionMode = isModpack
        ? DependencySetBuilderMode.USE_EXACT_VERSION
        : DependencySetBuilderMode.USE_LATEST_VERSION;

        await buildDependencySet(combo.getVersion(), game, combos, versionMode);

        combos = isModpack || installedMods.length === 0 ? combos :
            combos.filter((dep) => {
                return !((installedMods as ManifestV2[]).some(installed => installed.getName() === dep.getMod().getFullName()));
            });
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
    mode: DependencySetBuilderMode): Promise<void>
{
    const useLatestVersion = Boolean(mode);
    let foundDependencies = await getCombosByDependencyStrings(game, mod.getDependencies(), useLatestVersion);

    // Filter out already added AFTER reading packages from the DB to
    // ensure the recursion works as expected.
    const alreadyAdded = builder.map((seenMod) => seenMod.getMod().getFullName());
    foundDependencies = foundDependencies.filter(
        (dep) => !alreadyAdded.includes(dep.getMod().getFullName())
    );

    foundDependencies.forEach(found => builder.push(found));

    for (const dependency of foundDependencies) {
        await buildDependencySet(dependency.getVersion(), game, builder, mode);
    }
}
