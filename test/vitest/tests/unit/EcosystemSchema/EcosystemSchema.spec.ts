import * as path from 'path';
import {afterEach, beforeEach, describe, expect, MockInstance, test, vi} from 'vitest';

let mockJsonSchema: object = {};
vi.mock('../../../../../src/assets/data/ecosystemJsonSchema.json', () => ({
    get default() { return mockJsonSchema; }
}));

import type {ThunderstoreEcosystem} from '../../../../../src/assets/data/ecosystemTypes';
import {VersionedThunderstoreEcosystem, updateEcosystemReactives, updateLatestEcosystemSchema} from '../../../../../src/r2mm/ecosystem/EcosystemSchema';
import {EcosystemModloaderPackages, EcosystemSupportedGames} from '../../../../../src/model/schema/ThunderstoreSchema';
import {MODLOADER_PACKAGES, MOD_LOADER_VARIANTS, updateModLoaderExports} from '../../../../../src/r2mm/installing/profile_installers/ModLoaderVariantRecord';
import InMemoryFsProvider from '../../../stubs/providers/InMemory.FsProvider';
import FsProvider from '../../../../../src/providers/generic/file/FsProvider';
import PathResolver from '../../../../../src/r2mm/manager/PathResolver';
import {providePathImplementation} from '../../../../../src/providers/node/path/path';
import {TestPathProvider} from '../../../stubs/providers/node/Node.Path.Provider';
import ManagerInformation from '../../../../../src/_managerinf/ManagerInformation';
import LoggerProvider from '../../../../../src/providers/ror2/logging/LoggerProvider';
import StubLoggerProvider from '../../../stubs/providers/stub.LoggerProvider';
import { provideGameImageImplementation } from '../../../../../src/providers/generic/image/GameImageProvider';

const mockAxiosGet = vi.fn();

vi.mock('../../../../../src/utils/HttpUtils', () => ({
    getAxiosWithTimeouts: () => ({get: mockAxiosGet}),
}));

vi.mock('../../../../../src/utils/Common', () => ({
    retry: (fn: () => Promise<any>) => fn(),
}));

const TEST_ROOT = 'TEST_ROOT';
const latestSchemaFilePath = path.join(TEST_ROOT, 'latest-ecosystem-schema.json');

function createMinimalSchema(): ThunderstoreEcosystem {
    return {
        schemaVersion: '0.0.0',
        communities: {},
        games: {},
        modloaderPackages: [],
        packageInstallers: {},
    };
}

async function writeCacheFile(schema: Partial<VersionedThunderstoreEcosystem>) {
    const full: VersionedThunderstoreEcosystem = {
        ...createMinimalSchema(),
        version: ManagerInformation.VERSION.toString(),
        ...schema,
    };
    await FsProvider.instance.writeFile(latestSchemaFilePath, JSON.stringify(full));
}

