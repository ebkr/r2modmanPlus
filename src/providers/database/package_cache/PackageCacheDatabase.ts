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
    const hasMoreThanBaseMigrations = migrations.length > 5;
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
        `INSERT INTO packages (
            community_slug, full_name, name, owner, package_url,
            date_created, date_updated, rating_score, is_pinned,
            is_deprecated, has_nsfw_content, date_fetched, categories
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(community_slug, full_name) DO UPDATE SET
            name = excluded.name,
            owner = excluded.owner,
            package_url = excluded.package_url,
            date_created = excluded.date_created,
            date_updated = excluded.date_updated,
            rating_score = excluded.rating_score,
            is_pinned = excluded.is_pinned,
            is_deprecated = excluded.is_deprecated,
            has_nsfw_content = excluded.has_nsfw_content,
            date_fetched = excluded.date_fetched,
            categories = excluded.categories`,
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

    const toVersionArgs = (pkg: any, v: any) => [
        community,
        pkg.full_name,
        v.version_number,
        `${pkg.full_name}-${v.version_number}`,
        v.description,
        v.icon,
        v.download_url,
        v.website_url,
        v.file_size,
        v.downloads,
        v.date_created,
        v.is_active ? 1 : 0,
    ];

    const versionQuery = `INSERT INTO versions (
        community_slug, package_full_name, version_number, full_name,
        description, icon, download_url, website_url, file_size,
        downloads, date_created, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(community_slug, full_name) DO UPDATE SET
        description = excluded.description,
        icon = excluded.icon,
        download_url = excluded.download_url,
        website_url = excluded.website_url,
        file_size = excluded.file_size,
        downloads = excluded.downloads,
        is_active = excluded.is_active`;

    const latestVersionArgSets = packageChunk
        .filter(pkg => pkg.versions?.length > 0)
        .map(pkg => toVersionArgs(pkg, pkg.versions[0]));

    if (latestVersionArgSets.length > 0) {
        await db.transaction(versionQuery, latestVersionArgSets);
    }

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
