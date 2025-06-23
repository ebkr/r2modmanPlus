import { ipcRenderer } from 'electron/renderer';

export function join(...paths: string[]) {
    return ipcRenderer.sendSync('node:path:join', ...paths);
}
