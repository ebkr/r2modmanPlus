import { ipcRenderer } from 'electron/renderer';
import { NodePathImplementation } from '../../src/providers/node/path/NodePathImplementation';

export const defaultImplementation = NodePathImplementation;

export function join(...paths: string[]) {
    return ipcRenderer.sendSync('node:path:join', ...paths);
}
