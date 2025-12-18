import { ipcRenderer, OpenDialogOptions } from 'electron';

export function openExternal(url: string) {
    ipcRenderer.send('electron:shell:openExternal', url);
}

export function selectFile(url: string) {
    ipcRenderer.send('electron:shell:selectFile', url);
}

export function openPath(url: string) {
    ipcRenderer.send('electron:shell:openPath', url);
}
export async function selectFolderDialog(options: any) {
    const fileOpts = options as unknown as OpenDialogOptions;
    fileOpts.properties = ['openDirectory', 'showHiddenFiles'];

    return ipcRenderer.invoke('show-open-dialog', options)
        .then(result => result.filePaths);
}

export async function selectFileDialog(options: any) {
    const fileOpts = options as unknown as OpenDialogOptions;
    fileOpts.properties = ['openFile', 'showHiddenFiles'];

    return ipcRenderer.invoke('show-open-dialog', options)
        .then(result => result.filePaths);
}

export function copyToClipboard(value: string) {
    ipcRenderer.sendSync('electron:clipboard:copyText', value);
}

export function getEnvironmentVariables() {
    return ipcRenderer.invoke('electron:getEnvironmentVariables');
}
