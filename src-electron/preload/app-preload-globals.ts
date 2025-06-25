import {ipcRenderer} from "electron/renderer";

export async function getAppDataDirectory(): Promise<string> {
    return new Promise((resolve, reject) => {
        ipcRenderer.on('receive-appData-directory', (event, args) => {
            const result = args[0];
            if (result instanceof Error) {
                reject(result);
            } else {
                resolve(result);
            }
        });
        ipcRenderer.send('get-appData-directory');
    });
}

export async function isApplicationPortable(): Promise<boolean> {
    console.log("Checking is portable")
    return new Promise((resolve, reject) => {
        ipcRenderer.on('receive-is-portable', (event, args) => {
            console.log("Received is-portable", args);
            const result = args[0];
            if (result instanceof Error) {
                reject(result);
            } else {
                resolve(result);
            }
        })
        ipcRenderer.send('get-is-portable');
    })
}
