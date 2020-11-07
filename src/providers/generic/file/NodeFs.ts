import FsProvider from './FsProvider';
import * as fs from 'fs';
import LstatInterface from './LstatInterface';
import * as path from 'path';

export default class NodeFs extends FsProvider {

    existsSync(path: string): boolean {
        return fs.existsSync(path);
    }

    lstatSync(path: string): LstatInterface {
        return fs.lstatSync(path);
    }

    mkdirsSync(path: string): void {
        fs.mkdirSync(path, {
            recursive: true
        });
    }

    readFileSync(path: string): Buffer {
        return fs.readFileSync(path);
    }

    readdirSync(path: string): string[] {
        return fs.readdirSync(path);
    }

    rmdirSync(path: string) {
        fs.rmdirSync(path);
    }

    unlinkSync(path: string): void {
        fs.unlinkSync(path);
    }

    writeFileSync(path: string, content: string | Buffer): void {
        fs.writeFileSync(path, content);
    }

    renameSync(path: string, newPath: string) {
        fs.renameSync(path, newPath);
    }

    copyFileSync(from: string, to: string) {
        fs.copyFileSync(from, to);
    }

    copyFolderSync(from: string, to: string) {
        this.mkdirsSync(to);
        fs.readdirSync(from).forEach(item => {
            if (fs.lstatSync(path.join(from, item)).isDirectory()) {
                if (!fs.existsSync(path.join(to, item))) {
                    fs.mkdirSync(path.join(to, item));
                }
                this.copyFolderSync(path.join(from, item), path.join(to, item));
            } else {
                this.copyFileSync(path.join(from, item), path.join(to, item));
            }
        });
    }

    symlinkSync(from: string, to: string, type?: 'junction' | 'dir' | 'file' | null | undefined) {
        fs.symlinkSync(from, to, type);
    }
}
