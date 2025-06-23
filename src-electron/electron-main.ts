import { app, BrowserWindow, ipcMain, nativeTheme, protocol } from 'electron';
import { Listeners } from './ipcListeners';
import { Persist } from './window-state-persist';
import path from 'path';
import ipcServer from 'node-ipc';
import fs from 'fs';
import { fileURLToPath } from 'url';
import './node/init-node-ipc';

app.allowRendererProcessReuse = true;

try {
    if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
        require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'));
    }
} catch (_) {
}

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

if (process.env.PROD) {
    global.__statics = __dirname;
    global.__statics = path.join(__dirname, 'statics').replace(/\\/g, '\\\\');
    global.__assets = path.join(__dirname, 'assets').replace(/\\/g, '\\\\');
}

let mainWindow;

function createWindow() {
    /**
     * Initial window options
     */

    console.log(path.resolve(
        fileURLToPath(new URL('.', import.meta.url)),
        path.join(process.env.QUASAR_ELECTRON_PRELOAD_FOLDER, 'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION)
    ));

    const windowSize = Persist.getSize(app, {
        defaultWidth: 1200,
        defaultHeight: 700
    });

    mainWindow = new BrowserWindow({
        width: windowSize.width,
        height: windowSize.height,
        useContentSize: true,
        icon: path.join(__dirname, 'icon.png'),
        autoHideMenuBar: process.env.PROD,
        webPreferences: {
            // sandbox: false
            preload: path.resolve(
                fileURLToPath(new URL('.', import.meta.url)),
                path.join(process.env.QUASAR_ELECTRON_PRELOAD_FOLDER, 'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION)
            )
        }
    });

    if (windowSize.maximized) {
        mainWindow.maximize();
    }

    Persist.handle(mainWindow, app);

    // Initialise client to server communication listener
    new Listeners(mainWindow, app);

    mainWindow.loadURL(process.env.APP_URL);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', () => {
    createWindow();
    let reqLockSuccess = app.requestSingleInstanceLock();
    if (!reqLockSuccess) {
        // If this isn't the single instance,
        // connect to r2mm IPC and send the install parameter.
        ipcServer.connectTo('r2mm', () => {
            for (let i = 0; i < process.argv.length; i++) {
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
                ipcServer.server.on('install', (res) => {
                    ipcMain.emit('install-via-thunderstore', res);
                });
            }
        );
        ipcServer.server.start();
    }
});

app.whenReady().then(() => {
    protocol.registerFileProtocol('file', (request, callback) => {
        const pathname = request.url.replace('file:///', '');
        if (fs.existsSync(pathname)) {
            callback(pathname);
        } else {
            callback(path.join(__statics, 'unknown.png'));
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// Register current application with Thunderstore Protocol
app.setAsDefaultProtocolClient('ror2mm', process.execPath);
