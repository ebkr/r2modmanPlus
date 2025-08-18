import { ipcRenderer } from 'electron/renderer';

export function execSync(identifier: string, path: string, options: any) {
    return ipcRenderer.sendSync('node:child_process:execSync', identifier, path, options);
}

export function exec(path: string, options: any) {
    return ipcRenderer.invoke('node:child_process:exec', path, options);
}
