import { ipcRenderer } from 'electron/renderer';

export async function writeFile(path: string, content: string | Buffer): Promise<any> {
    return ipcRenderer.invoke('node:fs:writeFile', path, content);
}

export async function readFile(path: string) {
    return ipcRenderer.invoke('node:fs:readFile', path);
}

export async function readdir(path: string): Promise<string[]> {
    return ipcRenderer.invoke('node:fs:readdir', path);
}

export async function rmdir(path: string) {
    return ipcRenderer.invoke('node:fs:rmdir', path);
}

export async function mkdirs(path: string) {
    return ipcRenderer.invoke('node:fs:mkdirs', path);
}

export async function exists(path: string) {
    return ipcRenderer.invoke('node:fs:exists', path);
}

export async function unlink(path: string) {
    return ipcRenderer.invoke('node:fs:unlink', path);
}

export async function stat(path: string) {
    return ipcRenderer.invoke('node:fs:stat', path);
}

export async function lstat(path: string) {
    return ipcRenderer.invoke('node:fs:lstat', path);
}

export async function realpath(path: string) {
    return ipcRenderer.invoke('node:fs:realpath', path);
}

export async function rename(path: string, newPath: string) {
    return ipcRenderer.invoke('node:fs:rename', path, newPath);
}

export async function chmod(path: string, mode: string | number) {
    return ipcRenderer.invoke('node:fs:chmod', path, mode);
}

export async function copyFile(from: string, to: string) {
    return ipcRenderer.invoke('node:fs:copyFile', from, to);
}

export async function copyFolder(from: string, to: string) {
    return ipcRenderer.invoke('node:fs:copyFolder', from, to);
}

export async function base64FromZip(path: string) {
    return ipcRenderer.invoke('node:fs:base64FromZip', path);
}

export async function setModifiedTime(path: string, time: Date) {
    return ipcRenderer.invoke('node:fs:setModifiedTime', path, time);
}
