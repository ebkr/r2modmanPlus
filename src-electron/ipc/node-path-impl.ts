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
    ipcMain.on("node:path:extname", (event, pathAsString: string) => {
        event.returnValue = path.extname(pathAsString);
    });
    ipcMain.on("node:path:relative", (event, pathOne: string, pathTwo: string) => {
        event.returnValue = path.relative(pathOne, pathTwo);
    });
    ipcMain.on("node:path:dirname", (event, pathAsString: string) => {
        event.returnValue = path.dirname(pathAsString);
    });
    ipcMain.on("node:path:sep", (event) => {
        event.returnValue = path.sep;
    })
}
