import { contextBridge } from 'electron';
import * as path from './node-path';
import * as child_process from './node-child-process';
import * as fs from './node-fs';
import * as buffer from './node-buffer';
import * as os from './node-os';
import * as zip from './zip-preload';
import * as appGlobals from "./app-preload-globals";
import * as electron from "./electron-ipc-preload";

contextBridge.exposeInMainWorld('node', {
    path: path,
    child_process: child_process,
    fs: fs,
    buffer: buffer,
    os: os,
});

contextBridge.exposeInMainWorld('app', appGlobals);
contextBridge.exposeInMainWorld('zip', zip);
contextBridge.exposeInMainWorld('electron', electron);
