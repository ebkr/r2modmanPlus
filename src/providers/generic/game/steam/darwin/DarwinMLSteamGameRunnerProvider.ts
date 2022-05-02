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
import { homedir } from 'os';

const exec = promisify(execCallback);

export default class DarwinMLSteamGameRunnerProvider extends GameRunnerProvider {

    async getGameArguments(game: Game, profile: Profile): Promise<string | R2Error> {
        return `--melonloader.basedir "${profile.getPathOfProfile()}"`;
    }

    public async startModded(game: Game, profile: Profile): Promise<void | R2Error> {
        LoggerProvider.instance.Log(LogSeverity.INFO, 'Launching modded');

        const target = await this.getGameArguments(game, Profile.getActiveProfile());
        if (target instanceof R2Error) {
            return target;
        }

        return this.start(game, `${target}`);
    }

    public startVanilla(game: Game, profile: Profile): Promise<void | R2Error> {
        LoggerProvider.instance.Log(LogSeverity.INFO, 'Launching vanilla');
        return this.start(game, '--no-mods');
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
        }catch(err){
            LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting the game');
            LoggerProvider.instance.Log(LogSeverity.ERROR, (err as Error).message);
            throw new R2Error('Error starting Steam', (err as Error).message, 'Ensure that the Steam directory has been set correctly in the settings');
        }
    }

}
