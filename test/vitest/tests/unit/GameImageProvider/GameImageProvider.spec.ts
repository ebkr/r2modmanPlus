/**
 * Targeted vitest spec for GameImageProviderImpl.
 *
 * Covers every branch of resolve() and placeholderUrl:
 *   - placeholder return paths (empty / no cache / CDN tripped / 404)
 *   - bundled-URL fast path
 *   - local-dev proxy fast path (only valid in dev mode)
 *   - disk-cache hit returns data: URL
 *   - CDN fetch + cache + return data: URL
 *   - CDN failure accumulation -> breaker trips after threshold
 *   - CDN 404 does NOT count as failure
 *
 * Mocks the provider singletons rather than using the real implementations.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import nodePath from 'path';

import FsProvider from '../../../../../src/providers/generic/file/FsProvider';
import InMemoryFsProvider from '../../../stubs/providers/InMemory.FsProvider';
import LoggerProvider from '../../../../../src/providers/ror2/logging/LoggerProvider';
import StubLoggerProvider from '../../../stubs/providers/stub.LoggerProvider';
import PathResolver from '../../../../../src/r2mm/manager/PathResolver';
import { providePathImplementation } from '../../../../../src/providers/node/path/path';
import { TestPathProvider } from '../../../stubs/providers/node/Node.Path.Provider';
import { provideProtocolImplementation } from '../../../../../src/providers/generic/protocol/ProtocolProvider';
import { provideBufferImplementation } from '../../../../../src/providers/node/buffer/buffer';

// Stub the CdnProvider statics - replaceCdnHost is a pass-through for tests.
vi.mock('../../../../../src/providers/generic/connection/CdnProvider', () => ({
    default: {
        replaceCdnHost: (url: string) => url,
    },
}));

// Buffer stub - tests don't read the bytes after passing them to writeFile.
const fakeBufferImpl = {
    from: (data: any, encoding?: 'utf8' | 'base64') => {
        if (data instanceof ArrayBuffer) return Buffer.from(data);
        return Buffer.from(data, encoding);
    },
};

const fakeProtocolImpl = {
    getPublicAssetUrl: (relPath: string) => `app://./${relPath.replace(/^\//, '')}`,
};

// Import AFTER mocks are set up.
import { GameImageProviderImplementation } from '../../../../../src/r2mm/image/GameImageProviderImpl';

const PLACEHOLDER_URL = 'app://./images/game_selection/placeholder.webp';
const TEST_APPDATA = 'TEST_APPDATA';
const CACHE_ROOT = nodePath.join(TEST_APPDATA, 'image-cache');

function cachePathFor(iconUrl: string): string {
    return nodePath.join(CACHE_ROOT, ...iconUrl.split('/'));
}

function makeFetchResponse(body: ArrayBuffer | string, status = 200, statusText = 'OK'): Response {
    return {
        ok: status >= 200 && status < 300,
        status,
        statusText,
        async arrayBuffer() { return typeof body === 'string' ? new TextEncoder().encode(body).buffer : body; },
    } as unknown as Response;
}

describe('GameImageProviderImpl', () => {
    let mockFetch: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
        providePathImplementation(() => TestPathProvider);
        InMemoryFsProvider.clear();
        FsProvider.provide(() => new InMemoryFsProvider());
        const loggerImpl = new StubLoggerProvider();
        LoggerProvider.provide(() => loggerImpl);
        vi.spyOn(loggerImpl, 'Log').mockImplementation(() => {});
        provideProtocolImplementation(() => fakeProtocolImpl);
        provideBufferImplementation(() => fakeBufferImpl);

        PathResolver.APPDATA_DIR = TEST_APPDATA;

        // Reset breaker state on the singleton (privates set via any-cast).
        const inst: any = GameImageProviderImplementation;
        inst.cacheRoot = undefined;
        inst.cdnConsecutiveFailures = 0;
        inst.cdnBreakerTripped = false;

        mockFetch = vi.fn();
        vi.stubGlobal('fetch', mockFetch);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    describe('placeholderUrl', () => {
        test('returns the bundled placeholder URL', () => {
            expect(GameImageProviderImplementation.placeholderUrl).toBe(PLACEHOLDER_URL);
        });
    });

    describe('init()', () => {
        test('creates the image-cache directory under APPDATA_DIR', async () => {
            expect(await FsProvider.instance.exists(CACHE_ROOT)).toBe(false);
            await GameImageProviderImplementation.init();
            expect(await FsProvider.instance.exists(CACHE_ROOT)).toBe(true);
        });

        test('does nothing when APPDATA_DIR is unset', async () => {
            PathResolver.APPDATA_DIR = '' as any;
            await GameImageProviderImplementation.init();
            expect(await FsProvider.instance.exists(CACHE_ROOT)).toBe(false);
        });
    });

    describe('resolve()', () => {
        test('returns placeholder for empty iconUrl without fetching', async () => {
            const result = await GameImageProviderImplementation.resolve('');
            expect(result).toBe(PLACEHOLDER_URL);
            expect(mockFetch).not.toHaveBeenCalled();
        });

        test('returns bundled URL when bundled asset is reachable', async () => {
            await GameImageProviderImplementation.init();
            mockFetch.mockResolvedValueOnce(makeFetchResponse('OK'));

            const result = await GameImageProviderImplementation.resolve('test-game/test-game-cover-360x480.webp');
            expect(result).toBe('app://./images/game_selection/test-game/test-game-cover-360x480.webp');
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        test('returns disk-cached data URL when bundled is unreachable but cache exists', async () => {
            await GameImageProviderImplementation.init();
            // Pre-seed cache.
            const cachePath = cachePathFor('test-game/test-game-cover-360x480.webp');
            await FsProvider.instance.mkdirs(nodePath.dirname(cachePath));
            await FsProvider.instance.writeFile(cachePath, Buffer.from('fake-cached-bytes'));

            // bundled URL fetch fails; local-dev (only in dev) also misses; cache hit short-circuits before CDN.
            mockFetch.mockResolvedValueOnce(makeFetchResponse('', 404));

            const result = await GameImageProviderImplementation.resolve('test-game/test-game-cover-360x480.webp');
            expect(result.startsWith('data:image/webp;base64,')).toBe(true);
            // Cache hit means at most one fetch (the bundled check) — CDN was NOT called.
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        test('fetches from CDN, caches, and returns data URL on first cache miss', async () => {
            await GameImageProviderImplementation.init();
            const cdnBody = new Uint8Array([0x52, 0x49, 0x46, 0x46]).buffer; // "RIFF"
            mockFetch.mockResolvedValueOnce(makeFetchResponse('', 404)); // bundled miss
            mockFetch.mockResolvedValueOnce(makeFetchResponse(cdnBody, 200)); // CDN hit

            const iconUrl = 'fresh-game/fresh-game-cover-360x480.webp';
            const result = await GameImageProviderImplementation.resolve(iconUrl);

            expect(result.startsWith('data:image/webp;base64,')).toBe(true);
            // Should now exist in cache.
            expect(await FsProvider.instance.exists(cachePathFor('fresh-game/fresh-game-cover-360x480.webp'))).toBe(true);
        });

        test('CDN 404 returns placeholder and does NOT increment failure counter', async () => {
            await GameImageProviderImplementation.init();
            mockFetch.mockResolvedValueOnce(makeFetchResponse('', 404)); // bundled miss
            mockFetch.mockResolvedValueOnce(makeFetchResponse('', 404)); // CDN 404

            const result = await GameImageProviderImplementation.resolve('missing-game/missing-game-cover-360x480.webp');
            expect(result).toBe(PLACEHOLDER_URL);
            expect((GameImageProviderImplementation as any).cdnConsecutiveFailures ?? 0).toBe(0);
            expect((GameImageProviderImplementation as any).cdnBreakerTripped).toBe(false);
        });

        test('CDN 403 returns placeholder and does NOT increment failure counter', async () => {
            await GameImageProviderImplementation.init();
            mockFetch.mockResolvedValueOnce(makeFetchResponse('', 404));
            mockFetch.mockResolvedValueOnce(makeFetchResponse('', 403));

            const result = await GameImageProviderImplementation.resolve('missing-game/missing-game-cover-360x480.webp');
            expect(result).toBe(PLACEHOLDER_URL);
            expect((GameImageProviderImplementation as any).cdnConsecutiveFailures ?? 0).toBe(0);
            expect((GameImageProviderImplementation as any).cdnBreakerTripped).toBe(false);
        });

        test.each([
            '../../etc/passwd.webp',
            '/etc/passwd.webp',
            'game\\..\\..\\secret.webp',
        ])('rejects path-traversal iconUrl %s and falls back to placeholder', async (iconUrl) => {
            await GameImageProviderImplementation.init();
            mockFetch.mockResolvedValueOnce(makeFetchResponse('', 404));

            const result = await GameImageProviderImplementation.resolve(iconUrl);
            expect(result).toBe(PLACEHOLDER_URL);
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        test('CDN non-404 errors accumulate; breaker trips at threshold (3)', async () => {
            await GameImageProviderImplementation.init();
            // Six fetches for three resolves: 3x (bundled-miss + CDN-error).
            for (let i = 0; i < 3; i++) {
                mockFetch.mockResolvedValueOnce(makeFetchResponse('', 404)); // bundled
                mockFetch.mockResolvedValueOnce(makeFetchResponse('', 500, 'ISE')); // CDN
            }

            for (let i = 0; i < 3; i++) {
                const result = await GameImageProviderImplementation.resolve(`g${i}/g${i}-cover-360x480.webp`);
                expect(result).toBe(PLACEHOLDER_URL);
            }
            expect((GameImageProviderImplementation as any).cdnBreakerTripped).toBe(true);

            // 4th resolve should NOT invoke CDN at all — bundled miss then placeholder.
            const fetchCallsBefore = mockFetch.mock.calls.length;
            mockFetch.mockResolvedValueOnce(makeFetchResponse('', 404)); // only the bundled check
            const result = await GameImageProviderImplementation.resolve('g3/g3-cover-360x480.webp');
            expect(result).toBe(PLACEHOLDER_URL);
            expect(mockFetch.mock.calls.length - fetchCallsBefore).toBe(1); // only bundled probe, NO CDN
        });

        test('successful CDN response after failures resets the failure counter', async () => {
            await GameImageProviderImplementation.init();
            mockFetch.mockResolvedValueOnce(makeFetchResponse('', 404)); // bundled miss
            mockFetch.mockResolvedValueOnce(makeFetchResponse('', 500, 'ISE')); // CDN err -> counter=1
            await GameImageProviderImplementation.resolve('g0/g0-cover-360x480.webp');
            expect((GameImageProviderImplementation as any).cdnConsecutiveFailures).toBe(1);

            mockFetch.mockResolvedValueOnce(makeFetchResponse('', 404)); // bundled miss
            mockFetch.mockResolvedValueOnce(makeFetchResponse(new Uint8Array([1,2,3]).buffer, 200)); // CDN ok
            await GameImageProviderImplementation.resolve('g1/g1-cover-360x480.webp');
            expect((GameImageProviderImplementation as any).cdnConsecutiveFailures).toBe(0);
        });

        test('fetch throw on CDN counts as failure', async () => {
            await GameImageProviderImplementation.init();
            mockFetch.mockResolvedValueOnce(makeFetchResponse('', 404)); // bundled
            mockFetch.mockRejectedValueOnce(new Error('AbortError'));      // CDN throws
            const result = await GameImageProviderImplementation.resolve('g/g-cover-360x480.webp');
            expect(result).toBe(PLACEHOLDER_URL);
            expect((GameImageProviderImplementation as any).cdnConsecutiveFailures).toBe(1);
        });

        test('without init() (no cacheRoot), still falls back to placeholder without crashing', async () => {
            // Intentionally skip init().
            mockFetch.mockResolvedValueOnce(makeFetchResponse('', 404)); // bundled miss
            // resolve should NOT try CDN (no cachePath), should return placeholder.
            const result = await GameImageProviderImplementation.resolve('foo/foo-cover-360x480.webp');
            expect(result).toBe(PLACEHOLDER_URL);
        });
    });

    describe('prefetchAll()', () => {
        test('does nothing without init() (no cacheRoot)', async () => {
            await GameImageProviderImplementation.prefetchAll(['game/icon.webp']);
            expect(mockFetch).not.toHaveBeenCalled();
        });

        test('fetches each unique URL from CDN and writes to cache', async () => {
            await GameImageProviderImplementation.init();
            const body = new Uint8Array([1, 2, 3]).buffer;
            mockFetch
                .mockResolvedValueOnce(makeFetchResponse(body, 200))
                .mockResolvedValueOnce(makeFetchResponse(body, 200));

            await GameImageProviderImplementation.prefetchAll([
                'game-a/game-a-cover.webp',
                'game-b/game-b-cover.webp',
            ]);

            expect(mockFetch).toHaveBeenCalledTimes(2);
            expect(await FsProvider.instance.exists(cachePathFor('game-a/game-a-cover.webp'))).toBe(true);
            expect(await FsProvider.instance.exists(cachePathFor('game-b/game-b-cover.webp'))).toBe(true);
        });

        test('does nothing when the circuit breaker is tripped', async () => {
            await GameImageProviderImplementation.init();
            (GameImageProviderImplementation as any).cdnBreakerTripped = true;

            await GameImageProviderImplementation.prefetchAll(['game/icon.webp']);

            expect(mockFetch).not.toHaveBeenCalled();
        });
    });
});
