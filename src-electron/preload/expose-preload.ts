import { contextBridge } from 'electron';
import * as path from './node-path';
import * as child_process from './node-child-process';
import * as fs from './node-fs';
import { ipcRenderer } from 'electron/renderer';

const api = {
    path: path,
    child_process: child_process,
    fs: fs
}

contextBridge.exposeInMainWorld('node', api)
contextBridge.exposeInMainWorld('hooks', {
    once: (hookName: string, callback: Function) => {
        ipcRenderer.once(hookName, (event, ...args) => callback(...args));
    }
})
