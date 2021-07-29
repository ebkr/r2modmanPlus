import GameRunnerProvider from '../../../../../generic/game/GameRunnerProvider';
import Game from '../../../../../../model/game/Game';
import Profile from '../../../../../../model/Profile';
import R2Error from '../../../../../../model/errors/R2Error';
import ManagerSettings from '../../../../../../r2mm/manager/ManagerSettings';
import GameDirectoryResolverProvider from '../../../../../ror2/game/GameDirectoryResolverProvider';
import LoggerProvider, { LogSeverity } from '../../../../../ror2/logging/LoggerProvider';
import { exec } from 'child_process';
import FsProvider from 'src/providers/generic/file/FsProvider';

export default class MLDirectExecutableGameRunnerProvider extends GameRunnerProvider {

    async getGameArguments(game: Game, profile: Profile): Promise<string | R2Error> {
        return "";
    }

    async startModded(game: Game, profile: Profile): Promise<void | R2Error> {
        return this.start(game, profile, `--melonloader.basedir "${profile.getPathOfProfile()}"`);
    }

    async startVanilla(game: Game, profile: Profile): Promise<void | R2Error> {
        return this.start(game, profile, "--no-mods");
    }

    async start(game: Game, profile: Profile, args: string): Promise<R2Error | void> {
        return new Promise(async (resolve, reject) => {
            const settings = await ManagerSettings.getSingleton(game);
            let gameDir = await GameDirectoryResolverProvider.instance.getDirectory(game);
            if (gameDir instanceof R2Error) {
                return gameDir;
            }

            gameDir = await FsProvider.instance.realpath(gameDir);

            const gameExecutable = (await FsProvider.instance.readdir(gameDir))
                .filter((x: string) => game.exeName.includes(x))[0];

            LoggerProvider.instance.Log(LogSeverity.INFO, `Running command: ${gameDir}/${gameExecutable} ${args} ${settings.getContext().gameSpecific.launchParameters}`);

            exec(`"${gameExecutable}" ${args} ${settings.getContext().gameSpecific.launchParameters}`, {
                cwd: gameDir
            }, (err => {
                if (err !== null) {
                    LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting modded');
                    LoggerProvider.instance.Log(LogSeverity.ERROR, err.message);
                    const r2err = new R2Error('Error starting the game', err.message, 'Ensure that the game directory has been set correctly in the settings');
                    return reject(r2err);
                }
                return resolve();
            }));
        });
    }

}
