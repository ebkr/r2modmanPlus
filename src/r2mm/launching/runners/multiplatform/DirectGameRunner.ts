import GameRunnerProvider from '../../../../providers/generic/game/GameRunnerProvider';
import Game from '../../../../model/game/Game';
import R2Error from '../../../../model/errors/R2Error';
import Profile from '../../../../model/Profile';
import GameInstructions from '../../instructions/GameInstructions';
import GameInstructionParser from '../../instructions/GameInstructionParser';
import ManagerSettings from '../../../manager/ManagerSettings';
import GameDirectoryResolverProvider from '../../../../providers/ror2/game/GameDirectoryResolverProvider';
import FsProvider from '../../../../providers/generic/file/FsProvider';
import LoggerProvider, { LogSeverity } from '../../../../providers/ror2/logging/LoggerProvider';
import { exec } from 'child_process';

export default class DirectGameRunner extends GameRunnerProvider {

    public async getGameArguments(game: Game, profile: Profile): Promise<string | R2Error> {
        const instructions = await GameInstructions.getInstructionsForGame(game, profile);
        return await GameInstructionParser.parse(instructions.moddedParameters, game, profile);
    }

    public async startModded(game: Game, profile: Profile): Promise<void | R2Error> {
        const args = await this.getGameArguments(game, profile);
        if (args instanceof R2Error) {
            return args
        }
        return this.start(game, args);
    }

    public async startVanilla(game: Game, profile: Profile): Promise<void | R2Error> {
        const instructions = await GameInstructions.getInstructionsForGame(game, profile);
        return this.start(game, instructions.vanillaParameters);
    }

    async start(game: Game, args: string): Promise<void | R2Error> {
        return new Promise(async (resolve, reject) => {
            const settings = await ManagerSettings.getSingleton(game);
            let gameDir = await GameDirectoryResolverProvider.instance.getDirectory(game);
            if (gameDir instanceof R2Error) {
                return resolve(gameDir);
            }

            gameDir = await FsProvider.instance.realpath(gameDir);

            const gameExecutable = (await FsProvider.instance.readdir(gameDir))
                .filter((x: string) => game.exeName.includes(x))[0];

            LoggerProvider.instance.Log(LogSeverity.INFO, `Running command: ${gameDir}/${gameExecutable} ${args} ${settings.getContext().gameSpecific.launchParameters}`);

            const childProcess = exec(`"${gameExecutable}" ${args} ${settings.getContext().gameSpecific.launchParameters}`, {
                cwd: gameDir,
                windowsHide: false,
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
