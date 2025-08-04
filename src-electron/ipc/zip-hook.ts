import { BrowserWindow, ipcMain } from 'electron';
import AdmZip from 'adm-zip';
import path from 'path';

let zipCreatorIdentifier = 0;
const zipCreatorCache = new Map<number, AdmZip>();

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
            browserWindow.webContents.send(`zip:getEntries:${identifier}`, JSON.stringify(entries));
        } catch (e) {
            browserWindow.webContents.send(`zip:getEntries:${identifier}`, e);
        }
    });

    ipcMain.on('zip:extractEntryTo', (event, identifier, zip: string, target: string, outputPath: string) => {
        try {
            const adm = new AdmZip(zip);
            const safeTarget = target.replace(/\\/g, '/');
            outputPath = outputPath.replace(/\\/g, '/');
            var fullPath = path.join(outputPath, safeTarget).replace(/\\/g, '/');
            if(!path.posix.normalize(fullPath).startsWith(outputPath))
            {
                throw Error("Entry " + target + " would extract outside of expected folder");
            }
            adm.extractEntryTo(target, outputPath, true, true);
            browserWindow.webContents.send(`zip:extractEntryTo:${identifier}`);
        } catch (e) {
            browserWindow.webContents.send(`zip:extractEntryTo:${identifier}`, e);
        }
    });

    ipcMain.on('zip:create:new', (event) => {
        const identifier = zipCreatorIdentifier++;
        zipCreatorCache.set(identifier, new AdmZip());
        event.returnValue = identifier;
    });

    ipcMain.on(`zip:create:addBuffer`, (event, identifier, fileName: string, data: Buffer) => {
        const zip = zipCreatorCache.get(identifier)!;
        zip.addFile(fileName, data);
        browserWindow.webContents.send(`zip:create:addBuffer:${identifier}`);
    });

    ipcMain.on(`zip:create:addFolder`, (event, identifier, zippedFolderName: string, folderNameOnDisk: string) => {
        const zip = zipCreatorCache.get(identifier)!;
        zip.addLocalFolder(folderNameOnDisk, zippedFolderName);
        browserWindow.webContents.send(`zip:create:addFolder:${identifier}`);
    });

    ipcMain.on(`zip:create:finalize`, (event, identifier, outputPath: string) => {
        const zip = zipCreatorCache.get(identifier)!;
        zip.writeZip(outputPath, err => {
            browserWindow.webContents.send(`zip:create:finalize:${identifier}`);
        });
    });
}
