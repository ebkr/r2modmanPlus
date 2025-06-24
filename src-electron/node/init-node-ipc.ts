import { hookPathIpc } from './node-path-impl';
import { hookChildProcessIpc } from './node-child-process-impl';
import { BrowserWindow } from 'electron';

export function hookIpc(browserWindow: BrowserWindow) {
    hookPathIpc(browserWindow);
    hookChildProcessIpc(browserWindow);
}
