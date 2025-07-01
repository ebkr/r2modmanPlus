import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';

export function hookPathIpc(browserWindow: BrowserWindow) {
    ipcMain.on("node:path:join", (event, ...args) => {
        event.returnValue = path.join(...args);
    });
    ipcMain.on("node:path:basename", (event, toResolve) => {
        event.returnValue = path.basename(toResolve);
    });
    ipcMain.on("node:path:resolve", (event, ...args) => {
        event.returnValue = path.resolve(...args);
    });
}
