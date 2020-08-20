import R2Error from '../errors/R2Error';
import * as fs from 'fs-extra';
import FileWriteError from '../errors/FileWriteError';

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

    public updateFile(text: string): R2Error | void {
        try {
            fs.writeFileSync(this.path, text);
        } catch(e) {
            const err: Error = e;
            return new FileWriteError('Failed to update config file', err.message, 'Try running r2modman as an administator');
        }
    }

}
