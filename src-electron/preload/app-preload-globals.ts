import {ipcRenderer} from "electron/renderer";

export async function getAppDataDirectory(): Promise<string> {
    return new Promise((resolve, reject) => {
        ipcRenderer.on('receive-appData-directory', (event, path) => {
            const result = path;
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
        ipcRenderer.on('receive-is-portable', (event, isPortable) => {
            console.log("Received is-portable", isPortable);
            if (isPortable instanceof Error) {
                reject(isPortable);
            } else {
                resolve(isPortable);
            }
        })
        ipcRenderer.send('get-is-portable');
    })
}
