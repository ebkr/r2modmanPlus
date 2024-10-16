import Profile, { ImmutableProfile } from "../model/Profile";
import R2Error from "../model/errors/R2Error";
import Game from "../model/game/Game";
import FsProvider from "../providers/generic/file/FsProvider";
import GameRunnerProvider from "../providers/generic/game/GameRunnerProvider";
import GameDirectoryResolverProvider from "../providers/ror2/game/GameDirectoryResolverProvider";
import ManagerSettings from "../r2mm/manager/ManagerSettings";
import ModLinker from "../r2mm/manager/ModLinker";

export enum LaunchMode { VANILLA, MODDED };

export const launch = async (game: Game, profile: Profile, mode: LaunchMode): Promise<void> => {
    const error = (mode === LaunchMode.MODDED)
        ? await GameRunnerProvider.instance.startModded(game, profile)
        : await GameRunnerProvider.instance.startVanilla(game, profile);

    if (error instanceof R2Error) {
        throw error;
    }
};

export const linkProfileFiles = async (game: Game, profile: ImmutableProfile): Promise<void> => {
    const settings = await ManagerSettings.getSingleton(game);

    const newLinkedFiles = await ModLinker.link(profile, game);
    if (newLinkedFiles instanceof R2Error) {
        throw newLinkedFiles;
    }

    await settings.setLinkedFiles(newLinkedFiles);
};

export const setGameDirIfUnset = async (game: Game): Promise<void> => {
    const settings = await ManagerSettings.getSingleton(game);
    const currentDir = settings.getContext().gameSpecific.gameDirectory;

    if (currentDir === null) {
        const dir = await GameDirectoryResolverProvider.instance.getDirectory(game);
        if (dir instanceof R2Error) {
            throw dir;
        }

        await settings.setGameDirectory(dir);
    }
};

export const throwIfNoGameDir = async (game: Game): Promise<void> => {
    const error = new R2Error(
        `Failed to start ${game.displayName}`,
        `The ${game.displayName} folder does not exist`,
        `Set the ${game.displayName} folder in the Settings screen`
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
