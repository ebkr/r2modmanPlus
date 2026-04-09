import * as path from 'path';
import {beforeEach, describe, expect, test} from 'vitest';

import {MergedThunderstoreEcosystem, updateEcosystemReactives, updateLatestMergedEcosystemSchema} from '../../../../../src/r2mm/ecosystem/EcosystemMerge';
import {EcosystemModloaderPackages, EcosystemSupportedGames} from '../../../../../src/model/schema/ThunderstoreSchema';
import {MODLOADER_PACKAGES, MOD_LOADER_VARIANTS, updateModLoaderExports} from '../../../../../src/r2mm/installing/profile_installers/ModLoaderVariantRecord';
import InMemoryFsProvider from '../../../stubs/providers/InMemory.FsProvider';
import FsProvider from '../../../../../src/providers/generic/file/FsProvider';
import PathResolver from '../../../../../src/r2mm/manager/PathResolver';
import {providePathImplementation} from '../../../../../src/providers/node/path/path';
import {TestPathProvider} from '../../../stubs/providers/node/Node.Path.Provider';
import ManagerInformation from '../../../../../src/_managerinf/ManagerInformation';

const TEST_ROOT = 'TEST_ROOT';
const mergeFilePath = path.join(TEST_ROOT, 'ecosystem-merge.json');

async function writeCacheFile(schema: Partial<MergedThunderstoreEcosystem>) {
    const full: MergedThunderstoreEcosystem = {
        schemaVersion: '0.0.0',
        communities: {},
        games: {},
        modloaderPackages: [],
        packageInstallers: {},
        version: ManagerInformation.VERSION.toString(),
        ...schema,
    };
    await FsProvider.instance.writeFile(mergeFilePath, JSON.stringify(full));
}

describe('EcosystemMerge', () => {

    beforeEach(async () => {
        providePathImplementation(() => TestPathProvider);
        InMemoryFsProvider.clear();
        FsProvider.provide(() => new InMemoryFsProvider());
        PathResolver.ROOT = TEST_ROOT;
        EcosystemSupportedGames.value = [];
        EcosystemModloaderPackages.value = [];
        updateModLoaderExports();
        await FsProvider.instance.mkdirs(TEST_ROOT);
    });

    describe('updateEcosystemReactives', () => {

        test('falls back to bundled schema when no cache file exists', async () => {
            expect(EcosystemSupportedGames.value).toHaveLength(0);
            expect(EcosystemModloaderPackages.value).toHaveLength(0);

            await updateEcosystemReactives();

            expect(EcosystemSupportedGames.value.length).toBeGreaterThan(0);
            expect(EcosystemModloaderPackages.value.length).toBeGreaterThan(0);
        });

        test('loads from cache when version matches', async () => {
            expect(EcosystemSupportedGames.value).toHaveLength(0);
            await writeCacheFile({games: {}, modloaderPackages: []});

            await updateEcosystemReactives();

            expect(EcosystemSupportedGames.value).toHaveLength(0);
        });

        test('falls back to bundled schema when cached version is stale', async () => {
            expect(EcosystemSupportedGames.value).toHaveLength(0);
            await writeCacheFile({version: '0.0.0'});

            await updateEcosystemReactives();

            expect(EcosystemSupportedGames.value.length).toBeGreaterThan(0);
        });

        test('populates mod loader exports after updating reactives', async () => {
            expect(MODLOADER_PACKAGES.length).toBe(0);
            expect(Object.keys(MOD_LOADER_VARIANTS).length).toBe(0);

            await updateEcosystemReactives();

            expect(MODLOADER_PACKAGES.length).toBeGreaterThan(0);
            expect(Object.keys(MOD_LOADER_VARIANTS).length).toBeGreaterThan(0);
        });

    });

    describe('updateLatestMergedEcosystemSchema', () => {

        test('writes merge file to disk', async () => {
            expect(await FsProvider.instance.exists(mergeFilePath)).toBe(false);

            await updateLatestMergedEcosystemSchema();

            expect(await FsProvider.instance.exists(mergeFilePath)).toBe(true);
        });

        test('written file contains current version', async () => {
            expect(await FsProvider.instance.exists(mergeFilePath)).toBe(false);

            await updateLatestMergedEcosystemSchema();

            const content = (await FsProvider.instance.readFile(mergeFilePath)).toString('utf8');
            const parsed: MergedThunderstoreEcosystem = JSON.parse(content);
            expect(parsed.version).toBe(ManagerInformation.VERSION.toString());
        });

        test('bundled games are preserved when latest schema is empty', async () => {
            expect(EcosystemSupportedGames.value).toHaveLength(0);

            await updateLatestMergedEcosystemSchema();

            expect(EcosystemSupportedGames.value.length).toBeGreaterThan(0);
        });

        test('games absent from latest schema are preserved from bundled', async () => {
            await writeCacheFile({games: {}, modloaderPackages: []});
            await updateEcosystemReactives();
            expect(EcosystemSupportedGames.value.find(([_, g]) => g.internalFolderName === 'RiskOfRain2')).toBeUndefined();

            await updateLatestMergedEcosystemSchema();

            const game = EcosystemSupportedGames.value
                .find(([_, game]) => game.internalFolderName === 'RiskOfRain2');
            expect(game).toBeDefined();
        });

        test('overwrites existing cache file', async () => {
            await writeCacheFile({games: {}, modloaderPackages: []});
            expect(EcosystemSupportedGames.value).toHaveLength(0);

            await updateLatestMergedEcosystemSchema();

            expect(EcosystemSupportedGames.value.length).toBeGreaterThan(0);
        });

    });

});
