import * as path from 'path';
import FsProvider from '../../providers/generic/file/FsProvider';
import PathResolver from '../manager/PathResolver';
import { LogSeverity } from '../../providers/ror2/logging/LoggerProvider';

export class Logger {

    private static logList: string[] = [];

    public Log(severity: LogSeverity, error: string) {
        Logger.logList.push(`${new Date().toLocaleTimeString()} [${severity}]: ${error}`);
        this.Write();
    }

    Write() {
        const fs = FsProvider.instance;
        fs.writeFileSync(path.join(PathResolver.ROOT, 'log.txt'), Logger.logList.join('\n'));
    }


}
