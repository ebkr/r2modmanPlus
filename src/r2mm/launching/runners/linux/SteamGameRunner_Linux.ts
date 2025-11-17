import FsProvider from '../../../../providers/generic/file/FsProvider';
import LinuxGameDirectoryResolver from '../../../manager/linux/GameDirectoryResolver';
import path from '../../../../providers/node/path/path';
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
import { PackageLoader } from '../../../../model/schema/ThunderstoreSchema';
import { getDeterminedLaunchType } from '../../../../utils/LaunchUtils';
import { LaunchType } from '../../../../model/real_enums/launch/LaunchType';
import childProcess from '../../../../providers/node/child_process/child_process';

export default class SteamGameRunner_Linux extends GameRunnerProvider {

    public async getGameArguments(game: Game, profile: Profile): Promise<string | R2Error> {
        const instructions = await GameInstructions.getInstructionsForGame(game, profile);
        return await GameInstructionParser.parse(instructions.moddedParameters, game, profile);
    }

    public async startModded(game: Game, profile: Profile): Promise<void | R2Error> {
        const settings = await ManagerSettings.getSingleton(game);
        const isProton = await getDeterminedLaunchType(game, settings.getLaunchType() || LaunchType.AUTO) === LaunchType.PROTON;

        if (isProton) {
            // BepInEx uses winhttp, GDWeave uses winmm. More can be added later.
            const proxyDll = game.packageLoader == PackageLoader.GDWEAVE ? "winmm" : "winhttp";
            const promise = await this.ensureWineWillLoadDllOverride(game, proxyDll);
            if (promise instanceof R2Error) {
                return promise;
            }
        } else {
            // If sh files aren't executable then the wrapper will fail.
            const shFiles = (await FsProvider.instance.readdir(await FsProvider.instance.realpath(Profile.getActiveProfile().getProfilePath())))
                .filter(value => value.endsWith(".sh"));

            try {
                for (const shFile of shFiles) {
                    await FsProvider.instance.chmod(await FsProvider.instance.realpath(Profile.getActiveProfile().joinToProfilePath(shFile)), 0o755);
                }
            } catch (e) {
                const err: Error = e as Error;
                return new R2Error("Failed to make sh file executable", err.message, "You may need to run the manager with elevated privileges.");
            }
        }

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

        let steamExecutable: string;
        // try {
        //     steamExecutable = (childProcess.execSync("which steam")).trim();
        // } catch (error) {
        //     console.log(error)
            if(steamDir instanceof R2Error) {
                return steamDir;
            }
            steamExecutable = `${steamDir}/steam.sh`;
        // }

        console.log('steam exec:', `"${steamExecutable}"`);
        LoggerProvider.instance.Log(LogSeverity.INFO, `Steam executable to call is: ${steamExecutable}`);

        try {

            const cmd = `"${steamExecutable.trim()}" -applaunch ${game.activePlatform.storeIdentifier} ${args} ${settings.getContext().gameSpecific.launchParameters}`;
            LoggerProvider.instance.Log(LogSeverity.INFO, `Running command: ${cmd}`);
            await ChildProcess.exec(cmd);
        } catch(err) {
            LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting the game');
            LoggerProvider.instance.Log(LogSeverity.ERROR, (err as Error).message);
            throw new R2Error('Error starting Steam', (err as Error).message, 'Ensure that the Steam folder has been set correctly in the settings');
        }

    }

    private async ensureWineWillLoadDllOverride(game: Game, proxyDll: string): Promise<void | R2Error>{
        const fs = FsProvider.instance;
        const compatDataDir = await (GameDirectoryResolverProvider.instance as LinuxGameDirectoryResolver).getCompatDataDirectory(game);
        if(compatDataDir instanceof R2Error)
            return compatDataDir;
        const userReg = path.join(compatDataDir, 'pfx', 'user.reg');
        const userRegData = (await fs.readFile(userReg)).toString();
        const ensuredUserRegData = this.regAddInSection(
            userRegData,
            "[Software\\\\Wine\\\\DllOverrides]",
            proxyDll,
            "native,builtin"
        );

        if(userRegData !== ensuredUserRegData){
            await fs.copyFile(userReg, path.join(path.dirname(userReg), 'user.reg.bak'));
            await fs.writeFile(userReg, ensuredUserRegData);
        }
    }

    private regAddInSection(reg: string, section: string, key: string, value: string): string {
        /*
            Example section
            [header]                // our section variable
            #time=...               // timestamp
            "key"="value"

            It's ended with two newlines (/n/n)
        */
        let split = reg.split("\n");

        let begin = 0;
        // Get section begin
        for (let index = 0; index < split.length; index++) {
            if (split[index].startsWith(section)) {
                begin = index + 2; // We need to skip the timestamp line
                break;
            }
        }

        // Get end
        let end = 0;
        for (let index = begin; index < split.length; index++) {
            if (split[index].length == 0) {
                end = index;
                break;
            }
        }

        // Check for key and fix it eventually, then return
        for (let index = begin; index < end; index++) {
            if (split[index].startsWith(`"${key}"`)) {
                split[index] = `"${key}"="${value}"`;
                return split.join("\n");
            }
        }

        // Append key and return
        split.splice(end, 0, `"${key}"="${value}"`);
        return split.join("\n");
    }
}
