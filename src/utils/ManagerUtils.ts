import GameManager from "../model/game/GameManager";
import ThunderstoreMod from "../model/ThunderstoreMod";
import ManagerSettings from "../r2mm/manager/ManagerSettings";


/**
 * Searches the target mod from the list. If present, filters out all versions
 * except the target version. If target version is not found, removes the whole
 * package.
 *
 * MUTATES THE LIST IN PLACE. Theoretically there's no upper limit to how large
 * the modList can be, so avoid making a copy unnecessarily.
 *
 * This can be used e.g. to effectively pin a version of the mod loader package
 * to specific version for a specific community. If a newer version of a shared
 * package is released, it won't be visible for communities that filter out
 * extra versions using this method.
 */
export const filterModVersions = (modList: ThunderstoreMod[], dependencyString: string) => {
    const match = dependencyString.match(/^([^ -]+-[^ -]+)-([^ -]+)$/);

    if (!match) {
        throw new Error(`Invalid dependency string "${dependencyString}"`);
    }

    const [_, modName, versionNumber] = match;
    const target = modList.findIndex((mod) => mod.getFullName() === modName);

    if (target > -1) {
        const filtered = modList[target].getVersions().filter(
            (v) => v.getVersionNumber().toString() === versionNumber
        );

        if (filtered.length) {
            modList[target].setVersions(filtered);
            modList[target].setDateUpdated(filtered[filtered.length - 1].getDateCreated());
        } else {
            modList.splice(target, 1);
        }
    }
}

/**
 * Filters out versions that are created outside the time bubble defined by the
 * date arguments. If all versions are filtered out, removes the whole package.
 *
 * MUTATES THE LIST IN PLACE. Theoretically there's no upper limit to how large
 * the modList can be, so avoid making a copy unnecessarily.
 *
 * This can be used to improve the changes of creating a mod profile compatible
 * with a specific version of a game. If a game update breaks all mods, user
 * can choose to stay on an older game version and filter out newer mods, or to
 * use the new game version and filter out mods that haven't been updated yet.
 */
export const filterModVersionsByDate = (modList: ThunderstoreMod[], startDate?: string, endDate?: string) => {
    if (startDate && endDate && startDate > endDate) {
        throw new Error("Argument startDate can't be greater than endDate")
    }
    if (!startDate && !endDate) {
        return;
    }

    for (let i = modList.length - 1; i >= 0; i--) {
        const filtered = modList[i].getVersions().filter(
            (v) => (!startDate || v.getDateCreated() >= startDate) && (!endDate || v.getDateCreated() <= endDate)
        );

        if (filtered.length) {
            modList[i].setVersions(filtered);
            modList[i].setDateUpdated(filtered[filtered.length - 1].getDateCreated());
        } else {
            modList.splice(i, 1);
        }
    }

    // TODO(?): this takes around 20ms with current LC mod list. It's only needed when
    // the default ordering is used so it could be done conditionally, but that would
    // require refactoring the sorting mode out of the OnlineModView component.
    modList.sort(ThunderstoreMod.defaultOrderComparer);
}

/**
 * Return default game selection needed to skip the game selection screen.
 */
export const getDefaults = (settings: ManagerSettings) => {
    const globals = settings.getContext().global;
    const defaultGame = GameManager.findByFolderName(globals.defaultGame);
    const platforms = defaultGame ? defaultGame.storePlatformMetadata : [];
    const defaultPlat = platforms.find(x => x.storePlatform === globals.defaultStore);

    return {
        defaultGame,
        defaultPlatform: defaultPlat ? defaultPlat.storePlatform : undefined
    };
}
