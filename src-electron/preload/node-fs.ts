import { ipcRenderer } from 'electron/renderer';

export async function downloadFile(url: string, targetPath: string, onProgress?: (loaded: number) => void): Promise<void> {
    const downloadId = Math.random().toString(36).substring(2);
    const progressChannel = `download:progress:${downloadId}`;
    if (onProgress) {
        ipcRenderer.on(progressChannel, (_event, loaded: number) => {
            onProgress(loaded);
        });
    }
    try {
        await ipcRenderer.invoke('node:fs:downloadFile', downloadId, url, targetPath);
    } finally {
        ipcRenderer.removeAllListeners(progressChannel);
    }
}

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

export async function emptyDirectory(directory: string) {
    return ipcRenderer.invoke('node:fs:emptyDirectory', directory);
}

export async function removeDirectoryRecursively(directory: string) {
    return ipcRenderer.invoke('node:fs:removeDirectoryRecursively', directory);
}
