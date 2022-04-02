import GameRunnerProvider from '../../../../providers/generic/game/GameRunnerProvider';
import Game from '../../../../model/game/Game';
import R2Error from '../../../../model/errors/R2Error';
import Profile from '../../../../model/Profile';
import GameInstructions from '../../instructions/GameInstructions';
import GameInstructionParser from '../../instructions/GameInstructionParser';
import FsProvider from '../../../../providers/generic/file/FsProvider';
import { shell } from 'electron';
import { PackageLoader } from '../../../../model/installing/PackageLoader';
import { DynamicGameInstruction } from '../../instructions/DynamicGameInstruction';
import * as path from 'path';
import BepInExConfigUtils from '../../../../utils/BepInExConfigUtils';
import ConfigLine from '../../../../model/file/ConfigLine';

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
        if (game.packageLoader === PackageLoader.BEPINEX) {
            // Enable doorstop and set preloader path
            const preloaderPath = await GameInstructionParser.parse(DynamicGameInstruction.BEPINEX_PRELOADER_PATH, game, profile);
            if (preloaderPath instanceof R2Error) {
                return preloaderPath;
            }
            const updateResult = await this.updateDoorstopConfigVars(profile, {
                UnityDoorstop: {
                    targetAssembly: preloaderPath,
                    enabled: "true"
                }
            });
            if (updateResult instanceof R2Error) {
                return updateResult;
            }
        }
        return this.start(game, args);
    }

    public async startVanilla(game: Game, profile: Profile): Promise<void | R2Error> {
        const instructions = await GameInstructions.getInstructionsForGame(game, profile);
        if (game.packageLoader === PackageLoader.BEPINEX) {
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
            await shell.openPath(`com.epicgames.launcher://apps/${game.activePlatform.storeIdentifier}?action=launch&silent=true`);
        } catch (e) {
            const err: Error = e as Error;
            return new R2Error("Failed to start the game", err.message, null);
        }
    }

    private async updateDoorstopConfigVars(profile: Profile, data: {[section: string]: {[key: string]: string}}): Promise<R2Error | undefined> {
        const fs = FsProvider.instance;
        const doorstopConfigPath = path.join(profile.getPathOfProfile(), "doorstop_config.ini");
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
