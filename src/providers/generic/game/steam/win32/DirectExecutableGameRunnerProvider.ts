import GameRunnerProvider from '../../GameRunnerProvider';
import LoggerProvider, { LogSeverity } from '../../../../ror2/logging/LoggerProvider';
import ManagerSettings from '../../../../../r2mm/manager/ManagerSettings';
import R2Error from '../../../../../model/errors/R2Error';
import { exec } from "child_process";
import path from "path";
import Profile from '../../../../../model/Profile';
import GameDirectoryResolverProvider from '../../../../ror2/game/GameDirectoryResolverProvider';
import Game from '../../../../../model/game/Game';
import FsProvider from '../../../file/FsProvider';

export default class DirectExecutableGameRunnerProvider extends GameRunnerProvider {

    async getGameArguments(game: Game, profile: Profile): Promise<string | R2Error> {
        try {
            const corePath = path.join(profile.getPathOfProfile(), "BepInEx", "core");
            const preloaderPath = path.join(corePath,
                (await FsProvider.instance.readdir(corePath))
                    .filter((x: string) => ["BepInEx.Preloader.dll", "BepInEx.IL2CPP.dll"].includes(x))[0]);
            return `--doorstop-enable true --doorstop-target "${preloaderPath}"`;
        } catch (e) {
            const err: Error = e;
            return new R2Error("Failed to find preloader dll", err.message, "BepInEx may not installed correctly. Further help may be required.");
        }
    }

    async startModded(game: Game, profile: Profile): Promise<void | R2Error> {
        LoggerProvider.instance.Log(LogSeverity.INFO, 'Launching modded');
        // BepInEx Standard
        const target = await this.getGameArguments(game, profile);
        if (target instanceof R2Error) {
            return target;
        } else {
            return this.start(game, target);
        }
    }

    async startVanilla(game: Game, profile: Profile): Promise<void | R2Error> {
        LoggerProvider.instance.Log(LogSeverity.INFO, 'Launching vanilla');
        return this.start(game, `--doorstop-enable false`);
    }

    async start(game: Game, args: string): Promise<void | R2Error> {
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
