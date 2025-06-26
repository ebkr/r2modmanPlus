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

    ipcMain.on('node:fs:exists',  async (event, identifier, path) => {
        console.log(`node:fs:exists`, identifier, path);
        const result = await fs.promises.access(path, fs.constants.F_OK)
            .then(() => true)
            .catch(() => false);
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
}
