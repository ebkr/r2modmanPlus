import {ipcRenderer} from "electron/renderer";
import { SQLInputValue } from 'node:sqlite';

export function open(name: string) {
    return ipcRenderer.sendSync('db:open', name);
}

export async function query(dbId: string, query: string, ...args: SQLInputValue[]) {
    return JSON.parse(await ipcRenderer.invoke('db:query', dbId, query, ...args));
}

export async function beginTransaction(dbId: string): Promise<string> {
    return ipcRenderer.invoke('db:transaction:begin', dbId);
}

export async function nextStatement(txId: string, q: string, ...args: any[]): Promise<void> {
    return ipcRenderer.invoke('db:transaction:next', txId, q, ...args);
}

export async function commitTransaction(txId: string): Promise<void> {
    return ipcRenderer.invoke('db:transaction:commit', txId);
}
