import { ipcMain } from 'electron';
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
