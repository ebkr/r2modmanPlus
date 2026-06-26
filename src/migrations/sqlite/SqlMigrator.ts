export interface Migration {
    version: number;
    checksum: string;
    sql: string;
}

export interface MigratorDatabase {
    exec(sql: string): unknown;
    selectObjects(sql: string): Array<Record<string, unknown>>;
}

const CREATE_MIGRATIONS_TABLE = `
    CREATE TABLE IF NOT EXISTS migrations (
        version  INTEGER PRIMARY KEY,
        checksum TEXT NOT NULL
    );
`;

export function applyMigrations(db: MigratorDatabase, migrations: readonly Migration[]): void {
    db.exec(CREATE_MIGRATIONS_TABLE);

    const applied = new Map<number, string>();
    for (const row of db.selectObjects('SELECT version, checksum FROM migrations')) {
        applied.set(Number(row.version), String(row.checksum));
    }

    const ordered = [...migrations].sort((a, b) => a.version - b.version);

    for (const migration of ordered) {
        const existingChecksum = applied.get(migration.version);

        if (existingChecksum !== undefined) {
            if (existingChecksum !== migration.checksum) {
                throw new Error(`
                    Migration ${migration.version} was modified after being applied.
                    Old checksum: [${existingChecksum}], new: [${migration.checksum}].
                    You must add a new migration instead.
                `);
            }
            console.log("Already ran:", migration.version);
            continue;
        }

        db.exec('BEGIN');
        try {
            db.exec(migration.sql);
            db.exec(
                `INSERT INTO migrations (version, checksum) VALUES (${migration.version}, '${migration.checksum}')`
            );
            db.exec('COMMIT');
        } catch (e) {
            db.exec('ROLLBACK');
            throw new Error(
                `Migration ${migration.version} failed: ${e instanceof Error ? e.message : String(e)}`
            );
        }
    }
}
