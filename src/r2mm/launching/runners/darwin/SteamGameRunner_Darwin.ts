import { homedir } from 'os';
import FsProvider from '../../../../providers/generic/file/FsProvider';
import path from 'path';
import GameRunnerProvider from '../../../../providers/generic/game/GameRunnerProvider';
import Game from '../../../../model/game/Game';
import R2Error from '../../../../model/errors/R2Error';
import Profile from '../../../../model/Profile';
import ManagerSettings from '../../../manager/ManagerSettings';
import GameDirectoryResolverProvider from '../../../../providers/ror2/game/GameDirectoryResolverProvider';
import LoggerProvider, { LogSeverity } from '../../../../providers/ror2/logging/LoggerProvider';
import { exec, execSync } from 'child_process';
import GameInstructions from '../../instructions/GameInstructions';
import GameInstructionParser from '../../instructions/GameInstructionParser';

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
        return this.start(game, args, 'modded');
    }

    public async startVanilla(game: Game, profile: Profile): Promise<void | R2Error> {
        const instructions = await GameInstructions.getInstructionsForGame(game, profile);
        return this.start(game, instructions.vanillaParameters, 'vanilla');
    }

    async start(game: Game, args: string, action: string): Promise<void | R2Error> {
        let gameDetails = {};
        let displayName = game.displayName;
        var jsonpath = path.join(process.argv[0], '../../../../', 'games.json');
        var jsonpathexists = await FsProvider.instance.exists(jsonpath);

        async function launchMacOSSteam(){
            const settings = await ManagerSettings.getSingleton(game);
            const steamDir = await GameDirectoryResolverProvider.instance.getSteamDirectory();
            if (steamDir instanceof R2Error) {
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
            try {
                const cmd = `"${steamExecutable}/Contents/MacOS/steam_osx" -applaunch ${game.activePlatform.storeIdentifier} ${args} ${settings.getContext().gameSpecific.launchParameters}`;
                LoggerProvider.instance.Log(LogSeverity.INFO, `Running command: ${cmd}`);
                execSync(cmd);
            } catch (err) {
                LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting the game');
                LoggerProvider.instance.Log(LogSeverity.ERROR, (err as Error).message);
                throw new R2Error('Error starting Steam', (err as Error).message, 'Ensure that the Steam directory has been set correctly in the settings');
            }
        }

        if (jsonpathexists) {
            var json = (await FsProvider.instance.readFile(jsonpath)).toString();
            var GameList = JSON.parse(json);
            Object.keys(GameList.games).filter(function (g) {
                let gameName = GameList.games[g as keyof typeof GameList.games].meta.displayName;
                if (gameName === displayName) {
                    gameDetails = GameList.games[g as keyof typeof GameList.games];
                    gameDetails = gameDetails['r2modman' as keyof typeof gameDetails];
                }
            });
            var gameLaunchers = gameDetails['crossOverLaunchers' as keyof typeof gameDetails];
            if (gameLaunchers) {
                try {
                    var cmd = ``;
                    if (action === 'modded') {
                        console.log(`Opening modded with CrossOver override using launcher: ${gameLaunchers['modded']}`);
                        var cmd = `open "${gameLaunchers['modded']}"`;
                    } else if (action === 'vanilla') {
                        console.log(`Opening vanilla with CrossOver override using launcher: ${gameLaunchers['vanilla']}`);
                        var cmd = `open "${gameLaunchers['vanilla']}"`;
                    }
                    LoggerProvider.instance.Log(LogSeverity.INFO, `Running command: ${cmd}`);
                    execSync(cmd);
                } catch (err) {
                    LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting the game');
                    LoggerProvider.instance.Log(LogSeverity.ERROR, (err as Error).message);
                    throw new R2Error('Error starting Steam', (err as Error).message, 'Ensure that the Steam directory has been set correctly in the settings');
                }
            } else {
                await launchMacOSSteam();
            }

        } else {
            await launchMacOSSteam();
        }
      
    }
}
