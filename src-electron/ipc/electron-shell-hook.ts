import { BrowserWindow, ipcMain } from 'electron';
import { shell } from 'electron';

export function hookElectronIpc(browserWindow: BrowserWindow) {
    ipcMain.on('electron:shell:openExternal', (event, url) => {
        shell.openExternal(url)
    });

    ipcMain.on('electron:shell:selectFile', (event, filePath) => {
        shell.showItemInFolder(filePath)
    });
}
