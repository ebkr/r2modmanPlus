import { BrowserWindow, ipcMain } from 'electron';
import fs from 'fs';

export function hookFsIpc(browserWindow: BrowserWindow) {
    ipcMain.on('node:fs:writeFile', (event, identifier, path, content) => {
        try {
            fs.writeFileSync(path, content);
            browserWindow.webContents.send(`node:fs:writeFile:${identifier}`);
        } catch (e) {
            browserWindow.webContents.send(`node:fs:writeFile:${identifier}`, e);
        }
    });

    ipcMain.on('node:fs:readFile', (event, identifier, path, content) => {
        try {
            const result = fs.readFileSync(path, {
                encoding: 'utf8',
            });
            browserWindow.webContents.send(`node:fs:readFile:${identifier}`, result);
        } catch (e) {
            browserWindow.webContents.send(`node:fs:readFile:${identifier}`, e);
        }
    });

    ipcMain.on('node:fs:exists',  async (event, identifier, path) => {
        const result = await fs.promises.access(path, fs.constants.F_OK)
            .then(() => true)
            .catch(() => false);
        console.log("node:fs:exists", path, result);
        browserWindow.webContents.send(`node:fs:exists:${identifier}`, result);
    });

    ipcMain.on('node:fs:mkdirs',  async (event, {identifier, path}) => {
        try {
            await fs.promises.mkdir(path, { recursive: true });
            browserWindow.webContents.send(`node:fs:mkdirs:${identifier}`);
        } catch (e) {
            browserWindow.webContents.send(`node:fs:mkdirs:${identifier}`, e);
        }
    });

    ipcMain.on('node:fs:readdir',  async (event, {identifier, path}) => {
        try {
            const result = await fs.promises.readdir(path);
            browserWindow.webContents.send(`node:fs:readdir:${identifier}`, result);
        } catch (e) {
            browserWindow.webContents.send(`node:fs:readdir:${identifier}`, e);
        }
    });
}
