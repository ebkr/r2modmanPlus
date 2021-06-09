import { ipcMain, dialog, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import os from 'os';
import path from 'path';
import crypto from "crypto";
import axios from 'axios';

let browserWindow;
let app;

export default class Listeners {
    constructor(window, electronApp) {
        browserWindow = window;
        app = electronApp;
    }
}

ipcMain.on('get-browser-window', ()=>{
    browserWindow.webContents.send('receive-browser-window', browserWindow);
});

ipcMain.on('update-app', ()=>{
    if (typeof process.env.APPIMAGE !== "undefined" || !process.execPath.startsWith(os.tmpdir())) {
        autoUpdater.autoDownload = true;
        autoUpdater.checkForUpdatesAndNotify();
        browserWindow.webContents.send('update-done');
    } else {
        browserWindow.webContents.send('update-done');
    }
});

ipcMain.on('install-via-thunderstore', (installString) => {
    browserWindow.webContents.send('install-from-thunderstore-string', installString);
});

ipcMain.on('get-appData-directory', ()=>{
    browserWindow.webContents.send('receive-appData-directory', app.getPath('appData'));
});

ipcMain.on('get-is-portable', ()=>{
    let isPortable = false;
    switch(process.platform){
        case "win32":
            isPortable = process.execPath.startsWith(os.tmpdir());
            break;
        case "linux":
            // The correct way to handle this should be
            // isPortable = typeof process.env.APPIMAGE !== "undefined";
            // but since Manager.vue needs a refactor, we do the opposite
            isPortable = typeof process.env.APPIMAGE === "undefined";
            break;
    }
    browserWindow.webContents.send('receive-is-portable', isPortable);
});

ipcMain.on('restart', ()=>{
    app.relaunch();
    app.exit();
});

ipcMain.on('get-assets-path', ()=>{
    if (process.env.PROD) {
        browserWindow.webContents.send('receive-assets-path', global.__statics);
    } else {
        browserWindow.webContents.send('receive-assets-path', 'src/statics/');
    }
});

ipcMain.on('show-open-dialog', (arg, fileOpts) => {
  dialog.showOpenDialog(browserWindow, fileOpts).then(r => {
    browserWindow.webContents.send('receive-open-dialog', r);
  });
});

ipcMain.on('login', (arg, method) => {

    const authWindow = new BrowserWindow({
        useContentSize: true,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            webSecurity: false,
            contextIsolation: true
        },
        icon: path.join(__dirname, 'icon.png'),
        autoHideMenuBar: process.env.PROD
    });

    const clientId = process.env.OAUTH_CLIENT_ID;
    const clientSecret = process.env.OAUTH_CLIENT_SECRET;
    const redirectUri = "http://localhost/callback";

    const stateString = crypto.randomBytes(20).toString('hex');

    authWindow.loadURL(`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${stateString}&allow_signup=true&login`);

    authWindow.webContents.on("did-stop-loading", event => {
        const url = authWindow.webContents.getURL();
        if (url.toLowerCase().startsWith("http://localhost/callback")) {
            if (url.toLowerCase().indexOf("code=") > 0) {
                // Code exists
                const code = url.split(new RegExp("code="))[1].split("&")[0];
                const state = url.split(new RegExp("state="))[1].split("&")[0];
                if (state === stateString) {
                    axios.post("https://github.com/login/oauth/access_token", {
                        client_id: clientId,
                        client_secret: clientSecret,
                        code: code
                    }).then(res => {
                        const data = res.data;
                        if (data.indexOf("access_token=") >= 0) {
                            const token = res.data.split("access_token=")[1].split("&")[0];
                            // console.log("Token is:", token);
                            authWindow.close();
                        }
                    })
                }
            }
        }
    });
});

