import { ipcMain } from 'electron';
import path from 'path';

ipcMain.on("node:path:join", (event, args) => {
    event.returnValue = path.join(...args);
})
