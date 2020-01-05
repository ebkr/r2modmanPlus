import { ipcMain, BrowserWindow, dialog } from 'electron';
import { spawnSync } from 'child_process';

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

ipcMain.on('open-folder-dialog', (_sender, dialogOptions) => {
    dialog.showOpenDialog(dialogOptions, (filePaths) => {
        browserWindow.webContents.send('receive-folder-selection', filePaths);
    })
})