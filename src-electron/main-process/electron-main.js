import { app, BrowserWindow } from 'electron'
import Listeners from './ipcListeners'
import { ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import ipcServer from 'node-ipc';

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
    if (process.env.PROD) {
        mainWindow.setMenu(null);
    }

    // Initialise client to server communication listener
    new Listeners(mainWindow);

    mainWindow.loadURL(process.env.APP_URL)

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', ()=>{
    createWindow();
    let reqLockSuccess = app.requestSingleInstanceLock();
    if (!reqLockSuccess) {
        // If this isn't the single instance,
        // connect to r2mm IPC and send the install parameter.
        ipcServer.connectTo('r2mm', ()=>{
            for (let i=0; i<process.argv.length; i++) {
                if (process.argv[i].toLowerCase().search('ror2mm://') >= 0) {
                    ipcServer.of.r2mm.emit('install', process.argv[i]);
                    break;
                }
            }
            app.quit();
        });
    } else {
        ipcServer.config.id = 'r2mm';
        ipcServer.serve(
            '/tmp/app.r2mm',
            () => {
                ipcServer.server.on('install', (res)=>{
                    ipcMain.emit('install-via-thunderstore', res);
                })
            }
        );
        ipcServer.server.start();
    }
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

// Register current application with Thunderstore Protocol
app.setAsDefaultProtocolClient('ror2mm', process.execPath);