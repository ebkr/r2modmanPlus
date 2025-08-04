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
    return new Promise(resolve => {
        const fileOpts = options as unknown as OpenDialogOptions;
        fileOpts.properties = ['openDirectory', 'showHiddenFiles'];

        ipcRenderer.once('receive-open-dialog', (_, args) => {
            resolve(args.filePaths);
        });
        ipcRenderer.send('show-open-dialog', fileOpts);
    });
}

export async function selectFileDialog(options: any) {
    return new Promise(resolve => {
        const fileOpts = options as unknown as OpenDialogOptions;
        fileOpts.properties = ['openFile', 'showHiddenFiles'];

        ipcRenderer.once('receive-open-dialog', (_, args) => {
            resolve(args.filePaths);
        });
        ipcRenderer.send('show-open-dialog', fileOpts);
    });
}

export function copyToClipboard(value: string) {
    ipcRenderer.sendSync('electron:clipboard:copyText', value);
}
