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

export function extname(...args: string[]) {
    return ipcRenderer.sendSync('node:path:extname', ...args)
}

export function relative(...args: string[]) {
    return ipcRenderer.sendSync('node:path:relative', ...args)
}

export function dirname(...args: string[]) {
    return ipcRenderer.sendSync('node:path:dirname', ...args)
}

export function sep() {
    return ipcRenderer.sendSync('node:path:sep')
}
