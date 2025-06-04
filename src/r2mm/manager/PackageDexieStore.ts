import Dexie, { Table } from 'dexie';

import { DexiePackage, fetchPackagesByCommunityPackagePairs } from './PackageDexieStoreMockables';
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

export async function getPackagesAsThunderstoreMods(community: string) {
    const packages = await db.packages.where({community}).toArray();
    return packages.map(ThunderstoreMod.parseFromThunderstoreData)
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

export async function pruneRemovedMods(community: string, cutoff: Date) {
    // Find packages that were no longer returned by the API and delete them.
    // .bulkDelete is faster than calling .delete() on the Collection
    // directly. Using the odd looking .where(compoundIndex).between(values)
    // is faster than .where(community).and(filterByDateFetched).
    const oldIds = await db.packages
        .where('[community+date_fetched]')
        .between([community, 0], [community, cutoff])
        .primaryKeys();
    await db.packages.bulkDelete(oldIds);
}

export async function resetCommunity(community: string) {
    await db.transaction('rw', db.packages, db.indexHashes, async () => {
        const packageIds = await db.packages.where({community}).primaryKeys();
        await db.packages.bulkDelete(packageIds);
        await db.indexHashes.where({community}).delete();
    });
}

export async function upsertPackageListChunk(community: string, packageChunk: any[]) {
    const extra = {community, date_fetched: new Date()};
    const newPackages: DexiePackage[] = packageChunk.map((pkg) => ({...pkg, ...extra}));
    await db.packages.bulkPut(newPackages);
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
