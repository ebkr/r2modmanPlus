import Profile from "../model/Profile";
import R2Error from "../model/errors/R2Error";
import Game from "../model/game/Game";
import FsProvider from "../providers/generic/file/FsProvider";
import GameRunnerProvider from "../providers/generic/game/GameRunnerProvider";
import GameDirectoryResolverProvider from "../providers/ror2/game/GameDirectoryResolverProvider";
import ManagerSettings from "../r2mm/manager/ManagerSettings";
import ModLinker from "../r2mm/manager/ModLinker";

export const launch = async (game: Game, profile: Profile, modded: boolean): Promise<void> => {
    const error = modded
        ? await GameRunnerProvider.instance.startModded(game, profile)
        : await GameRunnerProvider.instance.startVanilla(game, profile);

    if (error instanceof R2Error) {
        throw error;
    }
};

export const linkProfileFiles = async (game: Game, profile: Profile): Promise<void> => {
    const settings = await ManagerSettings.getSingleton(game);

    const newLinkedFiles = await ModLinker.link(profile, game);
    if (newLinkedFiles instanceof R2Error) {
        throw newLinkedFiles;
    }

    const saveError = await settings.setLinkedFiles(newLinkedFiles);
    if (saveError instanceof R2Error) {
        throw saveError;
    }
};

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

export const throwIfNoGameDir = async (game: Game): Promise<void> => {
    const error = new R2Error(
        `Failed to start ${game.displayName}`,
        `The ${game.displayName} directory does not exist`,
        `Set the ${game.displayName} directory in the Settings screen`
    );

    const resolverGameDir = await GameDirectoryResolverProvider.instance.getDirectory(game);
    if (resolverGameDir instanceof R2Error) {
        throw error;
    }

    const settings = await ManagerSettings.getSingleton(game);
    const ctcGameDir = settings.getContext().gameSpecific.gameDirectory!;
    const ctxGameDirExists = await FsProvider.instance.exists(ctcGameDir);

    if (!ctxGameDirExists) {
        throw error;
    }
};
