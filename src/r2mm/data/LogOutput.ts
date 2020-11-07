import Profile from '../../model/Profile';
import * as path from 'path'
import FsProvider from '../../providers/generic/file/FsProvider';
import Timeout = NodeJS.Timeout;
let fs: FsProvider;

export default class LogOutput {

    private _exists: boolean = false;

    private static INTERVAL: Timeout | undefined;
    private static LOG_OUTPUT: LogOutput | undefined;

    public static getSingleton(): LogOutput {
        if (this.LOG_OUTPUT === undefined) {
            this.LOG_OUTPUT = new LogOutput();
        }
        return this.LOG_OUTPUT;
    }

    private constructor() {
        fs = FsProvider.instance;
        const profilePath = Profile.getActiveProfile().getPathOfProfile()
        this._exists = fs.existsSync(path.join(profilePath, 'BepInEx', 'LogOutput.log'));

        LogOutput.INTERVAL = setInterval(() => {
            this.exists = fs.existsSync(path.join(profilePath, 'BepInEx', 'LogOutput.log'));
        }, 1000);
    }

    get exists(): boolean {
        return this._exists;
    }


    set exists(value: boolean) {
        this._exists = value;
    }


    public disconnect() {
        if (LogOutput.INTERVAL !== undefined) {
            clearInterval(LogOutput.INTERVAL);
        }
    }
}
