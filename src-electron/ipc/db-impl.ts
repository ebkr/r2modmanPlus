import { App, ipcMain } from 'electron';
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

const databaseMap = new Map<string, DatabaseSync>();

export function hookDbIpc(app: App) {
    ipcMain.on('db:open', (event, name) => {
        const id = `db-connection-${databaseMap.size.toString()}`;
        const basePath = path.join(app.getPath('appData'), "r2modmanPlus-local", "_database");
        fs.mkdirSync(basePath, { recursive: true });
        databaseMap.set(id, new DatabaseSync(path.join(basePath, `${name}.sqlite`), {
            open: true,
        }));
        event.returnValue = id;
    });

    ipcMain.handle('db:query', (event, dbId, query, ...args) => {
        const db: DatabaseSync = databaseMap.get(dbId)!;
        const stmt = db.prepare(query);
        return JSON.stringify(stmt.all(...args));
    });
}
