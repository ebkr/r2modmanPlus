import { BrowserWindow, ipcMain } from 'electron';
import AdmZip from 'adm-zip';
import unzipper from 'unzipper';
import fs from 'fs';
import path from 'path';

let zipCreatorIdentifier = 0;
const zipCreatorCache = new Map<number, AdmZip>();

async function getZipDirectory(zip: string | Buffer): Promise<unzipper.CentralDirectory> {
    if (typeof zip === 'string') {
        return unzipper.Open.file(zip);
    }
    return unzipper.Open.buffer(zip);
}

export function hookZipIpc(browserWindow: BrowserWindow) {
    ipcMain.handle('zip:extractAllTo', async (event, zip: string, outputFolder: string) => {
        outputFolder = outputFolder.replace(/\\/g, '/');
        await fs.promises.mkdir(outputFolder, { recursive: true });
        const directory = await getZipDirectory(zip);
        await directory.extract({ path: outputFolder });
    });

    ipcMain.handle('zip:readFile', async (event, zip: string, fileName: string) => {
        const directory = await getZipDirectory(zip);
        const normalizedTarget = fileName.replace(/\\/g, '/').replace(/^\.?\//, '');
        const file = directory.files.find(f => f.path.replace(/\\/g, '/').replace(/^\.?\//, '') === normalizedTarget);
        if (!file) {
            return null;
        }
        const buffer = await file.buffer();
        return buffer.toString('utf8');
    });

    ipcMain.handle('zip:getEntries', async (event, zip: string) => {
        const directory = await getZipDirectory(zip);
        const entries = directory.files.map(f => ({
            entryName: f.path,
            name: path.basename(f.path),
            isDirectory: f.type === 'Directory',
        }));
        return JSON.stringify(entries);
    });

    ipcMain.handle('zip:extractEntryTo', async (event, zip: string, target: string, outputPath: string) => {
        const safeTarget = target.replace(/\\/g, '/').replace(/^\.?\//, '');
        outputPath = outputPath.replace(/\\/g, '/');
        const fullPath = path.join(outputPath, safeTarget).replace(/\\/g, '/');
        if (!path.posix.normalize(fullPath).startsWith(outputPath)) {
            throw new Error("Entry " + target + " would extract outside of expected folder");
        }
        const directory = await getZipDirectory(zip);
        const file = directory.files.find(f => f.path.replace(/\\/g, '/').replace(/^\.?\//, '') === safeTarget);
        if (!file) {
            throw new Error("Entry " + target + " not found in zip archive");
        }
        if (file.type === 'Directory') {
            await fs.promises.mkdir(fullPath, { recursive: true });
            return;
        }
        await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
        await new Promise<void>((resolve, reject) => {
            file.stream()
                .pipe(fs.createWriteStream(fullPath))
                .on('error', reject)
                .on('finish', () => resolve());
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
                zipCreatorCache.delete(identifier);
            });
        });
    });
}
