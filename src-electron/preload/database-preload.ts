import {ipcRenderer} from "electron/renderer";

export function open(name: string) {
    return ipcRenderer.sendSync('db:open', name);
}
