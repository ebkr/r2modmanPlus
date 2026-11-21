import { BrowserWindow } from 'electron';
import { hookPathIpc } from './node-path-impl';
import { hookChildProcessIpc } from './node-child-process-impl';
import { hookFsIpc } from 'app/src-electron/ipc/node-fs-impl';
import { hookNetIpc } from 'app/src-electron/ipc/node-net-impl';
import { hookZipIpc } from 'app/src-electron/ipc/zip-hook';
import { hookElectronIpc } from 'app/src-electron/ipc/electron-hook';
import {hookOsIpc} from "app/src-electron/ipc/node-os-impl";

export function hookIpc(browserWindow: BrowserWindow) {
    hookPathIpc(browserWindow);
    hookChildProcessIpc(browserWindow);
    hookFsIpc(browserWindow);
    hookNetIpc(browserWindow);
    hookOsIpc(browserWindow);
    hookZipIpc(browserWindow);
    hookElectronIpc(browserWindow);
}
