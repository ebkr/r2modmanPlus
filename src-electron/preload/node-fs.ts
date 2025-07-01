import { ipcRenderer } from 'electron/renderer';
import { once } from "./hooks-preload";

let writeFileIdentifier = 0;
let readFileIdentifier = 0;
let readdirIdentifier = 0;
let rmdirIdentifier = 0;
let mkdirsIdentifier = 0;
let existsIdentifier = 0;
let unlinkIdentifier = 0;
let statIdentifier = 0;
let lstatIdentifier = 0;
let realpathIdentifier = 0;
let renameIdentifier = 0;
let chmodIdentifier = 0;
let copyFileIdentifier = 0;
let copyFolderIdentifier = 0;
let base64FromZipIdentifier = 0;
let setModifiedTimeIdentifier = 0;

export async function writeFile(path: string, content: string | Buffer): Promise<any> {
    const identifier = writeFileIdentifier++;
    return new Promise((resolve, reject) => {
        once(`node:fs:writeFile:${identifier}`, (e?: Error) => {
            if (e) {
                reject(e);
            } else {
                resolve(undefined);
            }
        });
        ipcRenderer.send('node:fs:writeFile', identifier, path, content);
    })
}

export async function readFile(path: string) {
    const identifier = readFileIdentifier++;
    return new Promise((resolve, reject) => {
        once(`node:fs:readFile:${identifier}`, (result: any) => {
            if (result instanceof Error) {
                reject(result);
            } else {
                resolve(result);
            }
        });
        ipcRenderer.send('node:fs:readFile', identifier, path);
    })
}

export async function readdir(path: string): Promise<string[]> {
    const identifier = readdirIdentifier++;
    return new Promise(async (resolve, reject) => {
        once(`node:fs:readdir:${identifier}`, (result: any) => {
            if (result instanceof Error) {
                reject(result);
            } else {
                resolve(result);
            }
        });
        return ipcRenderer.send('node:fs:readdir', identifier, path);
    });
}

export async function rmdir(path: string) {
    const identifier = rmdirIdentifier++;
    return ipcRenderer.send('node:fs:rmdir', identifier, path);
}

export async function mkdirs(path: string) {
    const identifier = mkdirsIdentifier++;
    return ipcRenderer.send('node:fs:mkdirs', identifier, path);
}

export async function exists(path: string) {
    const identifier = existsIdentifier++;
    return new Promise(async (resolve, reject) => {
        once(`node:fs:exists:${identifier}`, (result: any) => {
            if (result instanceof Error) {
                reject(result);
            } else {
                resolve(result);
            }
        });
        return ipcRenderer.send('node:fs:exists', identifier, path);
    });
}

export async function unlink(path: string) {
    const identifier = unlinkIdentifier++;
    return ipcRenderer.send('node:fs:unlink', identifier, path);
}

export async function stat(path: string) {
    const identifier = statIdentifier++;
    return new Promise(async (resolve, reject) => {
        once(`node:fs:stat:${identifier}`, (result: any) => {
            if (result instanceof Error) {
                reject(result);
            } else {
                resolve(result);
            }
        });
        return ipcRenderer.send('node:fs:stat', identifier, path);
    });
}

export async function lstat(path: string) {
    const identifier = lstatIdentifier++;
    return ipcRenderer.send('node:fs:lstat', identifier, path);
}

export async function realpath(path: string) {
    const identifier = realpathIdentifier++;
    return ipcRenderer.send('node:fs:realpath', identifier, path);
}

export async function rename(path: string, newPath: string) {
    const identifier = renameIdentifier++;
    return ipcRenderer.send('node:fs:rename', identifier, path, newPath);
}

export async function chmod(path: string, mode: string | number) {
    const identifier = chmodIdentifier++;
    return ipcRenderer.send('node:fs:chmod', identifier, path, mode);
}

export async function copyFile(from: string, to: string) {
    const identifier = copyFileIdentifier++;
    return ipcRenderer.send('node:fs:copyFile', identifier, from, to);
}

export async function copyFolder(from: string, to: string) {
    const identifier = copyFolderIdentifier++;
    return ipcRenderer.send('node:fs:copyFolder', identifier, from, to);
}

export async function base64FromZip(path: string) {
    const identifier = base64FromZipIdentifier++;
    return ipcRenderer.send('node:fs:base64FromZip', identifier, path);
}

export async function setModifiedTime(path: string, time: Date) {
    const identifier = setModifiedTimeIdentifier++;
    return ipcRenderer.send('node:fs:setModifiedTime', identifier, path, time);
}
