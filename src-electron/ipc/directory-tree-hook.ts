import { BrowserWindow, ipcMain } from 'electron';
import { Dirent } from 'node:fs';
import { readdir, lstat } from 'node:fs/promises';
import path from 'node:path';

// Keep in sync with {@link src-electron/preload/directory-tree-preload.ts}
export const DIRECTORY_TREE_EVENT_KEY = 'directory-tree:read';

type DirectoryTreeEntry = {
    name: string;
    path: string;
    relative: string;
    parentRelative: string;
    directory: boolean;
    size: number;
}

type DirectoryTreeMessage =
    | { type: 'entries', entries: DirectoryTreeEntry[] }
    | { type: 'end' }
    | { type: 'error', message: string, path: string, code?: string | undefined };

export function hookDirectoryTreeIpc(browserWindow: BrowserWindow) {

    ipcMain.on(DIRECTORY_TREE_EVENT_KEY, async (event, id: number, rootPath: string) => {
        const responseKey = `${DIRECTORY_TREE_EVENT_KEY}::${id}`;

        function send(message: DirectoryTreeMessage) {
            browserWindow.webContents.send(responseKey, message);
        }

        const pending: { path: string, relative: string }[] = [{ path: rootPath, relative: '' }];

        while (pending.length > 0) {
            const directory = pending.shift()!;

            let contents: Dirent[];
            try {
                contents = await readdir(directory.path, { withFileTypes: true });
            } catch (e) {
                const err = e as NodeJS.ErrnoException;
                send({ type: 'error', message: err.message, path: directory.path, code: err.code });
                return;
            }

            const parentRelative = directory.relative;
            const entries: DirectoryTreeEntry[] = contents.map(entry => {
                const entryPath = path.join(directory.path, entry.name);
                return {
                    name: entry.name,
                    path: entryPath,
                    relative: parentRelative === '' ? entry.name : parentRelative + path.sep + entry.name,
                    parentRelative: parentRelative,
                    directory: entry.isDirectory(),
                    size: 0,
                };
            });

            try {
                await Promise.all(entries.map(async entry => {
                    if (!entry.directory) {
                        entry.size = (await lstat(entry.path)).size;
                    }
                }));
            } catch (e) {
                const err = e as NodeJS.ErrnoException;
                send({ type: 'error', message: err.message, path: err.path ?? directory.path, code: err.code });
                return;
            }

            for (const entry of entries) {
                if (entry.directory) {
                    pending.push({ path: entry.path, relative: entry.relative });
                }
            }

            send({ type: 'entries', entries });
        }

        send({ type: 'end' });
    });

}
