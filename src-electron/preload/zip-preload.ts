import { ipcRenderer } from 'electron';
import { once } from 'app/src-electron/preload/hooks-preload';

let extractAllToIdentifier = 0;
let readFileIdentifier = 0;
let getEntriesIdentifier = 0;

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
