import ManagerSettings from './ManagerSettings';

import fs from 'fs-extra';
import * as child from 'child_process';
import * as path from 'path';
import GameDirectoryResolver from './GameDirectoryResolver';
import R2Error from 'src/model/errors/R2Error';
import { Logger, LogSeverity } from '../logging/Logger';
import Profile from '../../model/Profile';
import BepInExLog from '../logging/BepInExLog';

let tail: child.ChildProcessWithoutNullStreams | undefined;

// setInterval(() => {
//     exec('tasklist', function(err, stdout, stderr) {
//     });
// }, 100)

export default class GameRunner {

    public static playModded(ror2Directory: string, onComplete: (err: R2Error | null) => void) {
        if (tail !== undefined) {
            tail.kill()
            tail = undefined;
        }
        Logger.Log(LogSeverity.INFO, 'Launching modded');
        const steamDir: string | R2Error = GameDirectoryResolver.getSteamDirectory();
        if (steamDir instanceof R2Error) {
            onComplete(steamDir);
            return;
        }
        Logger.Log(LogSeverity.INFO, `Steam directory is: ${steamDir}`);
        Logger.Log(LogSeverity.INFO, `Running command: ${steamDir}.exe -applaunch 632360 --doorstop-enable true --doorstop-target r2modman\\BepInEx\\core\\BepInEx.Preloader.dll`);
        
        // Ensure log is empty prior to start
        fs.ensureDirSync(path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx'));
        fs.writeFileSync(path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'LogOutput.log'), '');
        
        child.spawn(`${steamDir}/Steam.exe`, ['-applaunch', '632360', '--doorstop-enable', 'true', '--doorstop-target', 'r2modman\\BepInEx\\core\\BepInEx.Preloader.dll']).on('error', err => {
            Logger.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting modded');
            Logger.Log(LogSeverity.ERROR, err.message);
            onComplete(new R2Error('Error starting Steam', err.message, 'Ensure that the Steam directory has been set correctly in the settings'));
        });
        
        // Read log
        BepInExLog.start();
        onComplete(null);
        tail = child.spawn('powershell.exe', ['Get-Content', `"${path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'LogOutput.log')}"`, '-Wait']);
        tail.stdout.on('data', data => {
            BepInExLog.add(data.toString());
            onComplete(null);
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
        Logger.Log(LogSeverity.INFO, `Running command: ${steamDir}.exe -applaunch 632360 --doorstop-enable false`);
        child.spawn(`${steamDir}/Steam.exe`, ['-applaunch', '632360', '--doorstop-enable', 'false']).on('error', err => {
            Logger.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting vanilla');
            Logger.Log(LogSeverity.ERROR, err.message);
            onComplete(new R2Error('Error starting Steam', err.message, 'Ensure that the Steam directory has been set correctly in the settings'));
        });
    }


}