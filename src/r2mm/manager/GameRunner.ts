import ManagerSettings from './ManagerSettings';

import * as path from 'path';
import GameDirectoryResolver from './GameDirectoryResolver';
import R2Error from '../../model/errors/R2Error';
import LoggerProvider, { LogSeverity } from '../../providers/ror2/logging/LoggerProvider';
import { exec } from 'child_process';
import Profile from '../../model/Profile';

export default class GameRunner {

    public static chooseExecutable(): string {
        switch (process.platform) {
            case 'win32':
                return 'Steam.exe';
            case 'linux':
                return 'steam.sh';
            default:
                return 'steam';
        }
    }

    public static async playModded(ror2Directory: string, onComplete: (err: R2Error | null) => void) {
        LoggerProvider.instance.Log(LogSeverity.INFO, 'Launching modded');
        const settings = await ManagerSettings.getSingleton();
        const steamDir: string | R2Error = await GameDirectoryResolver.getSteamDirectory();
        const preloaderDir: string =
            // Win32 will likely resolve this to C:\ + the path to the preloader
            // However, non-Win32 platforms will use Wine/Proton to run the game.
            // There, C:\ is the "wineprefix", a sandboxed windows-like file system.
            // The actual filesystem is mounted on Z:\ by default, so we have to
            // manually prefix the preloader's path for the game to find it and load it
            (process.platform !== 'win32' ? 'Z:' : '') +
            path.join(Profile.getActiveProfile().getPathOfProfile(), "BepInEx", "core", "BepInEx.Preloader.dll");
        if (steamDir instanceof R2Error) {
            onComplete(steamDir);
            return;
        }

        LoggerProvider.instance.Log(LogSeverity.INFO, `Steam directory is: ${steamDir}`);
        LoggerProvider.instance.Log(LogSeverity.INFO, `Running command: "${path.join(steamDir, GameRunner.chooseExecutable())}" -applaunch 632360 --doorstop-enable true --doorstop-target ${preloaderDir} ${settings.launchParameters}`);
        exec(`"${path.join(steamDir, GameRunner.chooseExecutable())}" -applaunch 632360 --doorstop-enable true --doorstop-target ${preloaderDir} ${settings.launchParameters}`, (err => {
            if (err !== null) {
                LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting modded');
                LoggerProvider.instance.Log(LogSeverity.ERROR, err.message);
                onComplete(new R2Error('Error starting Steam', err.message, 'Ensure that the Steam directory has been set correctly in the settings'));
            }
        }));
    }

    public static async playVanilla(ror2Directory: string, onComplete: (err: R2Error | null) => void) {
        LoggerProvider.instance.Log(LogSeverity.INFO, 'Launching vanilla');
        const settings = await ManagerSettings.getSingleton();
        const steamDir: string | R2Error = await GameDirectoryResolver.getSteamDirectory();
        if (steamDir instanceof R2Error) {
            onComplete(steamDir);
            return;
        }

        LoggerProvider.instance.Log(LogSeverity.INFO, `Steam directory is: ${steamDir}`);
        LoggerProvider.instance.Log(LogSeverity.INFO, `Running command: "${path.join(steamDir, GameRunner.chooseExecutable())}" -applaunch 632360 --doorstop-enable false ${settings.launchParameters}`);
        exec(`"${path.join(steamDir, GameRunner.chooseExecutable())}" -applaunch 632360 --doorstop-enable false ${settings.launchParameters}`, (err => {
            if (err !== null) {
                LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting modded');
                LoggerProvider.instance.Log(LogSeverity.ERROR, err.message);
                onComplete(new R2Error('Error starting Steam', err.message, 'Ensure that the Steam directory has been set correctly in the settings'));
            }
        }));
    }


}
