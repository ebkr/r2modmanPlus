import { App, ipcMain } from 'electron';
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

const databaseMap = new Map<string, DatabaseSync>();
const statementCache = new Map<string, Map<string, ReturnType<DatabaseSync['prepare']>>>();

export function hookDbIpc(app: App) {
    ipcMain.on('db:open', (event, name) => {
        const id = `db-connection-${databaseMap.size.toString()}`;
        const basePath = path.join(app.getPath('appData'), "r2modmanPlus-local", "_database");
        fs.mkdirSync(basePath, { recursive: true });

        const db = new DatabaseSync(path.join(basePath, `${name}.sqlite`), {
            open: true,
        });

        databaseMap.set(id, db);
        statementCache.set(id, new Map());
        db.exec("PRAGMA journal_mode=MEMORY");
        db.exec("PRAGMA synchronous=OFF");

        event.returnValue = id;
    });

    ipcMain.handle('db:query', (event, dbId, query, ...args) => {
        const db: DatabaseSync = databaseMap.get(dbId)!;
        const stmt = db.prepare(query);
        return JSON.stringify(stmt.all(...args));
    });

    ipcMain.handle('db:transaction', (event, dbId, q: string, argSets: any[][]) => {
        const db: DatabaseSync = databaseMap.get(dbId)!;
        const cache = statementCache.get(dbId)!;
        let stmt = cache.get(q);
        if (!stmt) {
            stmt = db.prepare(q);
            cache.set(q, stmt);
        }
        db.exec('BEGIN TRANSACTION');
        try {
            for (const args of argSets) {
                stmt.run(...args);
            }
            db.exec('COMMIT');
        } catch (e) {
            db.exec('ROLLBACK');
            throw e;
        }
    });
}
