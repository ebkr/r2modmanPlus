import { app, BrowserWindow, ipcMain, nativeTheme, protocol } from 'electron';
import { Listeners } from './ipcListeners';
import { Persist } from './window-state-persist';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import 'app/src-electron/ipc/init-ipc';
import { hookIpc } from 'app/src-electron/ipc/init-ipc';

// @ts-ignore
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
const anyGlobal: any = global;

if (process.env.PROD) {
    anyGlobal.__statics = __dirname;
    anyGlobal.__statics = path.join(__dirname, 'statics').replace(/\\/g, '\\\\');
    anyGlobal.__assets = path.join(__dirname, 'assets').replace(/\\/g, '\\\\');
}

let mainWindow: BrowserWindow | null = null;

async function createWindow() {

    const windowSize = Persist.getSize(app, {
        defaultWidth: 1200,
        defaultHeight: 700
    });

    mainWindow = new BrowserWindow({
        width: windowSize.width,
        height: windowSize.height,
        useContentSize: true,
        icon: path.resolve(__dirname, 'icons/icon.png'),
        autoHideMenuBar: !!process.env.PROD,
        webPreferences: {
            preload: path.resolve(
                fileURLToPath(new URL('.', import.meta.url)),
                path.join(process.env.QUASAR_ELECTRON_PRELOAD_FOLDER, 'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION)
            ),
            // TODO - Remove and find an appropriate workaround for CORS blocking by Electron
            // Likely workaround is to move network requests to backend
            webSecurity: false
        }
    });

    hookIpc(mainWindow);

    if (windowSize.maximized) {
        mainWindow.maximize();
    }

    Persist.handle(mainWindow, app);

    // Initialise client to server communication listener
    new Listeners(mainWindow, app);

    if (process.env.DEV) {
        await mainWindow.loadURL(process.env.APP_URL);
    } else {
        await mainWindow.loadFile('index.html');
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

const extractInstallUrl = (argv: string[]): string | null =>
    argv.find((arg) => arg.toLowerCase().includes('ror2mm://')) ?? null;

function dispatchInstallUrl(url: string | null) {
    if (!url || !mainWindow) return;
    const { webContents } = mainWindow;
    if (webContents.isLoading()) {
        webContents.once('did-finish-load', () => ipcMain.emit('install-via-thunderstore', url));
    } else {
        ipcMain.emit('install-via-thunderstore', url);
    }
}

if (!app.requestSingleInstanceLock()) {
    app.quit();
} else {
    app.on('second-instance', (_event, argv) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
        dispatchInstallUrl(extractInstallUrl(argv));
    });

    app.on('ready', async () => {
        await createWindow();
        dispatchInstallUrl(extractInstallUrl(process.argv));
    });
}

protocol.registerSchemesAsPrivileged([
    {
        scheme: 'public',
        privileges: {
            standard: true,
            secure: true,
            supportFetchAPI: true
        }
    }
])

app.whenReady().then(() => {
    protocol.registerFileProtocol('file', (request, callback) => {
        const pathname = request.url.replace('file:///', '');
        if (fs.existsSync(pathname)) {
            callback(pathname);
        } else {
            callback(path.join(anyGlobal.__statics, 'unknown.png'));
        }
    });

    protocol.handle('public', async (req: any) => {
        const publicFolder = path.resolve(__dirname, process.env.QUASAR_PUBLIC_FOLDER);
        let filePath = (req.url as string).substring("public://".length).replace(/\\/g, path.sep);
        if (filePath.endsWith(path.sep)) {
            filePath = filePath.substring(0, filePath.length - 1);
        }
        try {
            const fileContent = await fs.promises.readFile(path.join(publicFolder, filePath));
            return new Response(fileContent);
        } catch (e: any) {
            if (e?.code === 'ENOENT') {
                return new Response(null, { status: 404 });
            }
            throw e;
        }
    })
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
