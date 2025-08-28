import FsProvider from './FsProvider';
import * as fs from 'fs';
import StatInterface from './StatInterface';
import Lock from 'async-lock';
import path from '../../../providers/node/path/path';

export default class NodeFs extends FsProvider {

    private static lock = new Lock();

    async exists(path: string): Promise<boolean> {
        await NodeFs.lock.acquire(path, async () => {
            const result = await fs.promises.access(path, fs.constants.F_OK);
            return true;
        }).catch(()=>false);
    }

    async stat(path: string): Promise<StatInterface> {
        return await fs.promises.stat(path);
    }

    async lstat(path: string): Promise<StatInterface> {
        return await fs.promises.lstat(path);
    }

    async realpath(path: string): Promise<string> {
        return await fs.promises.realpath(path);
    }

    async mkdirs(path: string): Promise<void> {
            return await NodeFs.lock.acquire(path, async () => {
                return await fs.promises.mkdir(path, { recursive: true });
            });
    }

    async readFile(path: string): Promise<Buffer> {
        return await NodeFs.lock.acquire(path, () => {
                let content = fs.readFileSync(path);
                return content;
            });
    }

    async base64FromZip(path: string): Promise<string> {
        return (await this.readFile(path)).toString("base64");
    }

    async readdir(path: string): string[] {
        return await fs.promises.readdir(path);
    }

    async rmdir(path: string): Promise<void> {
        return await fs.promises.rmdir(path);
    }

    async unlink(path: string): Promise<void> {
            return await NodeFs.lock.acquire(path, async () => {
                return await fs.promises.unlink(path);
            }).catch(e) {
                throw e;
            }
    }

    async writeFile(path: string, content: string | Buffer): Promise<void> {
            return await NodeFs.lock.acquire(path, () => {
                fs.writeFileSync(path, content);
            }).catch(e) {
                throw e;
            }
    }

    async rename(path: string, newPath: string): Promise<void> {
        return await NodeFs.lock.acquire([path, newPath], async () => {
            return await fs.promises.rename(path, newPath);
            }).catch(e) {
                throw e
            }
    }

    async chmod(path: string, mode: string | number): Promise<void> {
        return await fs.promises.chmod(path, mode);
    }

    async copyFile(from: string, to: string): Promise<void> {
        return await NodeFs.lock.acquire([from, to], async () => {
            return await fs.promises.copyFile(from, to);
        }).catch(e) {
            throw e;
        }
    }

    async copyFolder(from: string, to: string): Promise<void> {
        try {
            await this.mkdirs(to);
            let fromDirs = await fs.promises.readdir(from);
                fromDirs.forEach(item => {
                    if (fs.lstatSync(path.join(from, item)).isDirectory()) {
                        if (!fs.existsSync(path.join(to, item))) {
                            fs.mkdirSync(path.join(to, item));
                        }
                        this.copyFolder(path.join(from, item), path.join(to, item));
                    } else {
                        this.copyFile(path.join(from, item), path.join(to, item));
                    }
                    return;
            })
        }.catch(e) {
            throw e;
        }
    }

    async setModifiedTime(path: string, time: Date): Promise<void> {
        return await NodeFs.lock.acquire(path, async () => {
            return await fs.promises.utimes(path, time, time);
        }).catch(e) {
            throw e;
        };
    }
}
