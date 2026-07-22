import { BrowserWindow, ipcMain } from "electron";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

export function hookConfigEditor(browserWindow: BrowserWindow) {

    async function deepFindAndSendFiles(rootPath: string, basePath: string, hook: (file: { filename: string, filepath: string }) => void) {
        if ((await stat(basePath)).isFile()) {
            hook({
                filename: path.basename(basePath),
                path: basePath,
                relative: path.relative(rootPath, basePath),
            });
        } else {
            const paths = await readdir(basePath);
            for (const p of paths) {
                deepFindAndSendFiles(rootPath, path.join(basePath, p), hook);
            }
        }
    }

    ipcMain.on('receive-config-file', (event, id, version, basePath) => {
        deepFindAndSendFiles(basePath, basePath, file => {
            browserWindow.webContents.send(`receive-config-file::${id}::${version}`, file);
        })
    });

}
