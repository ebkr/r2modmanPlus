import R2Error from "../model/errors/R2Error";
import Game from "../model/game/Game";
import GameDirectoryResolverProvider from "../providers/ror2/game/GameDirectoryResolverProvider";
import ManagerSettings from "../r2mm/manager/ManagerSettings";

export const setGameDirIfUnset = async (game: Game): Promise<void> => {
    const settings = await ManagerSettings.getSingleton(game);
    const currentDir = settings.getContext().gameSpecific.gameDirectory;

    if (currentDir === null) {
        const dir = await GameDirectoryResolverProvider.instance.getDirectory(game);
        if (dir instanceof R2Error) {
            throw dir;
        }

        const setDirError = await settings.setGameDirectory(dir);
        if (setDirError instanceof R2Error) {
            throw setDirError;
        }
    }
};
