import { BrowserWindow, ipcMain } from 'electron';
import ChildProcess from 'child_process';

export function hookChildProcessIpc(browserWindow: BrowserWindow) {
    ipcMain.on("node:child_process:execSync", (event, path) => {
        event.returnValue = ChildProcess.execSync(path).toString();
    })

    ipcMain.handle("node:child_process:exec", (event, path, options) => {
        return new Promise(resolve => {
            ChildProcess.exec(path, options, err => {
                resolve(err);
            });
        })
    })
}
