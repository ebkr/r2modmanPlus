import { BrowserWindow, ipcMain, shell, clipboard } from 'electron';

export function hookElectronIpc(browserWindow: BrowserWindow) {
    ipcMain.on('electron:shell:openExternal', (event, url) => {
        if (typeof url === 'string') {
            try {
                const parsedUrl = new URL(url);
                if (['http:', 'https:'].includes(parsedUrl.protocol)) {
                    shell.openExternal(url);
                }
            } catch (e) {
                // Silently ignore malformed URLs
            }
        }
    });

    ipcMain.on('electron:shell:selectFile', (event, filePath) => {
        if (typeof filePath === 'string') {
            shell.showItemInFolder(filePath);
        }
    });

    ipcMain.on('electron:shell:openPath', (event, filePath) => {
        if (typeof filePath === 'string') {
            shell.openPath(filePath);
        }
    });

    ipcMain.on('electron:clipboard:copyText', (event, text) => {
        if (typeof text === 'string') {
            clipboard.writeText(text);
            event.returnValue = true;
        } else {
            event.returnValue = false;
        }
    });

    ipcMain.handle('electron:getEnvironmentVariables', (event) => {
        return JSON.stringify(process.env);
    })
}
