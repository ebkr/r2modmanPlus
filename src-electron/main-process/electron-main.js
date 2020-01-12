import { app, BrowserWindow } from 'electron'
import Listeners from './ipcListeners'
import { ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
    global.__statics = require('path').join(__dirname, 'statics').replace(/\\/g, '\\\\')
}

let mainWindow;

function createWindow () {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 700,
        useContentSize: true,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        }
    })

    // Initialise client to server communication listener
    new Listeners(mainWindow);

    mainWindow.loadURL(process.env.APP_URL)

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', ()=>{
    createWindow();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

//-----------------------------//

ipcMain.on('log', (_, log) => {
    console.log(...log);
});