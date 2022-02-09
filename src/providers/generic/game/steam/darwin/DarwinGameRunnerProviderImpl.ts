import GameRunnerProvider from '../../GameRunnerProvider';
import LoggerProvider, { LogSeverity } from '../../../../ror2/logging/LoggerProvider';
import ManagerSettings from '../../../../../r2mm/manager/ManagerSettings';
import R2Error from '../../../../../model/errors/R2Error';
import { exec as execCallback } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import Profile from '../../../../../model/Profile';
import GameDirectoryResolverProvider from '../../../../ror2/game/GameDirectoryResolverProvider';
import FsProvider from '../../../file/FsProvider';
import Game from '../../../../../model/game/Game';
import { GameInstanceType } from '../../../../../model/game/GameInstanceType';
import { homedir } from 'os';

const exec = promisify(execCallback);

export default class DarwinGameRunnerProviderImpl extends GameRunnerProvider {

    async getGameArguments(game: Game, profile: Profile): Promise<string | R2Error> {
        try {
            const corePath = await FsProvider.instance.realpath(path.join(profile.getPathOfProfile(), "BepInEx", "core"));
            const preloaderPath = path.join(corePath,
                (await FsProvider.instance.readdir(corePath))
                    .filter((x: string) => ["BepInEx.Preloader.dll", "BepInEx.IL2CPP.dll"].includes(x))[0]);
            return `--doorstop-enable true --doorstop-target "${preloaderPath}"`;
        } catch (e) {
            const err: Error = e as Error;
            return new R2Error("Failed to find preloader dll", err.message, "BepInEx may not installed correctly. Further help may be required.");
        }
    }

    public async startModded(game: Game, profile: Profile): Promise<void | R2Error> {
        LoggerProvider.instance.Log(LogSeverity.INFO, 'Launching modded');

        let extraArguments = '';

        // If sh files aren't executable then the wrapper will fail.
        const shFiles = (await FsProvider.instance.readdir(await FsProvider.instance.realpath(path.join(Profile.getActiveProfile().getPathOfProfile()))))
            .filter(value => value.endsWith(".sh"));

        try {
            for (const shFile of shFiles) {
                await FsProvider.instance.chmod(await FsProvider.instance.realpath(path.join(Profile.getActiveProfile().getPathOfProfile(), shFile)), 0o755);
            }
        } catch (e) {
            const err: Error = e as Error;
            return new R2Error("Failed to make sh file executable", err.message, "You may need to run the manager with elevated privileges.");
        }
        extraArguments = `--r2profile "${Profile.getActiveProfile().getProfileName()}"`;
        if (game.instanceType === GameInstanceType.SERVER) {
            extraArguments += ` --server`;
        }

        if (await FsProvider.instance.exists(path.join(Profile.getActiveProfile().getPathOfProfile(), "unstripped_corlib"))) {
            extraArguments += ` --doorstop-dll-search-override "${await FsProvider.instance.realpath(path.join(Profile.getActiveProfile().getPathOfProfile(), "unstripped_corlib"))}"`;
        }

        const target = await this.getGameArguments(game, Profile.getActiveProfile());
        if (target instanceof R2Error) {
            return target;
        }

        return this.start(game, `${target} ${extraArguments}`);
    }

    public startVanilla(game: Game, profile: Profile): Promise<void | R2Error> {
        LoggerProvider.instance.Log(LogSeverity.INFO, 'Launching vanilla');
        return this.start(game, '--server --doorstop-enable false');
    }

    private async start(game: Game, cmdargs: string): Promise<void | R2Error> {
        const settings = await ManagerSettings.getSingleton(game);
        const steamDir = await GameDirectoryResolverProvider.instance.getSteamDirectory();
        if(steamDir instanceof R2Error) {
            return steamDir;
        }

        LoggerProvider.instance.Log(LogSeverity.INFO, `Steam directory is: ${steamDir}`);

        const steamExecutable = [
            path.join("/", "Applications", "Steam.app"),
            path.join(homedir(), "Applications", "Steam.app")
        ].find(async executable => await FsProvider.instance.exists(executable));

        if (steamExecutable === undefined) {
            return new R2Error("Could not locate the Steam application", "The Steam application must be in either /Applications or ~/Applications",
                "This should be the default location. If there are others, please let me know.");
        }

        try{
            const cmd = `"${steamExecutable}/Contents/MacOS/steam_osx" -applaunch ${game.activePlatform.storeIdentifier} ${cmdargs} ${settings.getContext().gameSpecific.launchParameters}`;
            LoggerProvider.instance.Log(LogSeverity.INFO, `Running command: ${cmd}`);
            await exec(cmd);
        } catch(err){
            LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting the game');
            LoggerProvider.instance.Log(LogSeverity.ERROR, (err as Error).message);
            throw new R2Error('Error starting Steam', (err as Error).message, 'Ensure that the Steam directory has been set correctly in the settings');
        }
    }

}
