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
    full_name: string; // Primary key
    owner: string;
    name: string;
    community: string; // Not included in the API response
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
}

class PackageDexieStore extends Dexie {
    packages!: Table<DexiePackage, string>;

    constructor() {
        super('tsPackages');

        this.version(1).stores({
            packages: '[community+full_name]'
        });
    }
}

const db = new PackageDexieStore();

// TODO: user type guards to validate (part of) the data before operations?
export async function updateFromApiResponse(community: string, packages: any[]) {
    const newPackages: DexiePackage[] = packages.map((pkg) => ({...pkg, community}));

    await db.transaction(
        'rw',
        db.packages,
        async () => {
            // .bulkDelete is faster than calling .delete() on the collection directly.
            const oldIds = await db.packages.where({community}).primaryKeys();
            await db.packages.bulkDelete(oldIds);
            await db.packages.bulkAdd(newPackages)
        }
    );
};

export async function getPackagesAsThunderstoreMods(community: string) {
    const packages = await db.packages.where({community}).toArray();
    return packages.map(ThunderstoreMod.parseFromThunderstoreData);
}
