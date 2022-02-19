import GameRunnerProvider from 'src/providers/generic/game/GameRunnerProvider';
import Game from 'src/model/game/Game';
import R2Error from 'src/model/errors/R2Error';
import Profile from 'src/model/Profile';
import ManagerSettings from 'src/r2mm/manager/ManagerSettings';
import GameDirectoryResolverProvider from 'src/providers/ror2/game/GameDirectoryResolverProvider';
import LoggerProvider, { LogSeverity } from 'src/providers/ror2/logging/LoggerProvider';
import { exec } from 'child_process';
import GameInstructions from 'src/r2mm/launching/instructions/GameInstructions';
import GameInstructionParser from 'src/r2mm/launching/instructions/GameInstructionParser';
import path from 'path';
import { homedir } from 'os';
import FsProvider from 'src/providers/generic/file/FsProvider';

export default class SteamGameRunner_Darwin extends GameRunnerProvider {

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
            const cmd = `"${steamExecutable}/Contents/MacOS/steam_osx" -applaunch ${game.activePlatform.storeIdentifier} ${args} ${settings.getContext().gameSpecific.launchParameters}`;
            LoggerProvider.instance.Log(LogSeverity.INFO, `Running command: ${cmd}`);
            await exec(cmd);
        } catch(err){
            LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting the game');
            LoggerProvider.instance.Log(LogSeverity.ERROR, (err as Error).message);
            throw new R2Error('Error starting Steam', (err as Error).message, 'Ensure that the Steam directory has been set correctly in the settings');
        }
    }
}
