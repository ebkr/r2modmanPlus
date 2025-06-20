import { contextBridge } from 'electron';
import * as path from "./node-path";
import { providePathImplementation } from 'src/providers/node/path/path';
import { NodePathImplementation } from 'src/providers/node/path/NodePathImplementation';

const api = {
    path: path
}

contextBridge.exposeInMainWorld('node', api)

providePathImplementation(() => NodePathImplementation);

console.log("Preloader called");
