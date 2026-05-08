import Dexie, { Table } from 'dexie';

import { DexiePackage, DexieSummary, fetchPackagesByCommunityPackagePairs } from './PackageDexieStoreMockables';
import Game from '../../model/game/Game';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import ThunderstoreVersion from '../../model/ThunderstoreVersion';
import { splitToNameAndVersion } from '../../utils/DependencyUtils';



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
    summaries!: Table<DexieSummary, string>;

    constructor() {
        super('tsPackages');

        this.version(1).stores({
            packages: '[community+full_name], [community+date_fetched]'
        });
        this.version(2).stores({
            indexHashes: '&community, [community+hash]'
        });
        this.version(3).stores({
            summaries: '[community+full_name]',
            packages: '[community+full_name]'
        });
    }
}

const db = new PackageDexieStore();

function toSummary(community: string, pkg: any): DexieSummary {
    return {
        community,
        full_name: pkg.full_name,
        name: pkg.name,
        owner: pkg.owner,
        package_url: pkg.package_url,
        date_created: pkg.date_created,
        date_updated: pkg.date_updated,
        categories: pkg.categories,
        rating_score: pkg.rating_score,
        is_pinned: pkg.is_pinned,
        is_deprecated: pkg.is_deprecated,
        has_nsfw_content: pkg.has_nsfw_content,
        donation_link: pkg.donation_link,
        total_downloads: pkg.versions.reduce((x: number, v: {downloads: number}) => x + v.downloads, 0),
        latest_version_number: pkg.versions[0].version_number,
        latest_description: pkg.versions[0].description,
        latest_icon: pkg.versions[0].icon,
    };
}

async function rebuildSummaries(community: string): Promise<DexieSummary[]> {
    return await db.transaction('rw', db.packages, db.summaries, async () => {
        const pkgs = await db.packages.where({community}).toArray();
        const summaries = pkgs.map((p) => toSummary(community, p));
        await db.summaries.bulkPut(summaries);
        return summaries;
    });
}

export async function getPackagesAsThunderstoreMods(community: string) {
    let summaries = await db.summaries.where({community}).toArray();

    if (summaries.length === 0) {
        summaries = await rebuildSummaries(community);
    }

    return summaries.map(ThunderstoreMod.parseFromSummary)
                    .sort(ThunderstoreMod.defaultOrderComparer);
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

export async function getPackageVersionNumbersBatch(community: string, packageNames: string[]): Promise<Map<string, string[]>> {
    const keys = packageNames.map((p): [string, string] => [community, p]);
    const packages = await db.packages.where('[community+full_name]').anyOf(keys).toArray();
    return new Map(packages.map(pkg => [pkg.full_name, pkg.versions.map(v => v.version_number)]));
}

export async function getPackageCount(community: string) {
    return await db.packages.where({community}).count();
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

    const packages = await fetchPackagesByCommunityPackagePairs(db, keys);
    const versionMap = Object.fromEntries(split);
    const modOrderMap = new Map(split.map(([name, _ver], i) => [name, i]));

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
    }).filter(
        (c): c is ThunderstoreCombo => c !== undefined
    ).sort((a, b) => {
        // Sort combos to match the original order of dependency strings.
        const positionA = modOrderMap.get(a.getMod().getFullName()) || -1;
        const positionB = modOrderMap.get(b.getMod().getFullName()) || -1;
        return positionA - positionB;
    });
}

export async function getLastPackageListUpdateTime(community: string) {
    const hash = await db.indexHashes.where({community}).first();
    return hash ? hash.date_updated : undefined;
}

export async function getVersionAsThunderstoreVersion(community: string, packageName: string, versionNumber: string) {
    const version = await getPackgeVersionFromDatabase(community, packageName, versionNumber);
    return ThunderstoreVersion.parseFromThunderstoreData(version);
}

export async function hasEntries(community: string): Promise<boolean> {
    if (await db.indexHashes.where({community}).count()) {
        return true;
    }

    if (await db.packages.where({community}).count()) {
        return true;
    }

    return false;
}

export async function isLatestPackageListIndex(community: string, hash: string) {
    return Boolean(
        await db.indexHashes.where({community, hash}).count()
    );
}

export function selectPackageIdsToPrune(
    storedKeys: [string, string][],
    fetchedFullNames: Set<string>
): [string, string][] {
    return storedKeys.filter(([, fullName]) => !fetchedFullNames.has(fullName));
}

export async function pruneRemovedMods(community: string, fetchedFullNames: Set<string>) {
    await db.transaction('rw', db.packages, db.summaries, async () => {
        const storedKeys = await db.packages.where({community}).primaryKeys();
        const toDelete = selectPackageIdsToPrune(storedKeys, fetchedFullNames);
        await db.packages.bulkDelete(toDelete);
        await db.summaries.bulkDelete(toDelete);
    });
}

export async function resetCommunity(community: string) {
    await db.transaction('rw', db.packages, db.summaries, db.indexHashes, async () => {
        const packageIds = await db.packages.where({community}).primaryKeys();
        await db.packages.bulkDelete(packageIds);
        await db.summaries.where({community}).delete();
        await db.indexHashes.where({community}).delete();
    });
}

export async function upsertPackageListChunk(community: string, packageChunk: any[]) {
    const newPackages: DexiePackage[] = packageChunk.map((pkg) => ({...pkg, community}));
    const newSummaries: DexieSummary[] = packageChunk.map((pkg) => toSummary(community, pkg));
    await db.transaction('rw', db.packages, db.summaries, async () => {
        await db.packages.bulkPut(newPackages);
        await db.summaries.bulkPut(newSummaries);
    });
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
