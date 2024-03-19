import Dexie, { Table } from 'dexie';

import ThunderstoreMod from '../../model/ThunderstoreMod';

interface DexieVersion {
    full_name: string;
    name: string;
    version_number: string;
    uuid4: string;
    dependencies: string[];
    description: string;
    icon: string;
    is_active: boolean;
    downloads: number;
    download_url: string;
    website_url: string;
    file_size: number;
    date_created: Date;
}

interface DexiePackage {
    full_name: string;
    owner: string;
    name: string;
    uuid4: string;
    package_url: string;
    categories: string[];
    rating_score: number;
    is_pinned: boolean;
    is_deprecated: boolean;
    has_nsfw_content: boolean;
    donation_link: string | undefined;
    date_created: Date;
    date_updated: Date;
    versions: DexieVersion[];

    // Extra fields not included in the API response
    community: string;
    date_fetched: Date; // When the entry was fetched from the API
}

class PackageDexieStore extends Dexie {
    packages!: Table<DexiePackage, string>;

    constructor() {
        super('tsPackages');

        this.version(1).stores({
            packages: '[community+full_name], [community+date_fetched]'
        });
    }
}

const db = new PackageDexieStore();

// TODO: user type guards to validate (part of) the data before operations?
export async function updateFromApiResponse(community: string, packages: any[]) {
    const extra = {community, date_fetched: new Date()};
    const newPackages: DexiePackage[] = packages.map((pkg) => ({...pkg, ...extra}));

    await db.transaction(
        'rw',
        db.packages,
        async () => {
            // UPSERT with fresh data from API.
            // Fetching ids for community's packages and deleting them all using
            // .bulkDelete would be a bit faster on small package lists due to
            // .bulkAdd (INSERT) being faster than .bulkPut (UPSERT). It starts
            // to lose its advantage when the package list grows since fetching
            // the ids and calling .bulkDelete gets slower. We should optimize
            // for big lists since the small ones are fast enough anyway, and
            // this approach also works better with the plans to use pagination
            // when fetching the package list in the future.
            await db.packages.bulkPut(newPackages);

            // Find packages that were no longer returned by the API and delete them.
            // .bulkDelete is faster than calling .delete() on the Collection
            // directly. Using the odd looking .where(compoundIndex).between(values)
            // is faster than .where(community).and(filterByDateFetched).
            const oldIds = await db.packages
                .where('[community+date_fetched]')
                .between([community, 0], [community, extra.date_fetched])
                .primaryKeys();
            await db.packages.bulkDelete(oldIds);
        }
    );
}

export async function getPackagesAsThunderstoreMods(community: string) {
    const packages = await db.packages.where({community}).toArray();
    return packages.map(ThunderstoreMod.parseFromThunderstoreData);
}

// TODO: Dexie v3 doesn't support combining .where() and .orderBy() in a
// way that would utilize the DB indexes. The current implementation
// bypasses this by assuming that outside the updateFromApiResponse
// transaction, all the packages have the same date_fetched value.
// Moving to Dexie v4 might improve things, but if that doesn't turn out
// to be true, filter or order the result set on JS side instead.
export async function getLastPackageListUpdateTime(community: string) {
    const fetched = await db.packages
        .where('[community+date_fetched]')
        .between([community, Dexie.minKey], [community, Dexie.maxKey])
        .first();

    return fetched ? fetched.date_fetched : undefined;
}
