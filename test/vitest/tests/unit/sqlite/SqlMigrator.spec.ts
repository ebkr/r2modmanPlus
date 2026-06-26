import { describe, it, expect } from 'vitest';
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

import { applyMigrations } from '../../../../../src/migrations/sqlite/SqlMigrator';
import { MIGRATIONS } from '../../../../../src/migrations/sqlite/steps/generated';

async function createDb() {
    const sqlite3 = await sqlite3InitModule();
    const db = new sqlite3.oo1.DB(':memory:');
    db.exec('PRAGMA foreign_keys = ON');
    return db;
}

describe('SqlMigrator', () => {
    it('applies every generated migration and records its version', async () => {
        const db = await createDb();
        applyMigrations(db, MIGRATIONS);

        const recorded = db.selectValues('SELECT version FROM migrations ORDER BY version');
        expect(recorded).toEqual(MIGRATIONS.map((m) => m.version));

        const tables = db.selectValues(
            "SELECT name FROM sqlite_master WHERE type='table' AND name <> 'migrations' ORDER BY name"
        );
        expect(tables).toEqual([
            'categories',
            'dependencies',
            'package_categories',
            'package_listings',
            'package_versions',
            'packages',
        ]);
    });

    it('is idempotent — a second run applies nothing and does not throw', async () => {
        const db = await createDb();
        applyMigrations(db, MIGRATIONS);

        expect(() => applyMigrations(db, MIGRATIONS)).not.toThrow();
        expect(Number(db.selectValue('SELECT COUNT(*) FROM migrations'))).toBe(MIGRATIONS.length);
    });

    it('throws if an already-applied migration was modified', async () => {
        const db = await createDb();
        applyMigrations(db, MIGRATIONS);

        const tampered = MIGRATIONS.map((m, i) => (i === 0 ? { ...m, checksum: 'tampered' } : m));
        expect(() => applyMigrations(db, tampered)).toThrow(/modified after being applied/);
    });

    it('rolls back a failed migration without recording it', async () => {
        const db = await createDb();
        const broken = [{ version: 1, checksum: 'x', sql: 'CREATE TABLE oops (' }];

        expect(() => applyMigrations(db, broken)).toThrow(/Migration 1 failed/);
        expect(Number(db.selectValue('SELECT COUNT(*) FROM migrations'))).toBe(0);
    });
});
