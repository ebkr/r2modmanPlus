import { ipcRenderer } from 'electron';

let nextDownloadId = 0;

export function download(
    url: string,
    destPath: string,
    onProgress?: (downloadedBytes: number) => void
): Promise<void> {
    const downloadId = nextDownloadId++;

    const listener = (_event: unknown, payload: { downloadId: number; loaded: number }) => {
        if (payload.downloadId === downloadId && onProgress) {
            onProgress(payload.loaded);
        }
    };
    ipcRenderer.on('node:net:download-progress', listener);

    return ipcRenderer.invoke('node:net:download', url, destPath, downloadId)
        .finally(() => ipcRenderer.removeListener('node:net:download-progress', listener));
}
