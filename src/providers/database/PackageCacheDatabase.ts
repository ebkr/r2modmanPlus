import { getDatabaseProvider, type DatabaseProvider } from './DatabaseProvider';
import { getPackageCacheMigrations } from './package_cache/AllPackageCacheMigrations';

let packageCacheDatabase: DatabaseProvider = undefined!;

export async function getPackageCacheDatabase() {
    if (!packageCacheDatabase) {
        packageCacheDatabase = getDatabaseProvider('package_cache');
        await initDatabase(packageCacheDatabase);
    }
    return packageCacheDatabase;
}

async function initDatabase(db: DatabaseProvider) {
    const migrations = getPackageCacheMigrations();
    const hasMoreThanBaseMigrations = migrations.length > 5;
    // TODO - Need to support a `migrations` table
    if (hasMoreThanBaseMigrations) {
        throw new Error('Multiple migrations are not supported yet. You must implement a migrations table to record which ones have been ran. Initial migrations are repeatable.');
    }

    for (const migration of migrations) {
        console.log("Running migration", migration.version);
        await db.query(migration.query);
    }
}
