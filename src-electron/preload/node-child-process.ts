import { ipcRenderer } from 'electron/renderer';

export function execSync(path: string) {
    return ipcRenderer.sendSync('node:child_process:execSync', path);
}
