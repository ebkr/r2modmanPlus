import { ipcRenderer } from 'electron';

export function once(hookName: string, callback: Function) {
    ipcRenderer.once(hookName, (event, ...args) => callback(...args));
}
