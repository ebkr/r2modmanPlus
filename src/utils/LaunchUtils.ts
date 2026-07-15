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
import InteractionProvider from "../providers/ror2/system/InteractionProvider";
import { TypedEventEmitter } from "./TypedEventEmitter";
import { PackageLoader } from "../model/schema/ThunderstoreSchema";
import { ensureWineDllOverride } from "./WineUtils";
import {
    resolveProfilePreloaderPath,
    resolveDefaultRelativePreloaderPath,
    setProfileDoorstopTarget,
} from "./DoorstopConfigUtils";

export enum LaunchMode { VANILLA, MODDED };

export const OnGameLaunch = new TypedEventEmitter<{ game: Game, profile: Profile, mode: LaunchMode }>();

export const launch = async (game: Game, profile: Profile, mode: LaunchMode): Promise<void> => {
    // This event is used for analytics by TMM
    await OnGameLaunch.emit({game, profile, mode});

    const error = (mode === LaunchMode.MODDED)
        ? await GameRunnerProvider.instance.startModded(game, profile)
        : await GameRunnerProvider.instance.startVanilla(game, profile);

    if (error instanceof R2Error) {
        throw error;
    }
};

export const linkProfileFiles = async (game: Game, profile: ImmutableProfile): Promise<void> => {
    const settings = await ManagerSettings.getSingleton(game);

    // When the user opted in, point the doorstop config at the profile before
    // linking so the copied game-dir config lets mods load on an out-of-manager
    // launch (Steam / Big Picture). Non-fatal: a failure here shouldn't block
    // the normal file sync.
    if (settings.getSteamProtonExternalLaunch()) {
        const e = await applyProtonExternalLaunchConfig(game, profile);
        if (e instanceof R2Error) {
            console.warn('Failed to apply external-launch doorstop config:', e);
        }
    }

    const newLinkedFiles = await ModLinker.link(profile, game);
    if (newLinkedFiles instanceof R2Error) {
        throw newLinkedFiles;
    }

    await settings.setLinkedFiles(newLinkedFiles);
};

// True only for Linux + Proton + BepInEx-family games, the case where mods live
// in the profile and are reached via doorstop redirection.
async function isProtonBepInExGame(game: Game): Promise<boolean> {
    if (appWindow.getPlatform() !== 'linux') {
        return false;
    }
    if (![PackageLoader.BEPINEX, PackageLoader.BEPISLOADER].includes(game.packageLoader)) {
        return false;
    }
    const settings = await ManagerSettings.getSingleton(game);
    const launchType = await getDeterminedLaunchType(game, settings.getLaunchType() || LaunchType.AUTO);
    return launchType === LaunchType.PROTON;
}

/**
 * Point the profile's doorstop config at the profile's BepInEx (absolute, Z:
 * path) and make sure the Wine prefix loads winhttp. After ModLinker copies the
 * config into the game directory, launching the game from anywhere (Steam, Big
 * Picture) loads mods without needing launch arguments.
 */
export const applyProtonExternalLaunchConfig = async (game: Game, profile: ImmutableProfile): Promise<void | R2Error> => {
    if (!(await isProtonBepInExGame(game))) {
        return;
    }
    const target = await resolveProfilePreloaderPath(profile, true);
    if (target instanceof R2Error) {
        return target;
    }
    const setError = await setProfileDoorstopTarget(profile, target, true);
    if (setError instanceof R2Error) {
        return setError;
    }
    return await ensureWineDllOverride(game, 'winhttp');
};

/**
 * Restore the default game-relative doorstop target so an out-of-manager launch
 * no longer loads mods from the profile (the manager's own launch still works
 * via launch arguments).
 */
export const revertProtonExternalLaunchConfig = async (game: Game, profile: ImmutableProfile): Promise<void | R2Error> => {
    if (!(await isProtonBepInExGame(game))) {
        return;
    }
    const target = await resolveDefaultRelativePreloaderPath(profile);
    if (target instanceof R2Error) {
        return target;
    }
    return await setProfileDoorstopTarget(profile, target, true);
};

/**
 * Persist the "load mods when launched outside the manager" setting and sync the
 * game directory to match. Enabling redirects doorstop to the profile; disabling
 * reverts it. Safe to call when the game isn't Proton/BepInEx (no-ops the config
 * work but still refreshes linked files).
 */
export const setProtonExternalLaunch = async (game: Game, profile: ImmutableProfile, enabled: boolean): Promise<void> => {
    const settings = await ManagerSettings.getSingleton(game);
    await settings.setSteamProtonExternalLaunch(enabled);

    try {
        if (!enabled) {
            // linkProfileFiles only applies when enabled, so revert explicitly.
            const e = await revertProtonExternalLaunchConfig(game, profile);
            if (e instanceof R2Error) {
                console.warn('Failed to revert external-launch doorstop config:', e);
            }
        }
        await linkProfileFiles(game, profile);
    } catch (e) {
        console.warn('Failed to sync external-launch state to game directory:', e);
    }
};

/**
 * Non-fatal wrapper around linkProfileFiles.
 * Syncs mod loader root files from the profile to the game directory.
 * Failures are logged but do not propagate, so callers such as install/update flows
 * won't fail if the game directory is not configured or the files are locked by a running game.
 */
export const syncProfileRootFiles = async (game: Game, profile: ImmutableProfile): Promise<void> => {
    try {
        await linkProfileFiles(game, profile);
    } catch (e) {
        console.warn('Failed to sync root mod files to game directory:', e);
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

export async function isManagerRunningOnFlatpak(): Promise<boolean> {
    const env = await InteractionProvider.instance.getEnvironmentVariables();
    return !!env.FLATPAK_ID;
}

export async function getProvidedWrapperArguments(game: Game): Promise<string> {
    return Promise.resolve()
        .then(async () => await (GameDirectoryResolverProvider.instance as LinuxGameDirectoryResolver).getLaunchArgs(game))
        .then(launchArgs => {
            if (typeof launchArgs !== 'string') {
                throw launchArgs;
            }
            return launchArgs.replaceAll('\\"', '"');
        });
}

/**
 * Returns true if any wrapper script is set. The wrapper does not need to be valid.
 * @param game - The game to check for the set launch arguments
 */
export async function areAnyWrapperArgumentsProvided(game: Game): Promise<boolean> {
    // We don't care about the paths here
    // We can assume that if a wrapper is provided then it's pointing to an existing install (old or new)
    const flatpakWrapper = 'web_start_wrapper.sh';
    const linuxWrapper = 'linux_wrapper.sh';
    return getProvidedWrapperArguments(game)
        .then(launchArgs => (launchArgs.includes(linuxWrapper) || launchArgs.includes(flatpakWrapper)))
        .catch(() => false);
}

export async function areWrapperArgumentsProvided(game: Game): Promise<boolean> {
    const isFlatpak = await isManagerRunningOnFlatpak();
    const flatpakWrapper = path.join(PathResolver.MOD_ROOT, 'web_start_wrapper.sh');
    const linuxWrapper = path.join(PathResolver.MOD_ROOT, 'linux_wrapper.sh');
    const appropriateWrapper = isFlatpak ? flatpakWrapper : linuxWrapper;
    return getProvidedWrapperArguments(game)
        .then(launchArgs => launchArgs.includes(appropriateWrapper))
        .catch(() => false);
}

export async function getWrapperLaunchArgs(): Promise<string> {
    return `"${path.join(PathResolver.MOD_ROOT, appWindow.getPlatform() === 'darwin' ? 'macos_proxy' : 'linux_wrapper.sh')}" %command%`;
}
