import ManagerSettings from './ManagerSettings';

import * as child from 'child_process';
import * as path from 'path';
import GameDirectoryResolver from './GameDirectoryResolver';
import R2Error from 'src/model/errors/R2Error';

export default class GameRunner {

    public static playModded(ror2Directory: string, onComplete: ()=>void, settings: ManagerSettings) {
        const steamDir: string | R2Error = GameDirectoryResolver.getSteamDirectory();
        if (steamDir instanceof R2Error) {
            onComplete();
            return;
        }
        child.spawn(`${steamDir}/Steam.exe`, ['-applaunch', '632360', '--doorstop-enable', 'true', '--doorstop-target', 'r2modman\\BepInEx\\core\\BepInEx.Preloader.dll']).on('exit', onComplete);
        // child.spawn(path.join(ror2Directory, 'Risk of Rain 2.exe'), ['--doorstop-enable', 'true', '--doorstop-target', 'r2modman\\BepInEx\\core\\BepInEx.Preloader.dll']).on('exit', onComplete);
    }

    public static playVanilla(ror2Directory: string, onComplete: ()=>void, settings: ManagerSettings) {
        const steamDir: string | R2Error = GameDirectoryResolver.getSteamDirectory();
        if (steamDir instanceof R2Error) {
            onComplete();
            return;
        }
        child.spawn(`${steamDir}/Steam.exe`, ['-applaunch', '632360', '--doorstop-enable', 'false']).on('exit', onComplete);
    }


}