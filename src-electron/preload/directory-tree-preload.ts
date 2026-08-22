import { ipcRenderer, IpcRendererEvent } from 'electron';

// Keep in sync with {@link src-electron/ipc/directory-tree-hook.ts}
export const DIRECTORY_TREE_EVENT_KEY = 'directory-tree:read';

export function readDirectoryTree(id: number, rootPath: string, messageCallback: (message: any) => void) {
    const responseKey = `${DIRECTORY_TREE_EVENT_KEY}::${id}`;

    const listener = (_: IpcRendererEvent, message: any) => {
        if (message.type === 'end' || message.type === 'error') {
            ipcRenderer.removeListener(responseKey, listener);
        }
        messageCallback(message);
    };

    ipcRenderer.on(responseKey, listener);
    ipcRenderer.send(DIRECTORY_TREE_EVENT_KEY, id, rootPath);
}
