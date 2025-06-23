import { contextBridge } from 'electron';
import * as path from "./node-path";

const api = {
    path: path
}

contextBridge.exposeInMainWorld('node', api)
contextBridge.exposeInMainWorld('test', {
    hello: 'world'
});
