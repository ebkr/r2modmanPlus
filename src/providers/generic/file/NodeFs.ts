import FsProvider from './FsProvider';
import * as fs from 'fs';
import LstatInterface from './LstatInterface';
import * as path from 'path';
import Lock from 'async-lock';

export default class NodeFs extends FsProvider {

    private static lock = new Lock();

    async exists(path: string): Promise<boolean> {
        return new Promise(resolve => {
            NodeFs.lock.acquire(path, async () => {
                const result = await fs.promises.access(path, fs.constants.F_OK)
                    .then(() => true)
                    .catch(() => false);
                resolve(result);
            })
        });
    }

    async lstat(path: string): Promise<LstatInterface> {
        return await fs.promises.lstat(path);
    }

    async mkdirs(path: string): Promise<void> {
        return await fs.promises.mkdir(path, { recursive: true });
    }

    async readFile(path: string): Promise<Buffer> {
        return new Promise(resolve => {
            NodeFs.lock.acquire(path, () => {
                let content = fs.readFileSync(path);
                resolve(content);
            });
        });
    }

    async readdir(path: string): Promise<string[]> {
        return await fs.promises.readdir(path);
    }

    async rmdir(path: string): Promise<void> {
        return await fs.promises.rmdir(path);
    }

    async unlink(path: string): Promise<void> {
        return new Promise(resolve => {
            NodeFs.lock.acquire(path, async () => {
                await fs.promises.unlink(path);
                resolve();
            })
        })
    }

    async writeFile(path: string, content: string | Buffer): Promise<void> {
        return new Promise(resolve => {
            NodeFs.lock.acquire(path, () => {
                fs.writeFileSync(path, content);
                resolve();
            });
        })
    }

    async rename(path: string, newPath: string): Promise<void> {
        return new Promise(resolve => {
            NodeFs.lock.acquire(path, async () => {
                await fs.promises.rename(path, newPath);
                resolve();
            });
        });
    }

    async copyFile(from: string, to: string): Promise<void> {
        return new Promise(resolve => {
            NodeFs.lock.acquire(from, async () => {
                await fs.promises.copyFile(from, to);
                resolve();
            });
        });
    }

    async copyFolder(from: string, to: string): Promise<void> {
        return await this.mkdirs(to).then(() => {
            return fs.promises.readdir(from)
                .then(result => {
                    result.forEach(item => {
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
            });
        })
    }
}
