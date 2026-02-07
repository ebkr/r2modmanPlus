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
import ChildProcess from '../../../../providers/node/child_process/child_process';
import appWindow from "../../../../providers/node/app/app_window";
import path from "../../../../providers/node/path/path";

export default class DirectGameRunner extends GameRunnerProvider {

    public async getGameArguments(game: Game, profile: Profile): Promise<string[] | R2Error> {
        const instructions = await GameInstructions.getInstructionsForGame(game, profile);
        return await GameInstructionParser.parseList(instructions.moddedParameterList!, game, profile);
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
        return new Promise(async (resolve, reject) => {
            const settings = await ManagerSettings.getSingleton(game);
            let gameDir = await GameDirectoryResolverProvider.instance.getDirectory(game);
            if (gameDir instanceof R2Error) {
                return resolve(gameDir);
            }

            gameDir = await FsProvider.instance.realpath(gameDir);

            const gameExecutable = (await FsProvider.instance.readdir(gameDir))
                .filter((x: string) => game.exeName.includes(x))[0];

            if (gameExecutable === undefined) {
                const message = game.exeName.length > 1 ?
                    `Could not find any of "${game.exeName.join('", "')}"` :
                    `Could not find "${game.exeName[0]}"`;
                const r2err = new R2Error(
                    `${game.displayName} folder is invalid`,
                    message,
                    'Ensure that the game folder has been set correctly in the settings'
                );
                return reject(r2err);
            }

            const gameExecutablePath = path.join(gameDir, gameExecutable);
            let realGameExecutablePath;
            if (appWindow.getPlatform() === 'darwin' && gameExecutable.endsWith('.app') && (await FsProvider.instance.stat(gameExecutablePath)).isDirectory()) {
                const infoPlist = await (FsProvider.instance.readFile(path.join(gameExecutablePath, 'Contents', 'Info.plist')))
                    .then(buf => buf.toString())
                    .then(str => new DOMParser().parseFromString(str, 'application/xml'));
                const keys = Array.from(infoPlist.getElementsByTagName('key'));
                const realExecutableName = keys.find(key => key.innerHTML.trim() === 'CFBundleExecutable')
                    ?.nextElementSibling?.innerHTML.trim();
                if (realExecutableName === undefined) {
                    const r2err = new R2Error(
                        `${gameExecutable} is invalid`,
                        'Could not find an actual executable inside app',
                        'Ensure that the game folder has been set correctly in the settings'
                    );
                    return reject(r2err);
                }
                realGameExecutablePath = path.join(gameExecutablePath, 'Contents', 'MacOS', realExecutableName);
            }
            realGameExecutablePath ??= gameExecutablePath;

            const mappedArgs = args.map(value => `"${value}"`).join(' ');

            const command = `"${realGameExecutablePath}" ${mappedArgs} ${settings.getContext().gameSpecific.launchParameters}`;
            LoggerProvider.instance.Log(LogSeverity.INFO, `Running command: ${command}`);

            const childProcess = ChildProcess.exec(command, {
                cwd: gameDir,
                windowsHide: false,
            }, (err => {
                if (err !== null) {
                    LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting modded');
                    LoggerProvider.instance.Log(LogSeverity.ERROR, err.message);
                    const r2err = new R2Error('Error starting the game', err.message, 'Ensure that the game folder has been set correctly in the settings');
                    return reject(r2err);
                }
                return resolve();
            }));
        });
    }
}
