import { BrowserWindow, ipcMain } from 'electron';
import ChildProcess from 'child_process';

export function hookChildProcessIpc(browserWindow: BrowserWindow) {
    ipcMain.on("node:child_process:execSync", (event, path) => {
        event.returnValue = ChildProcess.execSync(path).toString();
    })

    ipcMain.on("node:child_process:exec", (event, identifier, path, options) => {
        ChildProcess.exec(path, options, err => {
            browserWindow.webContents.send(`node:child_process:exec:${identifier}`, err);
        });
    })
}
