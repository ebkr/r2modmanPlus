import { type DatabaseProvider, getDatabaseProvider } from '../DatabaseProvider';
import { getPackageCacheMigrations } from './AllPackageCacheMigrations';
import { SortDirection } from '../../../model/real_enums/sort/SortDirection';
import type SortingStyle from '../../../model/enums/SortingStyle';
import { PackageSearchQuery } from './PackageSearchQuery';

let packageCacheDatabasePromise: Promise<DatabaseProvider> | undefined;

export function getPackageCacheDatabase(): Promise<DatabaseProvider> {
    if (!packageCacheDatabasePromise) {
        const db = getDatabaseProvider('package_cache');
        packageCacheDatabasePromise = initDatabase(db).then(() => db);
    }
    return packageCacheDatabasePromise;
}

async function initDatabase(db: DatabaseProvider) {
    const migrations = getPackageCacheMigrations();
    const hasMoreThanBaseMigrations = migrations.length > 3;
    // TODO - Need to support a `migrations` table
    if (hasMoreThanBaseMigrations) {
        throw new Error('Multiple migrations are not supported yet. You must implement a migrations table to record which ones have been ran. Initial migrations are repeatable.');
    }

    for (const migration of migrations) {
        const statements = migration.query
            .split(';')
            .map((s) => s.trim())
            .filter(Boolean);
        for (const statement of statements) {
            await db.query(statement);
        }
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
        `INSERT INTO communities (slug, date_fetched) VALUES (?, ?)
         ON CONFLICT(slug) DO UPDATE SET date_fetched = excluded.date_fetched`,
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
            is_deprecated, has_nsfw_content, date_fetched, categories,
            latest_version, latest_description, latest_icon, total_downloads
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        packageChunk.map(pkg => {
            const latest = pkg.versions?.[0];
            return [
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
                JSON.stringify(pkg.categories ?? []),
                latest?.version_number ?? '',
                latest?.description ?? '',
                latest?.icon ?? '',
                latest?.downloads ?? 0,
            ];
        })
    );

}

export async function getLatestVersionsForPackages(community: string, fullNames: string[]): Promise<Map<string, string>> {
    if (fullNames.length === 0) return new Map();
    const db = await getPackageCacheDatabase();
    const placeholders = fullNames.map(() => '?').join(', ');
    const rows = await db.query(
        `SELECT full_name, latest_version FROM packages WHERE community_slug = ? AND full_name IN (${placeholders})`,
        community, ...fullNames
    );
    return new Map(rows.map((r) => [r.full_name as string, r.latest_version as string]));
}

export async function getDeprecatedPackageNames(community: string): Promise<string[]> {
    const db = await getPackageCacheDatabase();
    const rows = await db.query(
        `SELECT full_name FROM packages WHERE community_slug = ? AND is_deprecated = 1`,
        community
    );
    return rows.map((r) => r.full_name as string);
}

export async function getDistinctCategories(community: string): Promise<string[]> {
    const db = await getPackageCacheDatabase();
    const rows = await db.query(
        `SELECT DISTINCT j.value FROM packages p, json_each(p.categories) j
         WHERE p.community_slug = ? ORDER BY j.value`,
        community
    );
    return rows.map((r) => r.value as string);
}

export async function isLatestPackageListIndex(community: string, hash: string): Promise<boolean> {
    const db = await getPackageCacheDatabase();
    const rows = await db.query(
        `SELECT 1 FROM index_chunk_hashes WHERE community_slug = ? AND hash = ? LIMIT 1`,
        community,
        hash
    );
    return rows.length > 0;
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

export async function getPaginatedPackages(
    searchTerm: string,
    community: string,
    sortDirection: SortDirection,
    sortingStyle: string,
    mustHaveAllCategories: string[],
    mustHaveAtLeastOneCategories: string[],
    mustNotHaveAnyCategories: string[],
    allowNsfw: boolean,
    showDeprecated: boolean,
    limit: number,
    page: number
) {
    const db = await getPackageCacheDatabase();
    return new PackageSearchQuery()
        .withSearch(searchTerm)
        .withCommunity(community)
        .withAllCategories(mustHaveAllCategories)
        .withAtLeastOneCategory(mustHaveAtLeastOneCategories)
        .withoutCategories(mustNotHaveAnyCategories)
        .withNsfw(allowNsfw)
        .withDeprecated(showDeprecated)
        .withSortingStyle(sortingStyle, sortDirection)
        .execute(db, limit, page);
}
