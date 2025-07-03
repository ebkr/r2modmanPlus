import { ipcRenderer } from 'electron';

export function openExternal(url: string) {
    ipcRenderer.send('electron:shell:openExternal', url);
}

export function selectFile(url: string) {
    ipcRenderer.send('electron:shell:selectFile', url);
}

export function openPath(url: string) {
    ipcRenderer.send('electron:shell:openPath', url);
}
