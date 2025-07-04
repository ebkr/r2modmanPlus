import {BrowserWindow, ipcMain} from "electron";
import os from "os";

export function hookOsIpc(browserWindow: BrowserWindow) {
    ipcMain.on('node:os:homedir', (event) => {
        event.returnValue = os.homedir();
    })
}
