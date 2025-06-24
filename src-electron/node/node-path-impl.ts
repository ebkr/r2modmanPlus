import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';

export function hookPathIpc(browserWindow: BrowserWindow) {
    ipcMain.on("node:path:join", (event, ...args) => {
        event.returnValue = path.join(...args);
    });
}
