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
