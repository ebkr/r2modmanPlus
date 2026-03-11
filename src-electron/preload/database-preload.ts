import {ipcRenderer} from "electron/renderer";
import { SQLInputValue } from 'node:sqlite';

export function open(name: string) {
    return ipcRenderer.sendSync('db:open', name);
}

export async function query(dbId: string, query: string, ...args: SQLInputValue[]) {
    return JSON.parse(await ipcRenderer.invoke('db:query', dbId, query, ...args));
}
