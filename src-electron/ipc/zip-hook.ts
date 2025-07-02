import { BrowserWindow, ipcMain } from 'electron';
import AdmZip from 'adm-zip';

export function hookZipIpc(browserWindow: BrowserWindow) {
    ipcMain.on('zip:extractAllTo', (event, identifier, zip: string, outputFolder: string) => {
        const adm = new AdmZip(zip);
        outputFolder = outputFolder.replace(/\\/g, '/');
        adm.extractAllToAsync(outputFolder, true, error => {
            browserWindow.webContents.send(`zip:extractAllTo:${identifier}`, error);
        });
    });

    ipcMain.on('zip:readFile', (event, identifier, zip: string, fileName: string) => {
        const adm = new AdmZip(zip);
        return adm.readFileAsync(fileName, (data, err) => {
            if (err) {
                browserWindow.webContents.send(`zip:readFile:${identifier}`, err);
            } else {
                browserWindow.webContents.send(`zip:readFile:${identifier}`, data?.toString('utf8'));
            }
        });
    });

    ipcMain.on('zip:getEntries', (event, identifier, zip: string) => {
        const adm = new AdmZip(zip);
        try {
            const entries = adm.getEntries();
            browserWindow.webContents.send(`zip:getEntries:${identifier}`, entries);
        } catch (e) {
            browserWindow.webContents.send(`zip:getEntries:${identifier}`, e);
        }
    });
}
