import R2Error from '../errors/R2Error';
import FsProvider from '../../providers/generic/file/FsProvider';
import FileWriteError from '../errors/FileWriteError';
import ManagerInformation from '../../_managerinf/ManagerInformation';

export default class ConfigFile {

    private readonly name: string;
    private readonly path: string;
    private readonly lastUpdated: Date;

    public constructor(name: string, path: string, date: Date) {
        this.name = name;
        this.path = path;
        this.lastUpdated = date;
    }

    public getName(): string {
        return this.name;
    }

    public getPath(): string {
        return this.path;
    }

    public getLastUpdated(): Date {
        return this.lastUpdated;
    }

    public async updateFile(text: string): Promise<R2Error | void> {
        const fs = FsProvider.instance;
        try {
            await fs.writeFile(this.path, text);
        } catch(e) {
            const err: Error = e;
            return new FileWriteError('Failed to update config file', err.message, `Try running ${ManagerInformation.APP_NAME} as an administator`);
        }
    }

}
