import FsProvider from '../../providers/generic/file/FsProvider';
import PathResolver from '../manager/PathResolver';
import { LogSeverity } from '../../providers/ror2/logging/LoggerProvider';
import FileUtils from '../../utils/FileUtils';
import path from '../../providers/node/path/path';

export class Logger {

    private static logList: string[] = [];

    public async Log(severity: LogSeverity, error: string) {
        Logger.logList.push(`${new Date().toLocaleTimeString()} [${severity}]: ${error}`);
        await this.Write();
    }

    async Write() {
        const fs = FsProvider.instance;
        await FileUtils.ensureDirectory(PathResolver.ROOT);
        try {
            await fs.writeFile(path.join(PathResolver.ROOT, 'log.txt'), Logger.logList.join('\n'));
        } catch (e) {
            // do nothing
        }
    }


}
