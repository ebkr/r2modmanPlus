import Dexie, { Table } from 'dexie';

import Game from '../../model/game/Game';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import ThunderstoreVersion from '../../model/ThunderstoreVersion';
import { splitToNameAndVersion } from '../../utils/DependencyUtils';

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
    default_order: number; // Entry's index when received from the API
}

// For keeping track of seen package list index files so we can
// skip processing chunks if there's no changes.
interface IndexChunkHash {
    community: string;
    hash: string;
    date_updated: Date;
}

class PackageDexieStore extends Dexie {
    packages!: Table<DexiePackage, string>;
    indexHashes!: Table<IndexChunkHash, string>;

    constructor() {
        super('tsPackages');

        this.version(1).stores({
            packages: '[community+full_name], [community+date_fetched]'
        });
        this.version(2).stores({
            indexHashes: '&community, [community+hash]'
        });
    }
}

const db = new PackageDexieStore();

// TODO: user type guards to validate (part of) the data before operations?
export async function updateFromApiResponse(community: string, packageChunks: any[][]) {
    let default_order = 0;
    const extra = {community, date_fetched: new Date()};
    const newPackageChunks: DexiePackage[][] = packageChunks.map((chunk) =>
        chunk.map((pkg) => ({
            ...pkg,
            ...extra,
            default_order: default_order++
        }))
    );

    // Since we need to do these operations in a single transaction we can't
    // process the chunks one by one as they are downloaded.
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
            await Promise.all(
                newPackageChunks.map((chunk) => db.packages.bulkPut(chunk))
            );

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
    const packages = await db.packages.where({community}).sortBy('default_order');
    return packages.map(ThunderstoreMod.parseFromThunderstoreData);
}

export async function getPackagesByNames(community: string, packageNames: string[]) {
    const keys = packageNames.map((p): [string, string] => [community, p]);

    // Dexie's anyOfIgnoreCase doesn't support compound indexes.
    const packages = await db.packages.where('[community+full_name]').anyOf(keys).toArray();
    return packages.map(ThunderstoreMod.parseFromThunderstoreData);
}

export async function getPackageVersionNumbers(community: string, packageName: string) {
    const pkg = await getPackageFromDatabase(community, packageName);
    return pkg.versions.map((v) => v.version_number);
}

/**
 * @param game Game (community) which package listings should be used in the lookup.
 * @param dependencies Lookup targets as Thunderstore dependency strings.
 * @param useLatestVersion Ignore the version number in dependencyString and return the latest known version.
 * @returns ThunderstoreCombo[], silently omitting unknown packages and versions.
 */
export async function getCombosByDependencyStrings(
    game: Game,
    dependencyStrings: string[],
    useLatestVersion=false
): Promise<ThunderstoreCombo[]> {
    const community = game.internalFolderName;
    const split = dependencyStrings.map(splitToNameAndVersion);
    const keys = split.map((d): [string, string] => [community, d[0]]);

    // Dexie's anyOfIgnoreCase doesn't support compound indexes.
    const packages = await db.packages.where('[community+full_name]').anyOf(keys).toArray();
    const versionMap = Object.fromEntries(split);

    return packages.map((rawPackage) => {
        const rawVersion = useLatestVersion
            ? rawPackage.versions[0]
            : rawPackage.versions.find((v) => v.version_number === versionMap[rawPackage.full_name])

        if (!rawVersion) {
            return undefined;
        }

        const combo = new ThunderstoreCombo();
        combo.setMod(ThunderstoreMod.parseFromThunderstoreData(rawPackage));
        combo.setVersion(ThunderstoreVersion.parseFromThunderstoreData(rawVersion));
        return combo;
    }).filter((c): c is ThunderstoreCombo => c !== undefined);
}

export async function getLastPackageListUpdateTime(community: string) {
    const hash = await db.indexHashes.where({community}).first();
    return hash ? hash.date_updated : undefined;
}

export async function getVersionAsThunderstoreVersion(community: string, packageName: string, versionNumber: string) {
    const version = await getPackgeVersionFromDatabase(community, packageName, versionNumber);
    return ThunderstoreVersion.parseFromThunderstoreData(version);
}

export async function isLatestPackageListIndex(community: string, hash: string) {
    return Boolean(
        await db.indexHashes.where({community, hash}).count()
    );
}

export async function setLatestPackageListIndex(community: string, hash: string) {
    await db.indexHashes.put({community, hash, date_updated: new Date()});
}

async function getPackageFromDatabase(community: string, packageName: string) {
    const pkg = await db.packages.where({community, full_name: packageName}).first();

    if (!pkg) {
        throw new Error(`Couldn't find package "${packageName}" in ${community} packages`);
    }

    return pkg;
}

async function getPackgeVersionFromDatabase(community: string, packageName: string, versionNumber: string) {
    const pkg = await getPackageFromDatabase(community, packageName);
    const ver = pkg.versions.find((v) => v.version_number === versionNumber);

    if (!ver) {
        throw new Error(`Couldn't find version "${versionNumber}" of package "${packageName}" in ${community} packages`);
    }

    return ver;
}
