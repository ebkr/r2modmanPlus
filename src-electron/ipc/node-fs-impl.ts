import { BrowserWindow, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';

export function hookFsIpc(browserWindow: BrowserWindow) {
    ipcMain.handle('node:fs:writeFile', (event, path, content) => {
        return fs.promises.writeFile(path, content);
    });

    ipcMain.handle('node:fs:readFile', (event, path) => {
        return fs.promises.readFile(path, {
            encoding: 'utf8'
        });
    });

    ipcMain.handle('node:fs:exists',  async (event, path) => {
        return exists(path);
    });

    ipcMain.handle('node:fs:mkdirs',  async (event, path) => {
        return mkdirs(path);
    });

    ipcMain.handle('node:fs:readdir',  (event, path) => {
        return fs.promises.readdir(path);
    });

    ipcMain.handle('node:fs:stat',  (event, path) => {
        return fs.promises.stat(path).then(result => generateSerializableStat(result));
    });

    ipcMain.handle('node:fs:lstat',  (event, path) => {
        return fs.promises.lstat(path).then(result => generateSerializableStat(result));
    });

    ipcMain.handle('node:fs:rmdir',  (event, path) => {
        return fs.promises.rmdir(path);
    });

    ipcMain.handle('node:fs:unlink', (event, path) => {
        return fs.promises.unlink(path);
    });

    ipcMain.handle('node:fs:realpath', (event, path) => {
        return fs.promises.realpath(path);
    });

    ipcMain.handle('node:fs:rename', (event, path, newPath) => {
        return fs.promises.rename(path, newPath);
    });

    ipcMain.handle('node:fs:chmod', (event, path, mode) => {
        return fs.promises.chmod(path, mode);
    });

    ipcMain.handle('node:fs:copyFile', (event, from, to) => {
        return copyFile(from, to);
    });

    ipcMain.handle('node:fs:copyFolder', async (event, from, to) => {
        return copyFolder(from, to);
    });

    ipcMain.handle('node:fs:base64FromZip', (event, path) => {
        return fs.promises.readFile(path, {
            encoding: 'base64'
        });
    });

    ipcMain.handle('node:fs:setModifiedTime', (event, path, time) => {
        return fs.promises.utimes(path, time, time)
    });
}

async function copyFile(from: string, to: string) {
    return fs.promises.copyFile(from, to)
}

async function copyFolder(from: string, to: string) {
    return fs.promises.readdir(from)
        .then(async result => {
            for (const item of result) {
                const fromLstat = await fs.promises.lstat(path.join(from, item));
                if (fromLstat.isDirectory()) {
                    const toDirectoryExists = await exists(path.join(to, item));
                    if (!toDirectoryExists) {
                        await mkdirs(path.join(to, item));
                    }
                    await copyFolder(path.join(from, item), path.join(to, item));
                } else {
                    await mkdirs(path.dirname(path.join(to, item)))
                    await copyFile(path.join(from, item), path.join(to, item));
                }
            }
        });
}

async function mkdirs(mkdirPath: string) {
    return fs.promises.mkdir(mkdirPath, { recursive: true });
}

async function exists(path: string) {
    return fs.promises.access(path, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);
}

type SerializableStat = Omit<fs.Stats, 'isDirectory' | 'isFile'> & {
    isDirectory: boolean;
    isFile: boolean;
};

function generateSerializableStat(statLike: fs.Stats): SerializableStat {
    const unpackedStatLike = {
        ...statLike
    } as fs.StatsBase<number>;
    return {
        ...unpackedStatLike,
        isDirectory: statLike.isDirectory(),
        isFile: statLike.isFile(),
    };
}
