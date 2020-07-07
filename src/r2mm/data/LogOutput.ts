import Profile from '../../model/Profile';
import * as path from 'path'
import * as fs from 'fs-extra'

export default class LogOutput {

    private _exists: boolean = false;

    private static LOG_OUTPUT: LogOutput | undefined;

    public static getSingleton(): LogOutput {
        if (this.LOG_OUTPUT === undefined) {
            this.LOG_OUTPUT = new LogOutput();
        }
        return this.LOG_OUTPUT;
    }

    private constructor() {
        const profilePath = Profile.getActiveProfile().getPathOfProfile()
        this._exists = fs.existsSync(path.join(profilePath, 'BepInEx', 'LogOutput.log'));

        setInterval(() => {
            this.exists = fs.existsSync(path.join(profilePath, 'BepInEx', 'LogOutput.log'));
        }, 1000);
    }


    get exists(): boolean {
        return this._exists;
    }


    set exists(value: boolean) {
        this._exists = value;
    }
}
