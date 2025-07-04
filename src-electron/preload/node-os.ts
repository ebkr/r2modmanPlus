import {ipcRenderer} from "electron";

export function homedir() {
    const result = ipcRenderer.sendSync('node:os:homedir');
    console.log("Homedir:", result);
    return result;
}
