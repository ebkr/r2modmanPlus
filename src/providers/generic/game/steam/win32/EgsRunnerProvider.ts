import GameRunnerProvider from '../../GameRunnerProvider';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';
import R2Error from '../../../../../model/errors/R2Error';
import FsProvider from '../../../../generic/file/FsProvider';
import * as path from 'path';
import BepInExConfigUtils from '../../../../../utils/BepInExConfigUtils';
import ConfigLine from '../../../../../model/file/ConfigLine';
import GameDirectoryResolverProvider from '../../../../ror2/game/GameDirectoryResolverProvider';
import { shell } from 'electron';

export default class EgsRunnerProvider extends GameRunnerProvider {

    private async getDoorstopTarget(profile: Profile): Promise<string | R2Error> {
        try {
            const corePath = path.join(profile.getPathOfProfile(), "BepInEx", "core");
            return path.join(corePath,
                (await FsProvider.instance.readdir(corePath))
                    .filter((x: string) => ["BepInEx.Preloader.dll", "BepInEx.IL2CPP.dll"].includes(x))[0]);
        } catch (e) {
            const err: Error = e as Error;
            return new R2Error("Failed to find preloader dll", err.message, "BepInEx may not installed correctly. Further help may be required.");
        }
    }

    public async getGameArguments(game: Game, profile: Profile): Promise<string | R2Error> {
        return `--doorstop-enable true --doorstop-target \"${await this.getDoorstopTarget(profile)}\"`
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

    public async startModded(game: Game, profile: Profile): Promise<void | R2Error> {
        const doorstopTarget = await this.getDoorstopTarget(profile);
        if (doorstopTarget instanceof R2Error) {
            return doorstopTarget;
        }
        const updateResult = await this.updateDoorstopConfigVars(profile, {
            UnityDoorstop: {
                targetAssembly: doorstopTarget,
                enabled: "true"
            }
        });
        if (updateResult instanceof R2Error) {
            return updateResult;
        }
        return this.start(game, profile);
    }

    public async startVanilla(game: Game, profile: Profile): Promise<void | R2Error> {
        const updateResult = await this.updateDoorstopConfigVars(profile, {
            UnityDoorstop: {
                enabled: "false"
            }
        });
        if (updateResult instanceof R2Error) {
            return updateResult;
        }
        return this.start(game, profile);
    }

    private async start(game: Game, profile: Profile): Promise<void | R2Error> {
        const fs = FsProvider.instance;
        let gameDir = await GameDirectoryResolverProvider.instance.getDirectory(game);
        if (gameDir instanceof R2Error) {
            return gameDir;
        }
        let realGameDir = await fs.realpath(gameDir);
        const doorstopConfigPath = path.join(profile.getPathOfProfile(), "doorstop_config.ini");
        if (await fs.exists(doorstopConfigPath)) {
            if (await fs.exists(path.join(realGameDir, "doorstop_config.ini"))) {
                try {
                    await fs.unlink(path.join(realGameDir, "doorstop_config.ini"));
                } catch (e) {
                    const err: Error = e as Error;
                    return new R2Error("Couldn't remove doorstop_config.ini from game directory", err.message, null);
                }
            }
            try {
                await fs.copyFile(doorstopConfigPath, path.join(realGameDir, "doorstop_config.ini"));
            } catch (e) {
                const err: Error = e as Error;
                return new R2Error("Couldn't copy doorstop_config.ini to game directory", err.message, null);
            }
        }
        // @ts-ignore
        await shell.openPath(`com.epicgames.launcher://apps/${game.activePlatform.storeIdentifier}?action=launch&silent=true`);
    }

}
