import { App, ipcMain } from 'electron';
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

const databaseMap = new Map<string, DatabaseSync>();

export function hookDbIpc(app: App) {
    ipcMain.on('db:open', (event, name) => {
        const id = `db-connection-${databaseMap.size.toString()}`;
        const basePath = path.join(app.getPath('appData'), "database");
        fs.mkdirSync(basePath, { recursive: true });
        databaseMap.set(id, new DatabaseSync(path.join(app.getPath('appData'), "database", `${name}.sqlite`), {
            open: true,
        }));
        event.returnValue = id;
    })
}
