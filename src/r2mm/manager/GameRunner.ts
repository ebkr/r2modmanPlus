import ManagerSettings from './ManagerSettings';

import * as child from 'child_process';
import * as path from 'path';
import GameDirectoryResolver from './GameDirectoryResolver';
import R2Error from 'src/model/errors/R2Error';
import { Logger, LogSeverity } from '../logging/Logger';
import { exec } from 'child_process';
import Profile from '../../model/Profile';

export default class GameRunner {

    public static chooseExecutable(): string {
        switch(process.platform){
            case 'win32':
                return 'Steam.exe';
            case 'linux':
                return 'steam.sh';
            default:
                return 'steam';
        }
    }

    public static playModded(ror2Directory: string, onComplete: (err: R2Error | null) => void) {
        Logger.Log(LogSeverity.INFO, 'Launching modded');
        const settings = ManagerSettings.getSingleton();
        const steamDir: string | R2Error = GameDirectoryResolver.getSteamDirectory();
        if (steamDir instanceof R2Error) {
            onComplete(steamDir);
            return;
        }
        Logger.Log(LogSeverity.INFO, `Steam directory is: ${steamDir}`);
        Logger.Log(LogSeverity.INFO, `Running command: ${steamDir}.exe -applaunch 632360 --doorstop-enable true --doorstop-target r2modman\\BepInEx\\core\\BepInEx.Preloader.dll`);
        exec(`"${steamDir}/${GameRunner.chooseExecutable()}" -applaunch 632360 --doorstop-enable true --doorstop-target ${path.join(Profile.getActiveProfile().getPathOfProfile(), "BepInEx", "core", "BepInEx.Preloader.dll")} ${settings.launchParameters}`, (err => {
            if (err !== null) {
                Logger.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting modded');
                Logger.Log(LogSeverity.ERROR, err.message);
                onComplete(new R2Error('Error starting Steam', err.message, 'Ensure that the Steam directory has been set correctly in the settings'));
            }
        }));
    }

    public static playVanilla(ror2Directory: string, onComplete: (err: R2Error | null) => void) {
        Logger.Log(LogSeverity.INFO, 'Launching vanilla');
        const settings = ManagerSettings.getSingleton();
        const steamDir: string | R2Error = GameDirectoryResolver.getSteamDirectory();
        if (steamDir instanceof R2Error) {
            onComplete(steamDir);
            return;
        }
        Logger.Log(LogSeverity.INFO, `Steam directory is: ${steamDir}`);
        Logger.Log(LogSeverity.INFO, `Running command: ${steamDir}.exe -applaunch 632360 --doorstop-enable false`);
        exec(`"${steamDir}/${GameRunner.chooseExecutable()}" -applaunch 632360 --doorstop-enable false ${settings.launchParameters}`, (err => {
            if (err !== null) {
                Logger.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting modded');
                Logger.Log(LogSeverity.ERROR, err.message);
                onComplete(new R2Error('Error starting Steam', err.message, 'Ensure that the Steam directory has been set correctly in the settings'));
            }
        }));
    }


}
