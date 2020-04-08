import ManagerSettings from './ManagerSettings';

import * as child from 'child_process';
import * as path from 'path';
import GameDirectoryResolver from './GameDirectoryResolver';
import R2Error from 'src/model/errors/R2Error';
import { Logger, LogSeverity } from '../logging/Logger';

export default class GameRunner {

    public static playModded(ror2Directory: string, onComplete: (err: R2Error | null) => void) {
        Logger.Log(LogSeverity.INFO, 'Launching modded');
        const steamDir: string | R2Error = GameDirectoryResolver.getSteamDirectory();
        if (steamDir instanceof R2Error) {
            onComplete(steamDir);
            return;
        }
        Logger.Log(LogSeverity.INFO, `Steam directory is: ${steamDir}`);
        Logger.Log(LogSeverity.INFO, `Running command: ${steamDir} -applaunch 632360 --doorstop-enable true --doorstop-target r2modman\\BepInEx\\core\\BepInEx.Preloader.dll`);
        child.spawn(`${steamDir}/Steam.exe`, ['-applaunch', '632360', '--doorstop-enable', 'true', '--doorstop-target', 'r2modman\\BepInEx\\core\\BepInEx.Preloader.dll']).on('error', err => {
            Logger.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting modded');
            Logger.Log(LogSeverity.ERROR, err.message);
            onComplete(new R2Error('Error starting Steam', err.message, 'Ensure that the Steam directory has been set correctly in the settings'));
        });
    }

    public static playVanilla(ror2Directory: string, onComplete: (err: R2Error | null) => void) {
        Logger.Log(LogSeverity.INFO, 'Launching vanilla');
        const steamDir: string | R2Error = GameDirectoryResolver.getSteamDirectory();
        if (steamDir instanceof R2Error) {
            onComplete(steamDir);
            return;
        }
        Logger.Log(LogSeverity.INFO, `Steam directory is: ${steamDir}`);
        Logger.Log(LogSeverity.INFO, `Running command: ${steamDir} -applaunch 632360 --doorstop-enable false`);
        child.spawn(`${steamDir}/Steam.exe`, ['-applaunch', '632360', '--doorstop-enable', 'false']).on('error', err => {
            Logger.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting vanilla');
            Logger.Log(LogSeverity.ERROR, err.message);
            onComplete(new R2Error('Error starting Steam', err.message, 'Ensure that the Steam directory has been set correctly in the settings'));
        });
    }


}