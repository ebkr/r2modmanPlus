import { ipcRenderer } from 'electron';
import { once } from 'app/src-electron/preload/hooks-preload';

let extractAllToIdentifier = 0;
let readFileIdentifier = 0;
let getEntriesIdentifier = 0;
let extractEntryToIdentifier = 0;

export function extractAllTo(zip: string, outputFolder: string): Promise<void> {
    const identifier = extractAllToIdentifier++;
    return new Promise((resolve, reject) => {
        once(`zip:extractAllTo:${identifier}`, (result: any) => {
            if (result instanceof Error) {
                reject(result);
            } else {
                resolve(result);
            }
        });
        ipcRenderer.send(`zip:extractAllTo`, identifier, zip, outputFolder);
    });
}

export function readFile(zip: string | Buffer, file: string): Promise<string> {
    const identifier = readFileIdentifier++;
    return new Promise((resolve, reject) => {
        once(`zip:readFile:${identifier}`, (result: any) => {
            if (result instanceof Error) {
                reject(result);
            } else {
                resolve(result);
            }
        });
        ipcRenderer.send(`zip:readFile`, identifier, zip, file);
    });
}

export function getEntries(zip: string): Promise<any> {
    const identifier = getEntriesIdentifier++;
    return new Promise((resolve, reject) => {
        once(`zip:getEntries:${identifier}`, (result: any) => {
            if (result instanceof Error) {
                reject(result);
            } else {
                resolve(result);
            }
        });
        ipcRenderer.send(`zip:getEntries`, identifier, zip);
    });
}

export function extractEntryTo(zip: string | Buffer, target: string, outputPath: string): Promise<void> {
    const identifier = extractEntryToIdentifier++;
    return new Promise((resolve, reject) => {
        once(`zip:extractEntryTo:${identifier}`, (result: any) => {
            if (result instanceof Error) {
                reject(result);
            } else {
                resolve(result);
            }
        });
        ipcRenderer.send(`zip:extractEntryTo`, identifier, zip, target, outputPath);
    });
}

/**
 * Create a temporary in-memory zip.
 * @return number representing identifier for subsequent calls to modify zip.
 */
export function createNewTemporaryZip(): number {
    return ipcRenderer.sendSync(`zip:create:new`);
}

export function addBufferToTemporaryZip(identifier: number, fileName: string, content: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
        once(`zip:create:addBuffer:${identifier}`, (result: any) => {
            if (result instanceof Error) {
                reject(result);
            } else {
                resolve(result);
            }
        });
        ipcRenderer.send('zip:create:addBuffer', identifier, fileName, content);
    });
}

export function addFolderToTemporaryZip(identifier: number, zippedFolderName: string, folderNameOnDisk: string): Promise<void> {
    return new Promise((resolve, reject) => {
        once(`zip:create:addFolder:${identifier}`, (result: any) => {
            if (result instanceof Error) {
                reject(result);
            } else {
                resolve(result);
            }
        });
        ipcRenderer.send('zip:create:addFolder', identifier, zippedFolderName, folderNameOnDisk);
    });
}

export function finalizeTemporaryZip(identifier: number, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        once(`zip:create:finalize:${identifier}`, (result: any) => {
            if (result instanceof Error) {
                reject(result);
            } else {
                resolve(result);
            }
        });
        ipcRenderer.send('zip:create:finalize', identifier, outputPath);
    });
}
