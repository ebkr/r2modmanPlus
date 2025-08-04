import { BrowserWindow, ipcMain, shell, clipboard } from 'electron';

export function hookElectronIpc(browserWindow: BrowserWindow) {
    ipcMain.on('electron:shell:openExternal', (event, url) => {
        shell.openExternal(url)
    });

    ipcMain.on('electron:shell:selectFile', (event, filePath) => {
        shell.showItemInFolder(filePath)
    });

    ipcMain.on('electron:shell:openPath', (event, filePath) => {
        shell.openPath(filePath)
    });

    ipcMain.on('electron:clipboard:copyText', (event, text) => {
        clipboard.writeText(text);
        event.returnValue = true;
    });
}
