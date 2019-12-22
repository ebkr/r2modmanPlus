import { ipcMain } from 'electron';

let browserWindow;
let thunderstoreModList = [];

export default class ServerStorage {
    constructor(window) {
        browserWindow = window;
    }
}


ipcMain.on('saveThunderstoreModList', (sender, data)=>{
    thunderstoreModList = data;
})

ipcMain.on('getThunderstoreModList', ()=>{
    browserWindow.webContents.send('receiveThunderstoreModList', thunderstoreModList);
})
