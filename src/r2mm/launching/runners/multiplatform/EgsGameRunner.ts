import GameRunnerProvider from '../../../../providers/generic/game/GameRunnerProvider';
import Game from '../../../../model/game/Game';
import R2Error from '../../../../model/errors/R2Error';
import Profile from '../../../../model/Profile';
import GameInstructions from '../../instructions/GameInstructions';
import GameInstructionParser from '../../instructions/GameInstructionParser';
import FsProvider from '../../../../providers/generic/file/FsProvider';
import { shell } from 'electron';
import { PackageLoader } from '../../../../model/schema/ThunderstoreSchema';
import { DynamicGameInstruction } from '../../instructions/DynamicGameInstruction';
import * as path from 'path';
import BepInExConfigUtils from '../../../../utils/BepInExConfigUtils';
import ConfigLine from '../../../../model/file/ConfigLine';
import { getUnityDoorstopVersion } from '../../../../utils/UnityDoorstopUtils';

export default class EgsGameRunner extends GameRunnerProvider {

    public async getGameArguments(game: Game, profile: Profile): Promise<string | R2Error> {
        const instructions = await GameInstructions.getInstructionsForGame(game, profile);
        return await GameInstructionParser.parse(instructions.moddedParameters, game, profile);
    }

    public async startModded(game: Game, profile: Profile): Promise<void | R2Error> {
        const args = await this.getGameArguments(game, profile);
        if (args instanceof R2Error) {
            return args
        }
        if (game.packageLoader === PackageLoader.Bepinex) {
            // Enable doorstop and set preloader path
            const preloaderPath = await GameInstructionParser.parse(DynamicGameInstruction.BEPINEX_PRELOADER_PATH, game, profile);
            if (preloaderPath instanceof R2Error) {
                return preloaderPath;
            }

            let doorstopUpdateVars: {[section: string]: {[key: string]: string}};
            const doorstopVersion = await getUnityDoorstopVersion(profile);
            if (doorstopVersion === 3) {
                doorstopUpdateVars = {
                    UnityDoorstop: {
                        targetAssembly: preloaderPath,
                        enabled: "true"
                    }
                };
            } else if (doorstopVersion === 4) {
                doorstopUpdateVars = {
                    General: {
                        ["target_assembly"]: preloaderPath,
                        enabled: "true"
                    }
                };
            } else {
                return new R2Error(
                    "Unsupported Doorstop version",
                    "The version of Unity Doorstop is unsupported. This is likely due to a BepInEx update.",
                    "Either downgrade your BepInEx version or wait for a manager update"
                );
            }

            const updateResult = await this.updateDoorstopConfigVars(profile, doorstopUpdateVars);
            if (updateResult instanceof R2Error) {
                return updateResult;
            }
        }
        return this.start(game, args);
    }

    public async startVanilla(game: Game, profile: Profile): Promise<void | R2Error> {
        const instructions = await GameInstructions.getInstructionsForGame(game, profile);
        if (game.packageLoader === PackageLoader.Bepinex) {
            // Disable doorstop
            const updateResult = await this.updateDoorstopConfigVars(profile, {
                UnityDoorstop: {
                    enabled: "false"
                }
            });
            if (updateResult instanceof R2Error) {
                return updateResult;
            }
        }
        return this.start(game, instructions.vanillaParameters);
    }

    async start(game: Game, args: string): Promise<void | R2Error> {
        try {
            // Ignore errors to allow Thunderstore Mod Manager build without errors
            // @ts-ignore
            await shell.openPath(`com.epicgames.launcher://apps/${game.activePlatform.storeIdentifier}?action=launch&silent=true`);
        } catch (e) {
            const err: Error = e as Error;
            return new R2Error("Failed to start the game", err.message, null);
        }
    }

    private async updateDoorstopConfigVars(profile: Profile, data: {[section: string]: {[key: string]: string}}): Promise<R2Error | undefined> {
        const fs = FsProvider.instance;
        const doorstopConfigPath = profile.joinToProfilePath("doorstop_config.ini");
        try {
            if (await fs.exists(doorstopConfigPath)) {
                const originalConfigText = (await fs.readFile(doorstopConfigPath)).toString();
                const breakdown = await BepInExConfigUtils.getBepInExConfigBreakdown(doorstopConfigPath);
                for (const section of Object.keys(data)) {
                    for (const key of Object.keys(data[section])) {
                        breakdown[section][key] = new ConfigLine(data[section][key], breakdown[section][key].comments, breakdown[section][key].allowedValues);
                    }
                }
                await BepInExConfigUtils.updateBepInExConfigFile(doorstopConfigPath, originalConfigText, breakdown);
            } else {
                return new R2Error("doorstop_config.ini not found in profile folder", "BepInEx must be installed.", "https://github.com/ebkr/r2modmanPlus/wiki/Why-aren't-my-mods-working%3F#corrupted-bepinex-installation");
            }
        } catch (e) {
            const err: Error = e as Error;
            return new R2Error("Failed to update doorstop_config.ini", err.message, null);
        }
    }
}
