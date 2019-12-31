import ManagerSettings from "./ManagerSettings";

import * as child from 'child_process';
import * as path from 'path';

export default class GameRunner {

    public static playModded(ror2Directory: string, onComplete: ()=>void) {
        child.spawn(path.join(ror2Directory, 'Risk of Rain 2.exe'), ['--doorstop-enable', 'true', '--doorstop-target', 'BepInEx\\core\\BepInEx.Preloader.dll']).on('exit', onComplete);
    }

    public static playVanilla(ror2Directory: string, onComplete: ()=>void) {
        child.spawn(path.join(ror2Directory, 'Risk of Rain 2.exe')).on('exit', onComplete);
    }


}