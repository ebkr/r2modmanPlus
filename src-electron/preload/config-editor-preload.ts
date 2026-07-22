import { ipcRenderer } from 'electron';

export const RECEIVE_CONFIG_FILE_EVENT_KEY = 'receive-config-file';

export function fetchAllConfigFiles(id: number, version: number, basePath: string, fileCallback: (file: any) => void) {
    ipcRenderer.send(RECEIVE_CONFIG_FILE_EVENT_KEY, id, version, basePath);
    ipcRenderer.on(`${RECEIVE_CONFIG_FILE_EVENT_KEY}::${id}::${version}`, (_, file) => {
        fileCallback(file);
    });
}
