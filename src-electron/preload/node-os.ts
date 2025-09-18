import { ipcRenderer } from 'electron';

export function homedir() {
    return ipcRenderer.sendSync('node:os:homedir');
}
