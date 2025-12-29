import os from "../../../../providers/node/os/os";
import FsProvider from '../../../../providers/generic/file/FsProvider';
import path from "../../../../providers/node/path/path";
import GameRunnerProvider from '../../../../providers/generic/game/GameRunnerProvider';
import Game from '../../../../model/game/Game';
import R2Error from '../../../../model/errors/R2Error';
import Profile from '../../../../model/Profile';
import ManagerSettings from '../../../manager/ManagerSettings';
import GameDirectoryResolverProvider from '../../../../providers/ror2/game/GameDirectoryResolverProvider';
import LoggerProvider, { LogSeverity } from '../../../../providers/ror2/logging/LoggerProvider';
import ChildProcess from '../../../../providers/node/child_process/child_process';
import GameInstructions from '../../instructions/GameInstructions';
import GameInstructionParser from '../../instructions/GameInstructionParser';

export default class SteamGameRunner_Darwin extends GameRunnerProvider {

    public async getGameArguments(game: Game, profile: Profile): Promise<string[] | R2Error> {
        const instructions = await GameInstructions.getInstructionsForGame(game, profile);
        return await GameInstructionParser.parseList(instructions.moddedParameterList, game, profile);
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
        return this.start(game, instructions.vanillaParameterList);
    }

    async start(game: Game, args: string[]): Promise<void | R2Error> {
        const settings = await ManagerSettings.getSingleton(game);
        const steamDir = await GameDirectoryResolverProvider.instance.getSteamDirectory();
        if(steamDir instanceof R2Error) {
            return steamDir;
        }

        LoggerProvider.instance.Log(LogSeverity.INFO, `Steam folder is: ${steamDir}`);

        const steamExecutable = [
            path.join("/", "Applications", "Steam.app"),
            path.join(os.homedir(), "Applications", "Steam.app")
        ].find(async executable => await FsProvider.instance.exists(executable));

        if (steamExecutable === undefined) {
            return new R2Error("Could not locate the Steam application", "The Steam application must be in either /Applications or ~/Applications",
                "This should be the default location. If there are others, please let me know.");
        }

        try{
            const mappedArgs = args.map(value => `"${value}"`);
            const cmd = `"${steamExecutable}/Contents/MacOS/steam_osx" -applaunch ${game.activePlatform.storeIdentifier} ${mappedArgs} ${settings.getContext().gameSpecific.launchParameters}`;
            LoggerProvider.instance.Log(LogSeverity.INFO, `Running command: ${cmd}`);
            await ChildProcess.exec(cmd);
        } catch(err){
            LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting the game');
            LoggerProvider.instance.Log(LogSeverity.ERROR, (err as Error).message);
            throw new R2Error('Error starting Steam', (err as Error).message, 'Ensure that the Steam folder has been set correctly in the settings');
        }
    }
}
