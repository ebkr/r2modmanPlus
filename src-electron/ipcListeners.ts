import { ipcMain, dialog, App, BrowserWindow } from 'electron';
import electronUpdater from 'electron-updater';
import os from 'os';
import { fileURLToPath } from 'url';
import path from 'path';

let browserWindow: BrowserWindow;
let app: App;

export class Listeners {
    constructor(window: BrowserWindow, electronApp: App) {
        browserWindow = window;
        app = electronApp;
    }
}

ipcMain.on('get-browser-window', () => {
    browserWindow.webContents.send('receive-browser-window', browserWindow);
});

ipcMain.on('update-app', () => {
    electronUpdater.autoUpdater.checkForUpdatesAndNotify();
});

ipcMain.on('install-via-thunderstore', (installString) => {
    browserWindow.webContents.send('install-from-thunderstore-string', installString);
});

ipcMain.handle('get-appData-directory', () => {
    return app.getPath('appData');
});

ipcMain.handle('get-is-portable',  async () => {
    let isPortable = false;
    switch (process.platform) {
        case 'win32':
            isPortable = process.execPath.startsWith(os.tmpdir());
            break;
        case 'linux':
            // The correct way to handle this should be
            // isPortable = typeof process.env.APPIMAGE !== "undefined";
            // but since Manager.vue needs a refactor, we do the opposite
            isPortable = typeof process.env.APPIMAGE === 'undefined';
            break;
    }
    return isPortable;
});

ipcMain.on('restart', () => {
    app.relaunch();
    app.exit();
});

ipcMain.on('get-assets-path', () => {
    if (process.env.PROD) {
        browserWindow.webContents.send('receive-assets-path', global.__statics);
    } else {
        browserWindow.webContents.send('receive-assets-path', 'src/statics/');
    }
});

ipcMain.handle('show-open-dialog', (event, fileOpts) => {
    return dialog.showOpenDialog(browserWindow, fileOpts);
});

ipcMain.on('get-process-platform', (event) => {
    event.returnValue = process.platform;
});

ipcMain.on('get-statics-directory', (event) => {
    const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
    const __dirname = path.dirname(__filename);
    event.returnValue = __dirname;
});
