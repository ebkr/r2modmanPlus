import { ipcRenderer } from 'electron/renderer';

export function join(...paths: string[]) {
    return ipcRenderer.sendSync('node:path:join', ...paths);
}

export function basename(path: string) {
    return ipcRenderer.sendSync('node:path:basename', path);
}

export function resolve(...paths: string[]) {
    return ipcRenderer.sendSync('node:path:resolve', ...paths);
}
