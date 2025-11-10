import {ipcRenderer} from "electron/renderer";

export async function getAppDataDirectory(): Promise<string> {
    return ipcRenderer.invoke('get-appData-directory');
}

export async function isApplicationPortable(): Promise<boolean> {
    return ipcRenderer.invoke('get-is-portable');
}

export function getPlatform(): string {
    return ipcRenderer.sendSync('get-process-platform');
}

export async function checkForApplicationUpdates(): Promise<void> {
    return ipcRenderer.send('update-app');
}

export function getStaticsDirectory(): string {
    return ipcRenderer.sendSync('get-statics-directory');
}

export function restart() {
    ipcRenderer.send('restart');
}

export function hookModInstallProtocol(callback: (data: any) => void) {
    ipcRenderer.removeAllListeners('install-from-thunderstore-string');
    ipcRenderer.on('install-from-thunderstore-string', (_sender: any, data: string) => {
        callback(data);
    });
}