describe('EcosystemSchema', () => {

    let spyLogger: MockInstance;
    let mockPrefetchAll: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
        mockJsonSchema = {};
        providePathImplementation(() => TestPathProvider);
        InMemoryFsProvider.clear();
        FsProvider.provide(() => new InMemoryFsProvider());
        PathResolver.ROOT = TEST_ROOT;
        EcosystemSupportedGames.value = [];
        EcosystemModloaderPackages.value = [];
        const loggerImpl = new StubLoggerProvider();
        LoggerProvider.provide(() => loggerImpl);
        spyLogger = vi.spyOn(LoggerProvider.instance, 'Log').mockImplementation(() => {});
        updateModLoaderExports();
        mockAxiosGet.mockReset();
        mockPrefetchAll = vi.fn().mockResolvedValue(undefined);
        provideGameImageImplementation(() => ({
            init: vi.fn().mockResolvedValue(undefined),
            get placeholderUrl() { return ''; },
            resolve: vi.fn().mockResolvedValue(''),
            prefetchAll: mockPrefetchAll,
        }));
        await FsProvider.instance.mkdirs(TEST_ROOT);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    })

    describe('updateEcosystemReactives', () => {

        test('falls back to bundled schema when no cache file exists', async () => {

            expect(EcosystemSupportedGames.value).toHaveLength(0);
            expect(EcosystemModloaderPackages.value).toHaveLength(0);
            expect(await FsProvider.instance.exists(latestSchemaFilePath)).toBe(false);

            await updateEcosystemReactives();

            expect(await FsProvider.instance.exists(latestSchemaFilePath)).toBe(false);
            expect(EcosystemSupportedGames.value.length).toBeGreaterThan(0);
            expect(EcosystemModloaderPackages.value.length).toBeGreaterThan(0);
        });

        test('loads from cache when version matches', async () => {
            expect(EcosystemSupportedGames.value).toHaveLength(0);
            expect(await FsProvider.instance.exists(latestSchemaFilePath)).toBe(false);

            await writeCacheFile({games: {}, modloaderPackages: []});
            await updateEcosystemReactives();

            expect(await FsProvider.instance.exists(latestSchemaFilePath)).toBe(true);
            expect(EcosystemSupportedGames.value).toHaveLength(0);
        });

        test('falls back to bundled schema when cached version is stale', async () => {
            expect(EcosystemSupportedGames.value).toHaveLength(0);
            await writeCacheFile({version: '0.0.0'});

            await updateEcosystemReactives();

            expect(EcosystemSupportedGames.value.length).toBeGreaterThan(0);
        });

        test('falls back to bundled schema and logs error when cached content is invalid', async () => {
            await FsProvider.instance.writeFile(latestSchemaFilePath, 'not valid json');

            await updateEcosystemReactives();

            expect(EcosystemSupportedGames.value.length).toBeGreaterThan(0);
            expect(spyLogger).toHaveBeenCalledOnce();
        });

        test('populates mod loader exports after updating reactives', async () => {
            expect(MODLOADER_PACKAGES.length).toBe(0);
            expect(Object.keys(MOD_LOADER_VARIANTS).length).toBe(0);

            await updateEcosystemReactives();

            expect(MODLOADER_PACKAGES.length).toBeGreaterThan(0);
            expect(Object.keys(MOD_LOADER_VARIANTS).length).toBeGreaterThan(0);
        });

    });

    describe('updateLatestEcosystemSchema', () => {

        test('writes file to disk when fetch succeeds', async () => {
            mockAxiosGet.mockResolvedValue({
                status: 200,
                data: createMinimalSchema(),
                headers: {},
            });

            expect(await FsProvider.instance.exists(latestSchemaFilePath)).toBe(false);
            await updateLatestEcosystemSchema();
            expect(await FsProvider.instance.exists(latestSchemaFilePath)).toBe(true);
        });

        test('written file contains current version', async () => {
            mockAxiosGet.mockResolvedValue({
                status: 200,
                data: createMinimalSchema(),
                headers: {},
            });

            await updateLatestEcosystemSchema();

            const content = (await FsProvider.instance.readFile(latestSchemaFilePath)).toString('utf8');
            const parsed: VersionedThunderstoreEcosystem = JSON.parse(content);
            expect(parsed.version).toBe(ManagerInformation.VERSION.toString());
        });

        test('stores lastModified from response header', async () => {
            const lastModified = 'Tue, 15 Apr 2026 12:00:00 GMT';
            mockAxiosGet.mockResolvedValue({
                status: 200,
                data: createMinimalSchema(),
                headers: {'last-modified': lastModified},
            });

            await updateLatestEcosystemSchema();

            const content = (await FsProvider.instance.readFile(latestSchemaFilePath)).toString('utf8');
            const parsed: VersionedThunderstoreEcosystem = JSON.parse(content);
            expect(parsed.lastModified).toBe(lastModified);
        });

        test('sends If-Modified-Since header when cache has lastModified', async () => {
            const cachedLastModified = 'Mon, 14 Apr 2026 12:00:00 GMT';
            await writeCacheFile({lastModified: cachedLastModified});

            mockAxiosGet.mockResolvedValue({
                status: 304,
                data: null,
                headers: {},
            });

            await updateLatestEcosystemSchema();

            expect(mockAxiosGet).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: {'If-Modified-Since': cachedLastModified},
                })
            );
        });

        test('does nothing on 304 Not Modified', async () => {
            await writeCacheFile({});
            const originalContent = (await FsProvider.instance.readFile(latestSchemaFilePath)).toString('utf8');

            mockAxiosGet.mockResolvedValue({
                status: 304,
                data: null,
                headers: {},
            });

            await updateLatestEcosystemSchema();

            const afterContent = (await FsProvider.instance.readFile(latestSchemaFilePath)).toString('utf8');
            expect(afterContent).toBe(originalContent);
        });

        test('writes bundled schema and throws when fetch fails with no cache', async () => {
            mockAxiosGet.mockRejectedValue(new Error('Network error'));

            expect(await FsProvider.instance.exists(latestSchemaFilePath)).toBe(false);
            await expect(updateLatestEcosystemSchema()).rejects.toThrow();
            expect(await FsProvider.instance.exists(latestSchemaFilePath)).toBe(true);

            const content = (await FsProvider.instance.readFile(latestSchemaFilePath)).toString('utf8');
            const parsed: VersionedThunderstoreEcosystem = JSON.parse(content);
            expect(parsed.schemaVersion).not.toBe('');
            expect(EcosystemSupportedGames.value.length).toBeGreaterThan(0);
        });

        test('keeps existing cache and throws when fetch fails with existing cache', async () => {
            await writeCacheFile({});
            const originalContent = (await FsProvider.instance.readFile(latestSchemaFilePath)).toString('utf8');

            mockAxiosGet.mockRejectedValue(new Error('Network error'));

            await expect(updateLatestEcosystemSchema()).rejects.toThrow();

            const afterContent = (await FsProvider.instance.readFile(latestSchemaFilePath)).toString('utf8');
            expect(afterContent).toBe(originalContent);
        });

        test('populates games from cache into reactives when fetch fails with existing cache', async () => {
            await writeCacheFile({
                games: {
                    'test-cached-game': {
                        distributions: [],
                        label: 'Test Cached Game',
                        meta: { displayName: 'Test Cached Game', iconUrl: null },
                        r2modman: [{ meta: { iconUrl: null } }],
                        uuid: 'test-uuid',
                    },
                },
            });

            mockAxiosGet.mockRejectedValue(new Error('Network error'));

            await expect(updateLatestEcosystemSchema()).rejects.toThrow();

            expect(EcosystemSupportedGames.value.length).toBeGreaterThan(0);
            expect(EcosystemSupportedGames.value[0]![0]).toBe('test-cached-game');
        });

        test('merges fetched data with bundled schema', async () => {
            mockAxiosGet.mockResolvedValue({
                status: 200,
                data: {
                    ...createMinimalSchema(),
                    communities: {
                        'test-added': {
                            displayName: 'Added Community',
                            categories: {},
                            sections: {'default': {name: 'Default'}},
                        },
                    },
                },
                headers: {},
            });

            await updateLatestEcosystemSchema();

            const content = (await FsProvider.instance.readFile(latestSchemaFilePath)).toString('utf8');
            const parsed: VersionedThunderstoreEcosystem = JSON.parse(content);
            expect(parsed.communities['test-added']).toBeDefined();
            // Bundled games are preserved through the merge
            expect(EcosystemSupportedGames.value.length).toBeGreaterThan(0);
        });

        test('deduplicates modloader packages during merge', async () => {
            mockAxiosGet.mockResolvedValue({
                status: 200,
                data: {
                    ...createMinimalSchema(),
                    modloaderPackages: [
                        {packageId: 'test-unique-loader', rootFolder: 'test', loader: 'bepinex'},
                        {packageId: 'test-unique-loader', rootFolder: 'test-updated', loader: 'bepinex'},
                    ],
                },
                headers: {},
            });

            await updateLatestEcosystemSchema();

            const content = (await FsProvider.instance.readFile(latestSchemaFilePath)).toString('utf8');
            const parsed: VersionedThunderstoreEcosystem = JSON.parse(content);
            const testLoaders = parsed.modloaderPackages.filter(
                (p: any) => p.packageId === 'test-unique-loader'
            );
            expect(testLoaders).toHaveLength(1);
            expect(testLoaders[0]!.rootFolder).toBe('test-updated');
        });

        test('passes icon URLs for new games to prefetchAll', async () => {
            const newGameIconUrl = 'test-new-game-xyz/test-new-game-xyz-cover.webp';
            mockAxiosGet.mockResolvedValue({
                status: 200,
                data: {
                    ...createMinimalSchema(),
                    games: {
                        'test-new-game-xyz': {
                            distributions: [],
                            label: 'Test New Game',
                            meta: { displayName: 'Test New Game', iconUrl: null },
                            r2modman: [{ meta: { iconUrl: newGameIconUrl } }],
                            uuid: 'test-uuid',
                        },
                    },
                },
                headers: {},
            });

            await updateLatestEcosystemSchema();

            expect(mockPrefetchAll).toHaveBeenCalledWith([newGameIconUrl]);
        });

        test('does not call prefetchAll when all games are already bundled', async () => {
            mockAxiosGet.mockResolvedValue({
                status: 200,
                data: createMinimalSchema(),
                headers: {},
            });

            await updateLatestEcosystemSchema();

            expect(mockPrefetchAll).not.toHaveBeenCalled();
        });

    });

});
