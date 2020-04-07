import R2Error from '../errors/R2Error';
import * as fs from 'fs-extra';
import FileWriteError from '../errors/FileWriteError';

export default class ConfigFile {
    
    private name: string = '';
    private path: string = '';

    public constructor(name: string, path: string) {
        this.name = name;
        this.path = path;
    }

    public getName(): string {
        return this.name;
    }

    public getPath(): string {
        return this.path;
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