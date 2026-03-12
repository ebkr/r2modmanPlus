import { App, ipcMain } from 'electron';
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

const databaseMap = new Map<string, DatabaseSync>();

let txCounter = 0;
const transactionBufferMap = new Map<string, { dbId: string; statements: { q: string; args: any[] }[] }>();

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

    ipcMain.handle('db:transaction:begin', (event, dbId) => {
        const txId = `db-transaction-${txCounter++}`;
        transactionBufferMap.set(txId, { dbId, statements: [] });
        return txId;
    });

    ipcMain.handle('db:transaction:next', (event, txId, q, ...args) => {
        const tx = transactionBufferMap.get(txId);
        if (!tx) {
            throw new Error(`No transaction for id [${txId}]`);
        }
        tx.statements.push({ q, args });
    });

    ipcMain.handle('db:transaction:commit', (event, txId) => {
        const tx = transactionBufferMap.get(txId);
        if (!tx) {
            throw new Error(`No transaction for id [${txId}]`);
        }
        transactionBufferMap.delete(txId);
        const db = databaseMap.get(tx.dbId)!;
        db.exec('BEGIN TRANSACTION');
        try {
            for (const { q, args } of tx.statements) {
                db.prepare(q).run(...args);
            }
            db.exec('COMMIT');
        } catch (e) {
            db.exec('ROLLBACK');
            throw e;
        }
    });
}
