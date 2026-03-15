import { getDatabaseProvider, type DatabaseProvider } from '../DatabaseProvider';
import { getPackageCacheMigrations } from './AllPackageCacheMigrations';

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

export async function pruneRemovedMods(cutoff: Date) {
    const db = await getPackageCacheDatabase();
    return db.query(`
        DELETE FROM packages
        WHERE date_fetched IS NULL OR date_fetched <= ?
    `, cutoff.toISOString());
}

export async function resetCommunity(community: string) {
    const db = await getPackageCacheDatabase();
    return db.query(`
        DELETE FROM packages
        WHERE community_slug = ?
    `, community);
}

export async function upsertCommunity(community: string) {
    const db = await getPackageCacheDatabase();
    return db.query(
        `INSERT OR REPLACE INTO communities (slug, date_fetched) VALUES (?, ?)`,
        community,
        new Date().toISOString()
    );
}

export async function upsertPackageListChunk(community: string, packageChunk: any[]) {
    const db = await getPackageCacheDatabase();
    const date = new Date().toISOString();
    await db.transaction(
        `INSERT OR REPLACE INTO packages (
            community_slug, full_name, name, owner, package_url,
            date_created, date_updated, rating_score, is_pinned,
            is_deprecated, has_nsfw_content, date_fetched, categories
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        packageChunk.map(pkg => [
            community,
            pkg.full_name,
            pkg.name,
            pkg.owner,
            pkg.package_url,
            pkg.date_created,
            pkg.date_updated,
            pkg.rating_score,
            pkg.is_pinned ? 1 : 0,
            pkg.is_deprecated ? 1 : 0,
            pkg.has_nsfw_content ? 1 : 0,
            date,
            JSON.stringify(pkg.categories ?? [])
        ])
    );
}

export async function setLatestPackageListIndex(community: string, hash: string) {
    const db = await getPackageCacheDatabase();
    await db.query(
        `INSERT OR REPLACE INTO index_chunk_hashes (community_slug, hash, date_updated) VALUES (?, ?, ?)`,
        community,
        hash,
        new Date().toISOString()
    );
}

export async function getPaginatedPackages(limit: number, page: number) {
    const db = await getPackageCacheDatabase();
    await db.query(
        `SELECT * FROM packages LIMIT ? OFFSET ?`,
        limit,
        (page - 1) * limit
    );
}
