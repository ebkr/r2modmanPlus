import Profile, {ImmutableProfile} from '../model/Profile';
import R2Error from '../model/errors/R2Error';
import Game from '../model/game/Game';
import FsProvider from '../providers/generic/file/FsProvider';
import GameRunnerProvider from '../providers/generic/game/GameRunnerProvider';
import GameDirectoryResolverProvider from '../providers/ror2/game/GameDirectoryResolverProvider';
import ManagerSettings from '../r2mm/manager/ManagerSettings';
import ModLinker from '../r2mm/manager/ModLinker';
import {Platform} from '../assets/data/ecosystemTypes';
import LinuxGameDirectoryResolver from '../r2mm/manager/linux/GameDirectoryResolver';
import {LaunchType} from "../model/real_enums/launch/LaunchType";
import path from "../providers/node/path/path";
import PathResolver from "../r2mm/manager/PathResolver";
import appWindow from '../providers/node/app/app_window';

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

export async function isProtonRequired(activeGame: Game) {
    if (appWindow.getPlatform() !== 'linux') {
        return false;
    }
    return [Platform.STEAM, Platform.STEAM_DIRECT].includes(activeGame.activePlatform.storePlatform)
        ? await (GameDirectoryResolverProvider.instance as LinuxGameDirectoryResolver).isProtonGame(activeGame)
        : false;
}

export async function getDeterminedLaunchType(game: Game, launchType: LaunchType): Promise<LaunchType> {
    if (launchType !== LaunchType.AUTO) {
        return launchType;
    }
    if (await isProtonRequired(game)) {
        return LaunchType.PROTON;
    }
    return LaunchType.NATIVE;
}

export async function areWrapperArgumentsProvided(game: Game): Promise<boolean> {
    try {
        let launchArgs = await (GameDirectoryResolverProvider.instance as LinuxGameDirectoryResolver).getLaunchArgs(game);
    } catch {
        let launchArgs = false;
    }
    return (typeof launchArgs === 'string' && launchArgs.startsWith(path.join(PathResolver.MOD_ROOT, 'linux_wrapper.sh')));
}

export async function getWrapperLaunchArgs(): Promise<string> {
    return `"${path.join(PathResolver.MOD_ROOT, appWindow.getPlatform() === 'darwin' ? 'macos_proxy' : 'linux_wrapper.sh')}" %command%`;
}
