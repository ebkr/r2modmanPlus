import FsProvider from './FsProvider';
import * as fs from 'fs';
import StatInterface from './StatInterface';
import * as path from 'path';
import Lock from 'async-lock';
import { Readable } from 'stream';

export default class NodeFs extends FsProvider {

    private static lock = new Lock();

    async exists(path: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            NodeFs.lock.acquire(path, async () => {
                const result = await fs.promises.access(path, fs.constants.F_OK)
                    .then(() => true)
                    .catch(() => false);
                resolve(result);
            }).catch(reject);
        });
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
        return new Promise((resolve, reject) => {
            NodeFs.lock.acquire(path, async () => {
                try {
                    await fs.promises.mkdir(path, { recursive: true });
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    async readFile(path: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            NodeFs.lock.acquire(path, () => {
                try {
                    let content = fs.readFileSync(path);
                    resolve(content);
                } catch (e) {
                    reject(e);
                }
            }).catch(reject);
        });
    }

    async base64FromZip(path: string): Promise<string> {
        return (await this.readFile(path)).toString("base64");
    }

    async readdir(path: string): Promise<string[]> {
        return await fs.promises.readdir(path);
    }

    async rmdir(path: string): Promise<void> {
        return await fs.promises.rmdir(path);
    }

    async unlink(path: string): Promise<void> {
        return new Promise((resolve, reject) => {
            NodeFs.lock.acquire(path, async () => {
                try {
                    await fs.promises.unlink(path)
                    resolve();
                } catch (e) {
                    reject(e)
                }
            }).catch(reject);
        })
    }

    async writeFile(path: string, content: string | Buffer): Promise<void> {
        return new Promise((resolve, reject) => {
            NodeFs.lock.acquire(path, () => {
                fs.writeFileSync(path, content);
                resolve();
            }).catch(reject);
        })
    }

    async rename(path: string, newPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            NodeFs.lock.acquire(path, async () => {
                try {
                    await fs.promises.rename(path, newPath);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            })
        });
    }

    async chmod(path: string, mode: string | number): Promise<void> {
        return fs.promises.chmod(path, mode);
    }

    async copyFile(from: string, to: string): Promise<void> {
        return new Promise((resolve, reject) => {
            NodeFs.lock.acquire(from, async () => {
                try {
                    await fs.promises.copyFile(from, to);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            }).catch(reject);
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

    async setModifiedTime(path: string, time: Date): Promise<void> {
        return new Promise((resolve, reject) => {
            NodeFs.lock.acquire(path, async () => {
                try {
                    await fs.promises.utimes(path, time, time);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            }).catch(reject);
        });
    }

    async truncate(path: string, length: number): Promise<void> {
        return new Promise((resolve, reject) => {
            NodeFs.lock.acquire(path, async () => {
                try {
                    await fs.promises.truncate(path, length);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    /**
     *  https://nodejs.org/api/fs.html#fs_filehandle_createreadstream_options
     *  we make the callback inside here because we want it to be before the file closes, and we can't do that with a Promise.then
     * 
     *  @param path path to the file being read
     *  @param chunk_size size in bytes to read at one time
     *  @param callback read handler to be executed on each chunk before the promise resolves
     */
    async createReadStream(path: string, chunk_size: number, callback: (arg0: Readable) => Promise<void>): Promise<void> {
        return new Promise((resolve, reject) => {
            NodeFs.lock.acquire(path, async () => {
                try {
                    const stream = fs.createReadStream(path, {
                        highWaterMark: chunk_size
                    });
                    await callback(stream);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
}
