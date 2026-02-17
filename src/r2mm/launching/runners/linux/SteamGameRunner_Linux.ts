import FsProvider from '../../../../providers/generic/file/FsProvider';
import path from '../../../../providers/node/path/path';
import LinuxGameDirectoryResolver from '../../../manager/linux/GameDirectoryResolver';
import GameRunnerProvider from '../../../../providers/generic/game/GameRunnerProvider';
import Game from '../../../../model/game/Game';
import R2Error from '../../../../model/errors/R2Error';
import Profile from '../../../../model/Profile';
import ManagerSettings from '../../../manager/ManagerSettings';
import GameDirectoryResolverProvider from '../../../../providers/ror2/game/GameDirectoryResolverProvider';
import LoggerProvider, {LogSeverity} from '../../../../providers/ror2/logging/LoggerProvider';
import childProcess from '../../../../providers/node/child_process/child_process';
import GameInstructions from '../../instructions/GameInstructions';
import GameInstructionParser from '../../instructions/GameInstructionParser';
import {PackageLoader} from '../../../../model/schema/ThunderstoreSchema';
import {getDeterminedLaunchType, isManagerRunningOnFlatpak} from '../../../../utils/LaunchUtils';
import {LaunchType} from '../../../../model/real_enums/launch/LaunchType';
import InteractionProvider from "../../../../providers/ror2/system/InteractionProvider";
import PathResolver from "../../../manager/PathResolver";
import { parse as parseShell } from "shell-quote";

export default class SteamGameRunner_Linux extends GameRunnerProvider {

    public async getGameArguments(game: Game, profile: Profile) {
        const instructions = await GameInstructions.getInstructionsForGame(game, profile);
        return await GameInstructionParser.parseList(instructions.moddedParameterList, game, profile);
    }

    public async startModded(game: Game, profile: Profile): Promise<void | R2Error> {
        const settings = await ManagerSettings.getSingleton(game);
        const isProton = await getDeterminedLaunchType(game, settings.getLaunchType() || LaunchType.AUTO) === LaunchType.PROTON;

        let proxyArgs: Record<string, string> = {};

        if (isProton) {
            // BepInEx uses winhttp, GDWeave uses winmm. More can be added later.
            const proxyDll = game.packageLoader == PackageLoader.GDWEAVE ? "winmm" : "winhttp";
            const promise = await this.ensureWineWillLoadDllOverride(game, proxyDll);
            if (promise instanceof R2Error) {
                // We no longer want to display an error as launch args should be set correctly.
                // A console error still allows it to be discoverable.
                console.error(promise);
            }
            proxyArgs['WINEDLLOVERRIDES'] = `"${proxyDll}=n,b"`
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
        return this.start(game, args, proxyArgs);
    }

    public async startVanilla(game: Game, profile: Profile): Promise<void | R2Error> {
        const instructions = await GameInstructions.getInstructionsForGame(game, profile);
        return this.start(game, instructions.vanillaParameterList, {});
    }

    async start(game: Game, args: string[], proxyArgs: Record<string, string>): Promise<void | R2Error> {

        const env = await InteractionProvider.instance.getEnvironmentVariables();
        if (env.STEAM_RUNTIME) { proxyArgs['STEAM_RUNTIME'] = `${env.STEAM_RUNTIME}` }
        if (env.LD_PRELOAD) { proxyArgs['LD_PRELOAD'] = `'${env.LD_PRELOAD}'` }

        const settings = await ManagerSettings.getSingleton(game);
        const steamDir = await GameDirectoryResolverProvider.instance.getSteamDirectory();

        if (steamDir instanceof R2Error) {
            return steamDir;
        }
        const steamExecutable = `${steamDir}/steam.sh`;

        LoggerProvider.instance.Log(LogSeverity.INFO, `Steam executable to call is: ${steamExecutable}`);

        const executableNamePart = `"${steamExecutable}"`;
        const appLaunchPart = `-applaunch ${game.activePlatform.storeIdentifier}`;
        const modLoaderArgumentsPart = args.map(value => `"${value}"`).join(' ');
        const userDefinedArgsPart = `${settings.getContext().gameSpecific.launchParameters}`;

        const executionParts = [
            executableNamePart,
            appLaunchPart,
            modLoaderArgumentsPart,
            userDefinedArgsPart,
        ];

        const commandString = executionParts.join(" ").trim();
        LoggerProvider.instance.Log(LogSeverity.INFO, `Running command: ${commandString}`);
        console.log("Command:", commandString);

        try {

            if (await isManagerRunningOnFlatpak()) {
                console.log("Launching flatpak")

                const isProton = await getDeterminedLaunchType(game, settings.getLaunchType() || LaunchType.AUTO) === LaunchType.PROTON;

                // If Proton, there is no wrapper script.
                // We instead add a stub argument which is `--`.
                // This value doesn't matter and can be changed if required to a suitable ignored value.
                // If native, we need to chainload into the linux_wrapper.sh file.
                const lineArgs = isProton ? ['--'] : [
                    `${PathResolver.MOD_ROOT}/linux_wrapper.sh`
                ]

                lineArgs.push(
                    ...args,
                    ...parseShell(userDefinedArgsPart)
                );

                await FsProvider.instance.writeFile(path.join(PathResolver.MOD_ROOT, 'wrapper_args.txt'), lineArgs.join('\n'))

                childProcess.execSync(
                    `${PathResolver.MOD_ROOT}/steam_executable_launch.sh steam://run/${game.activePlatform.storeIdentifier}/`);
            } else {
                console.log("Launching standard", commandString)
                childProcess.execSync(
                    commandString,
                    {
                        env: env,
                        stdio: 'inherit'
                    }
                );
            }
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
            if (split[index]!.startsWith(section)) {
                begin = index + 2; // We need to skip the timestamp line
                break;
            }
        }

        // Get end
        let end = 0;
        for (let index = begin; index < split.length; index++) {
            if (split[index]!.length == 0) {
                end = index;
                break;
            }
        }

        // Check for key and fix it eventually, then return
        for (let index = begin; index < end; index++) {
            if (split[index]!.startsWith(`"${key}"`)) {
                split[index] = `"${key}"="${value}"`;
                return split.join("\n");
            }
        }

        // Append key and return
        split.splice(end, 0, `"${key}"="${value}"`);
        return split.join("\n");
    }
}
