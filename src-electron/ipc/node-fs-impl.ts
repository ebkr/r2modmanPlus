import { BrowserWindow, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';

export function hookFsIpc(browserWindow: BrowserWindow) {
    ipcMain.on('node:fs:writeFile', (event, identifier, path, content) => {
        fs.promises.writeFile(path, content)
            .then(() => browserWindow.webContents.send(`node:fs:writeFile:${identifier}`))
            .catch(e => browserWindow.webContents.send(`node:fs:writeFile:${identifier}`, e));
    });

    ipcMain.on('node:fs:readFile', (event, identifier, path) => {
        fs.promises.readFile(path, {
            encoding: 'utf8'
        })
            .then(result => browserWindow.webContents.send(`node:fs:readFile:${identifier}`, result))
            .catch(e => browserWindow.webContents.send(`node:fs:readFile:${identifier}`, e))
    });

    ipcMain.on('node:fs:exists',  async (event, identifier, path) => {
        const doesExist = await exists(path);
        browserWindow.webContents.send(`node:fs:exists:${identifier}`, doesExist);
    });

    ipcMain.on('node:fs:mkdirs',  async (event, identifier, path) => {
        mkdirs(path)
            .then(() => browserWindow.webContents.send(`node:fs:mkdirs:${identifier}`))
            .catch(e => browserWindow.webContents.send(`node:fs:mkdirs:${identifier}`, e));
    });

    ipcMain.on('node:fs:readdir',  (event, identifier, path) => {
        fs.promises.readdir(path)
            .then(files => {
                return files;
            })
            .then(result => browserWindow.webContents.send(`node:fs:readdir:${identifier}`, result))
            .catch(e => browserWindow.webContents.send(`node:fs:readdir:${identifier}`, e));
    });

    ipcMain.on('node:fs:stat',  (event, identifier, path) => {
        fs.promises.stat(path)
            .then(result => browserWindow.webContents.send(`node:fs:stat:${identifier}`, generateInlineStat(result)))
            .catch(e => browserWindow.webContents.send(`node:fs:stat:${identifier}`, e));
    });

    ipcMain.on('node:fs:lstat',  (event, identifier, path) => {
        fs.promises.stat(path)
            .then(result => browserWindow.webContents.send(`node:fs:lstat:${identifier}`, generateInlineStat(result)))
            .catch(e => browserWindow.webContents.send(`node:fs:lstat:${identifier}`, e));
    });

    ipcMain.on('node:fs:rmdir',  (event, identifier, path) => {
        fs.promises.rmdir(path)
            .then(() => browserWindow.webContents.send(`node:fs:rmdir:${identifier}`))
            .catch(e => browserWindow.webContents.send(`node:fs:rmdir:${identifier}`, e))
    });

    ipcMain.on('node:fs:unlink', (event, identifier, path) => {
        fs.promises.unlink(path)
            .then(() => browserWindow.webContents.send(`node:fs:unlink:${identifier}`))
            .catch(e => browserWindow.webContents.send(`node:fs:unlink:${identifier}`, e))
    });

    ipcMain.on('node:fs:realpath', (event, identifier, path) => {
        fs.promises.realpath(path)
            .then(() => browserWindow.webContents.send(`node:fs:realpath:${identifier}`))
            .catch(e => browserWindow.webContents.send(`node:fs:realpath:${identifier}`, e))
    });

    ipcMain.on('node:fs:rename', (event, identifier, path, newPath) => {
        fs.promises.rename(path, newPath)
            .then(() => browserWindow.webContents.send(`node:fs:rename:${identifier}`))
            .catch(e => browserWindow.webContents.send(`node:fs:rename:${identifier}`, e))
    });

    ipcMain.on('node:fs:chmod', (event, identifier, path, mode) => {
        fs.promises.chmod(path, mode)
            .then(() => browserWindow.webContents.send(`node:fs:chmod:${identifier}`))
            .catch(e => browserWindow.webContents.send(`node:fs:chmod:${identifier}`, e))
    });

    ipcMain.on('node:fs:copyFile', (event, identifier, from, to) => {
        copyFile(from, to)
            .then(() => browserWindow.webContents.send(`node:fs:copyFile:${identifier}`))
            .catch(e => browserWindow.webContents.send(`node:fs:copyFile:${identifier}`, e))
    });

    ipcMain.on('node:fs:copyFolder', async (event, identifier, from, to) => {
        copyFolder(from, to)
            .then(() => browserWindow.webContents.send(`node:fs:copyFolder:${identifier}`))
            .catch(e => browserWindow.webContents.send(`node:fs:copyFolder:${identifier}`, e))
    });

    ipcMain.on('node:fs:base64FromZip', (event, identifier, path) => {
        fs.promises.readFile(path, {
            encoding: 'base64'
        })
            .then(result => browserWindow.webContents.send(`node:fs:base64FromZip:${identifier}`, result))
            .catch(e => browserWindow.webContents.send(`node:fs:base64FromZip:${identifier}`, e))
    });

    ipcMain.on('node:fs:setModifiedTime', (event, identifier, path, time) => {
        fs.promises.utimes(path, time, time)
            .then(() => browserWindow.webContents.send(`node:fs:setModifiedTime:${identifier}`))
            .catch(e => browserWindow.webContents.send(`node:fs:setModifiedTime:${identifier}`, e))
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

function generateInlineStat<T extends fs.StatsBase<number>>(statLike: fs.Stats): T {
    const unpackedStatLike = {
        ...statLike
    } as fs.StatsBase<number>;
    return {
        ...unpackedStatLike,
        isDirectory: statLike.isDirectory(),
        isFile: statLike.isFile(),
    } as unknown as T;
}
