import { BrowserWindow, ipcMain, net } from 'electron';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

// Throttle progress events so a multi-GB download doesn't flood IPC.
const PROGRESS_INTERVAL_MS = 200;

export function hookNetIpc(browserWindow: BrowserWindow) {
    ipcMain.handle('node:net:download', async (event, url: string, destPath: string, downloadId: number) => {
        await fs.promises.mkdir(path.dirname(destPath), { recursive: true });

        const sendProgress = (loaded: number) => {
            if (!browserWindow.isDestroyed()) {
                browserWindow.webContents.send('node:net:download-progress', { downloadId, loaded });
            }
        };

        try {
            await downloadToFile(url, destPath, sendProgress);
        } catch (e) {
            // Remove the partial file so isVersionAlreadyDownloaded doesn't later treat
            // it as a complete download and feed a truncated zip to extraction.
            await fs.promises.rm(destPath, { force: true }).catch(() => undefined);
            throw e;
        }
    });
}

function downloadToFile(url: string, destPath: string, onProgress: (loaded: number) => void): Promise<void> {
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(destPath);
        const fail = (error: Error) => {
            writeStream.destroy();
            reject(error);
        };

        const request = net.request(url);
        request.on('redirect', () => request.followRedirect());
        request.on('error', fail);
        request.on('response', (response) => {
            if (response.statusCode >= 400) {
                request.abort();
                fail(new Error(`Download failed with status ${response.statusCode}`));
                return;
            }

            let loaded = 0;
            let lastEmit = 0;
            response.on('data', (chunk: Buffer) => {
                loaded += chunk.length;
                const now = Date.now();
                if (now - lastEmit >= PROGRESS_INTERVAL_MS) {
                    lastEmit = now;
                    onProgress(loaded);
                }
            });
            response.on('error', fail);
            writeStream.on('error', fail);
            writeStream.on('finish', () => {
                onProgress(loaded);
                resolve();
            });
            // Electron's IncomingMessage is a Readable at runtime but isn't typed as one.
            (response as unknown as Readable).pipe(writeStream);
        });
        request.end();
    });
}
