import { BrowserWindow, ipcMain } from 'electron';
import AdmZip from 'adm-zip';
import path from 'path';

let zipCreatorIdentifier = 0;
const zipCreatorCache = new Map<number, AdmZip>();

export function hookZipIpc(browserWindow: BrowserWindow) {
    ipcMain.handle('zip:extractAllTo', (event, zip: string, outputFolder: string) => {
        return new Promise((resolve, reject) => {
            const adm = new AdmZip(zip);
            outputFolder = outputFolder.replace(/\\/g, '/');
            adm.extractAllToAsync(outputFolder, true, true, error => {
                if (error) {
                    reject(error);
                } else {
                    resolve(error);
                }
            });
        });
    });

    ipcMain.handle('zip:readFile', (event, zip: string, fileName: string) => {
        return new Promise((resolve, reject) => {
            const adm = new AdmZip(zip);
            return adm.readFileAsync(fileName, (data, err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data?.toString('utf8'));
                }
            });
        });
    });

    ipcMain.handle('zip:getEntries', (event, zip: string) => {
        return new Promise((resolve, reject) => {
            const adm = new AdmZip(zip);
            try {
                const entries = adm.getEntries();
                resolve(JSON.stringify(entries));
            } catch (e) {
                reject(e);
            }
        });
    });

    ipcMain.handle('zip:extractEntryTo', (event, zip: string, target: string, outputPath: string) => {
        return new Promise((resolve, reject) => {
            try {
                const adm = new AdmZip(zip);
                const safeTarget = target.replace(/\\/g, '/');
                outputPath = outputPath.replace(/\\/g, '/');
                var fullPath = path.join(outputPath, safeTarget).replace(/\\/g, '/');
                if(!path.posix.normalize(fullPath).startsWith(outputPath))
                {
                    throw new Error("Entry " + target + " would extract outside of expected folder");
                }
                adm.extractEntryTo(target, outputPath, true, true, true);
                return resolve(undefined);
            } catch (e) {
                reject(e);
            }
        });
    });

    ipcMain.on('zip:create:new', (event) => {
        const identifier = zipCreatorIdentifier++;
        zipCreatorCache.set(identifier, new AdmZip());
        event.returnValue = identifier;
    });

    ipcMain.handle(`zip:create:addBuffer`, async (event, identifier, fileName: string, data: Buffer) => {
        const zip = zipCreatorCache.get(identifier);
        if (zip === undefined) {
            throw new Error(`No zip was present in temporary creator with identifier: ${identifier}`);
        }
        zip.addFile(fileName, data);
    });

    ipcMain.handle(`zip:create:addFolder`, async (event, identifier, zippedFolderName: string, folderNameOnDisk: string) => {
        const zip = zipCreatorCache.get(identifier);
        if (zip === undefined) {
            throw new Error(`No zip was present in temporary creator with identifier: ${identifier}`);
        }
        zip.addLocalFolder(folderNameOnDisk, zippedFolderName);
    });

    ipcMain.handle(`zip:create:finalize`, (event, identifier, outputPath: string) => {
        return new Promise((resolve, reject) => {
            const zip = zipCreatorCache.get(identifier);
            if (zip === undefined) {
                throw new Error(`No zip was present in temporary creator with identifier: ${identifier}`);
            }
            zip.writeZip(outputPath, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve(undefined);
                }
            });
        });
    });
}
