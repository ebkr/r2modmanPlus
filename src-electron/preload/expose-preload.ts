import { contextBridge, ipcRenderer } from 'electron';
import * as hooks from "./hooks-preload";
import * as path from './node-path';
import * as child_process from './node-child-process';
import * as fs from './node-fs';
import * as buffer from './node-buffer';
import * as appGlobals from "./app-preload-globals";

contextBridge.exposeInMainWorld('node', {
    path: path,
    child_process: child_process,
    fs: fs,
    buffer: buffer,
});

contextBridge.exposeInMainWorld('hooks', hooks);
contextBridge.exposeInMainWorld('app', appGlobals);
