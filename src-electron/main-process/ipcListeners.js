import { ipcMain, dialog } from 'electron';
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

ipcMain.on('get-browser-window', ()=>{
    browserWindow.webContents.send('receive-browser-window', browserWindow);
})

ipcMain.on('open-dialog', (_sender, dialogOptions) => {
    dialog.showOpenDialog(dialogOptions).then(result => {
        browserWindow.webContents.send('receive-selection', result.filePaths);
    })
})

ipcMain.on('update-app', ()=>{
    if (!process.execPath.startsWith(os.tmpdir())) {
        autoUpdater.autoDownload = true;
        autoUpdater.checkForUpdatesAndNotify();
        browserWindow.webContents.send('update-done');
    } else {
        browserWindow.webContents.send('update-done');
    }
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

ipcMain.on('restart', ()=>{
    app.relaunch();
    app.exit();
})

ipcMain.on('get-assets-path', ()=>{
    if (process.env.PROD) {
        browserWindow.webContents.send('receive-assets-path', global.__statics);
    } else {
        browserWindow.webContents.send('receive-assets-path', 'src/statics/');
    }
})


