import ManagerSettings from './ManagerSettings';

import * as child from 'child_process';
import * as path from 'path';

export default class GameRunner {

    public static playModded(ror2Directory: string, onComplete: ()=>void, settings: ManagerSettings) {
        child.spawn(path.join(ror2Directory, 'Risk of Rain 2.exe'), ['--doorstop-enable', 'true', '--doorstop-target', 'r2modman\\BepInEx\\core\\BepInEx.Preloader.dll']).on('exit', onComplete);
    }

    public static playVanilla(ror2Directory: string, onComplete: ()=>void, settings: ManagerSettings) {
        child.spawn(path.join(ror2Directory, 'Risk of Rain 2.exe'), ['--doorstop-enable', 'false']).on('exit', onComplete);
    }


}