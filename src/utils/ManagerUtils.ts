import GameManager from "../model/game/GameManager";
import ManagerSettings from "../r2mm/manager/ManagerSettings";


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
