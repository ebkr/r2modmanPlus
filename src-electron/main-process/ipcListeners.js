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
});

ipcMain.on('update-app', ()=>{
    if (typeof process.env.APPIMAGE !== "undefined" || !process.execPath.startsWith(os.tmpdir())) {
        autoUpdater.autoDownload = true;
        autoUpdater.checkForUpdatesAndNotify();
        browserWindow.webContents.send('update-done');
    } else {
        browserWindow.webContents.send('update-done');
    }
});

ipcMain.on('install-via-thunderstore', (installString) => {
    browserWindow.webContents.send('install-from-thunderstore-string', installString);
});

ipcMain.on('get-appData-directory', ()=>{
    browserWindow.webContents.send('receive-appData-directory', app.getPath('appData'));
});

ipcMain.on('window-minimize', () => {
    browserWindow.minimize();
})
ipcMain.on('window-maximize', () => {
    if(browserWindow.isMaximized())
        browserWindow.unmaximize();
    else
        browserWindow.maximize();
})
ipcMain.on('window-close', () => {
    browserWindow.close();
})

ipcMain.on('get-is-portable', ()=>{
    let isPortable = false;
    switch(process.platform){
        case "win32":
            isPortable = process.execPath.startsWith(os.tmpdir());
            break;
        case "linux":
            // The correct way to handle this should be
            // isPortable = typeof process.env.APPIMAGE !== "undefined";
            // but since Manager.vue needs a refactor, we do the opposite
            isPortable = typeof process.env.APPIMAGE === "undefined";
            break;
    }
    browserWindow.webContents.send('receive-is-portable', isPortable);
});

ipcMain.on('restart', ()=>{
    app.relaunch();
    app.exit();
});

ipcMain.on('get-assets-path', ()=>{
    if (process.env.PROD) {
        browserWindow.webContents.send('receive-assets-path', global.__statics);
    } else {
        browserWindow.webContents.send('receive-assets-path', 'src/statics/');
    }
});

ipcMain.on('show-open-dialog', (arg, fileOpts) => {
  dialog.showOpenDialog(browserWindow, fileOpts).then(r => {
    browserWindow.webContents.send('receive-open-dialog', r);
  });
});
