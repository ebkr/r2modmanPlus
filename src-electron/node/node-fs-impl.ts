import { BrowserWindow, ipcMain } from 'electron';
import fs, { StatsBase } from 'fs';
import * as url from 'node:url';

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

    ipcMain.on('node:fs:exists',  (event, identifier, path) => {
        fs.promises.access(path, fs.constants.F_OK)
            .then(() => browserWindow.webContents.send(`node:fs:exists:${identifier}`, true))
            .catch(() => browserWindow.webContents.send(`node:fs:exists:${identifier}`, false));
    });

    ipcMain.on('node:fs:mkdirs',  async (event, identifier, path) => {
        fs.promises.mkdir(path, { recursive: true })
            .then(() => browserWindow.webContents.send(`node:fs:mkdirs:${identifier}`))
            .catch(e => browserWindow.webContents.send(`node:fs:mkdirs:${identifier}`, e));
    });

    ipcMain.on('node:fs:readdir',  (event, identifier, path) => {
        fs.promises.readdir(path)
            .then(files => {
                console.log("Dir for", path, "=", files)
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
}

function generateInlineStat<T extends fs.StatsBase<number>>(statLike: fs.Stats): T {
    const unpackedStatLike = {
        ...statLike
    } as fs.StatsBase<number>;
    return {
        ...unpackedStatLike,
        isDirectory: statLike.isDirectory()
    } as unknown as T;
}
