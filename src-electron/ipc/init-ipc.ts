import { BrowserWindow } from 'electron';
import { hookPathIpc } from './node-path-impl';
import { hookChildProcessIpc } from './node-child-process-impl';
import { hookFsIpc } from 'app/src-electron/ipc/node-fs-impl';
import { hookZipIpc } from 'app/src-electron/ipc/zip-hook';
import { hookElectronIpc } from 'app/src-electron/ipc/electron-shell-hook';

export function hookIpc(browserWindow: BrowserWindow) {
    hookPathIpc(browserWindow);
    hookChildProcessIpc(browserWindow);
    hookFsIpc(browserWindow);
    hookZipIpc(browserWindow);
    hookElectronIpc(browserWindow);
}
