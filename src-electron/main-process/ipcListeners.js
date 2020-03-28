import { ipcMain, BrowserWindow, dialog } from 'electron';
import { spawnSync } from 'child_process';
import { autoUpdater } from 'electron-updater';
import os from 'os';

let browserWindow;
let app;

export default class Listeners {
    constructor(window, electronApp) {
        browserWindow = window;
        app = electronApp;
    }
}

ipcMain.on('open-link', (_sender, link) => {
    spawnSync('powershell.exe', [`start ${link}`]);
})

ipcMain.on('get-browser-window', ()=>{
    browserWindow.webContents.send('receive-browser-window', browserWindow);
})

ipcMain.on('open-dialog', (_sender, dialogOptions) => {
    dialog.showOpenDialog(dialogOptions, (filePaths) => {
        browserWindow.webContents.send('receive-selection', filePaths);
    })
})

ipcMain.on('update-app', ()=>{
    autoUpdater.checkForUpdatesAndNotify();
    browserWindow.webContents.send('update-done');
})

ipcMain.on('install-via-thunderstore', (installString) => {
    browserWindow.webContents.send('install-from-thunderstore-string', installString);
})

ipcMain.on('get-appData-directory', ()=>{
    browserWindow.webContents.send('receive-appData-directory', app.getPath('appData'));
})

ipcMain.on('get-is-portable', ()=>{
    browserWindow.webContents.send('receive-is-portable', process.execPath.startsWith(os.tmpdir()));
})

ipcMain.on('get-assets-path', ()=>{
    if (process.env.PROD) {
        browserWindow.webContents.send('receive-assets-path', global.__statics);
    } else {
        browserWindow.webContents.send('receive-assets-path', 'src/statics/');
    }
})


