import GameRunnerProvider from '../../../../providers/generic/game/GameRunnerProvider';
import Game from '../../../../model/game/Game';
import R2Error from '../../../../model/errors/R2Error';
import Profile from '../../../../model/Profile';
import ManagerSettings from '../../../manager/ManagerSettings';
import GameDirectoryResolverProvider from '../../../../providers/ror2/game/GameDirectoryResolverProvider';
import LoggerProvider, { LogSeverity } from '../../../../providers/ror2/logging/LoggerProvider';
import { exec } from 'child_process';
import GameInstructions from '../../instructions/GameInstructions';
import GameInstructionParser from '../../instructions/GameInstructionParser';

export default class SteamGameRunner_Windows extends GameRunnerProvider {

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
            const steamDir = await GameDirectoryResolverProvider.instance.getSteamDirectory();
            if (steamDir instanceof R2Error) {
                return resolve(steamDir);
            }

            LoggerProvider.instance.Log(LogSeverity.INFO, `Steam directory is: ${steamDir}`);
            LoggerProvider.instance.Log(LogSeverity.INFO, `Running command: ${steamDir}.exe -applaunch ${game.activePlatform.storeIdentifier} ${args} ${settings.getContext().gameSpecific.launchParameters}`);

            exec(`"${steamDir}/Steam.exe" -applaunch ${game.activePlatform.storeIdentifier} ${args} ${settings.getContext().gameSpecific.launchParameters}`, (err => {
                if (err !== null) {
                    LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting modded');
                    LoggerProvider.instance.Log(LogSeverity.ERROR, err.message);
                    const r2err = new R2Error('Error starting Steam', err.message, 'Ensure that the Steam directory has been set correctly in the settings');
                    return reject(r2err);
                }
                return resolve();
            }));
        });
    }
}
