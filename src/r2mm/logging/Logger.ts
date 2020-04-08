import fs from 'fs-extra';
import * as path from 'path';
import PathResolver from '../manager/PathResolver';

export class Logger {

    private static logList: string[] = [];

    public static Log(severity: LogSeverity, error: string) {
        this.logList.push(`${new Date().toLocaleTimeString()} [${severity}]: ${error}`);
        this.Write();
    }

    private static Write() {
        fs.writeFile(path.join(PathResolver.ROOT, 'log.txt'), this.logList.join('\n'));
    }

    
}

export enum LogSeverity {
    ACTION_STOPPED = 'ACTION_STOPPED',
    BREAKING = 'BREAKING',
    INFO = 'INFO',
    ERROR = 'ERROR'
}