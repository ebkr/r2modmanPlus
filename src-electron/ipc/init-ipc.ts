import { BrowserWindow } from 'electron';
import { hookPathIpc } from './node-path-impl';
import { hookChildProcessIpc } from './node-child-process-impl';
import { hookFsIpc } from './node-fs-impl';
import { hookZipIpc } from './zip-hook';
import { hookElectronIpc } from './electron-hook';
import {hookOsIpc} from "./node-os-impl";

export function hookIpc(browserWindow: BrowserWindow) {
    hookPathIpc(browserWindow);
    hookChildProcessIpc(browserWindow);
    hookFsIpc(browserWindow);
    hookOsIpc(browserWindow);
    hookZipIpc(browserWindow);
    hookElectronIpc(browserWindow);
}
