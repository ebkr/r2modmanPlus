import * as path from 'path';
import * as fs from 'fs-extra';
import PathResolver from '../manager/PathResolver';
import { LogSeverity } from '../../providers/ror2/logging/LoggerProvider';

export class Logger {

    private static logList: string[] = [];

    public Log(severity: LogSeverity, error: string) {
        Logger.logList.push(`${new Date().toLocaleTimeString()} [${severity}]: ${error}`);
        this.Write();
    }

    Write() {
        fs.writeFile(path.join(PathResolver.ROOT, 'log.txt'), Logger.logList.join('\n'));
    }


}
