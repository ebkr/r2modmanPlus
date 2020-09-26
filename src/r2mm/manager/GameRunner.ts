import ManagerSettings from './ManagerSettings';

import GameDirectoryResolver from './GameDirectoryResolver';
import R2Error from '../../model/errors/R2Error';
import LoggerProvider, { LogSeverity } from '../../providers/ror2/logging/LoggerProvider';
import { exec } from 'child_process';

export default class GameRunner {

    public static playModded(ror2Directory: string, onComplete: (err: R2Error | null) => void) {
        LoggerProvider.instance.Log(LogSeverity.INFO, 'Launching modded');
        const settings = ManagerSettings.getSingleton();
        const steamDir: string | R2Error = GameDirectoryResolver.getSteamDirectory();
        if (steamDir instanceof R2Error) {
            onComplete(steamDir);
            return;
        }
        LoggerProvider.instance.Log(LogSeverity.INFO, `Steam directory is: ${steamDir}`);
        LoggerProvider.instance.Log(LogSeverity.INFO, `Running command: ${steamDir}.exe -applaunch 632360 --doorstop-enable true --doorstop-target r2modman\\BepInEx\\core\\BepInEx.Preloader.dll`);
        exec(`"${steamDir}/Steam.exe" -applaunch 632360 --doorstop-enable true --doorstop-target r2modman\\BepInEx\\core\\BepInEx.Preloader.dll ${settings.launchParameters}`, (err => {
            if (err !== null) {
                LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting modded');
                LoggerProvider.instance.Log(LogSeverity.ERROR, err.message);
                onComplete(new R2Error('Error starting Steam', err.message, 'Ensure that the Steam directory has been set correctly in the settings'));
            }
        }));
    }

    public static playVanilla(ror2Directory: string, onComplete: (err: R2Error | null) => void) {
        LoggerProvider.instance.Log(LogSeverity.INFO, 'Launching vanilla');
        const settings = ManagerSettings.getSingleton();
        const steamDir: string | R2Error = GameDirectoryResolver.getSteamDirectory();
        if (steamDir instanceof R2Error) {
            onComplete(steamDir);
            return;
        }
        LoggerProvider.instance.Log(LogSeverity.INFO, `Steam directory is: ${steamDir}`);
        LoggerProvider.instance.Log(LogSeverity.INFO, `Running command: ${steamDir}.exe -applaunch 632360 --doorstop-enable false`);
        exec(`"${steamDir}/Steam.exe" -applaunch 632360 --doorstop-enable false ${settings.launchParameters}`, (err => {
            if (err !== null) {
                LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting modded');
                LoggerProvider.instance.Log(LogSeverity.ERROR, err.message);
                onComplete(new R2Error('Error starting Steam', err.message, 'Ensure that the Steam directory has been set correctly in the settings'));
            }
        }));
    }


}
