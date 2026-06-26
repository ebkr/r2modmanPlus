import * as Comlink from 'comlink';
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

import { applyMigrations } from '../../../migrations/sqlite/SqlMigrator';
import { MIGRATIONS } from '../../../migrations/sqlite/steps/generated';

const VFS_NAME = 'tsPackages';
const DB_PATH = '/tsPackages.sqlite3';

type PoolUtil = Awaited<ReturnType<Awaited<ReturnType<typeof sqlite3InitModule>>['installOpfsSAHPoolVfs']>>;
type PackageDatabase = InstanceType<PoolUtil['OpfsSAHPoolDb']>;

let dbPromise: Promise<PackageDatabase> | undefined;

function getDb(): Promise<PackageDatabase> {
    if (dbPromise === undefined) {
        dbPromise = (async () => {
            const sqlite3 = await sqlite3InitModule();
            const poolUtil = await sqlite3.installOpfsSAHPoolVfs({ name: VFS_NAME });
            const db = new poolUtil.OpfsSAHPoolDb(DB_PATH);
            db.exec('PRAGMA foreign_keys = ON');
            applyMigrations(db, MIGRATIONS);
            return db;
        })();
    }
    return dbPromise;
}

const api = {
    async init(): Promise<void> {
        const db = await getDb();
        const versions = db.selectValues('SELECT version FROM migrations ORDER BY version');
        console.log('[sqlite-worker] Web worker hit — migrations applied:', versions);
    },
};

export type PackageDbApi = typeof api;

Comlink.expose(api);
