import { ipcMain, BrowserWindow, dialog } from 'electron';
import { spawnSync } from 'child_process';
import { autoUpdater } from 'electron-updater';

let browserWindow;

export default class Listeners {
    constructor(window) {
        browserWindow = window;
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

ipcMain.on('install-via-thunderstore', (_sender, installString) => {
    browserWindow.webContents.send('install-from-thunderstore-string', installString);
})