import buffer from '../../node/buffer/buffer';
import path from '../../node/path/path';
import CdnProvider from '../connection/CdnProvider';
import FsProvider from '../file/FsProvider';
import PathResolver from '../../../r2mm/manager/PathResolver';

const BUNDLED_PROTOCOL_PREFIX = "public://images/game_selection/";
const PLACEHOLDER_URL = `${BUNDLED_PROTOCOL_PREFIX}thunderstore-beta.webp`;
const LOCALHOST_DEV_BASE = "http://localhost:1337";
const LOCALHOST_PROBE_TIMEOUT_MS = 2000;
const CDN_FETCH_TIMEOUT_MS = 10000;
const CDN_BREAKER_THRESHOLD = 3;
const CACHE_SUBDIR = "image-cache";

export default class GameImageProvider {

    private static cacheRoot: string | undefined;
    private static localhostAvailable = false;
    private static cdnConsecutiveFailures = 0;
    private static cdnBreakerTripped = false;
    private static initialised: Promise<void> | undefined;

    public static get placeholderUrl(): string {
        return PLACEHOLDER_URL;
    }

    public static async resolve(iconUrl: string): Promise<string> {
        await GameImageProvider.ensureInit();

        if (!iconUrl) {
            return PLACEHOLDER_URL;
        }

        const bundledUrl = `${BUNDLED_PROTOCOL_PREFIX}${iconUrl}`;
        if (await GameImageProvider.urlReachable(bundledUrl)) {
            return bundledUrl;
        }

        if (GameImageProvider.localhostAvailable) {
            const localhostUrl = `${LOCALHOST_DEV_BASE}/assets/${iconUrl}`;
            if (await GameImageProvider.urlReachable(localhostUrl)) {
                return localhostUrl;
            }
        }

        const cachePath = GameImageProvider.cachePathFor(iconUrl);
        if (cachePath && await FsProvider.instance.exists(cachePath)) {
            return GameImageProvider.fileUrlOf(cachePath);
        }

        if (cachePath && !GameImageProvider.cdnBreakerTripped) {
            const cached = await GameImageProvider.fetchFromCdnAndCache(iconUrl, cachePath);
            if (cached) {
                return cached;
            }
        }

        return PLACEHOLDER_URL;
    }

    private static ensureInit(): Promise<void> {
        if (!GameImageProvider.initialised) {
            GameImageProvider.initialised = GameImageProvider.runInit();
        }
        return GameImageProvider.initialised;
    }

    private static async runInit(): Promise<void> {
        if (PathResolver.APPDATA_DIR) {
            const root = path.join(PathResolver.APPDATA_DIR, CACHE_SUBDIR);
            await FsProvider.instance.mkdirs(root);
            GameImageProvider.cacheRoot = root;
        }

        if (import.meta.env.MODE === "development") {
            GameImageProvider.localhostAvailable = await GameImageProvider.probeLocalhost();
        }
    }

    private static async probeLocalhost(): Promise<boolean> {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), LOCALHOST_PROBE_TIMEOUT_MS);
        try {
            const res = await fetch(`${LOCALHOST_DEV_BASE}/healthz`, { signal: controller.signal });
            return res.ok;
        } catch {
            return false;
        } finally {
            clearTimeout(timer);
        }
    }

    private static async urlReachable(url: string): Promise<boolean> {
        try {
            const res = await fetch(url);
            return res.ok;
        } catch {
            return false;
        }
    }

    private static cachePathFor(iconUrl: string): string | undefined {
        if (!GameImageProvider.cacheRoot) {
            return undefined;
        }
        return path.join(GameImageProvider.cacheRoot, ...iconUrl.split("/"));
    }

    private static fileUrlOf(filePath: string): string {
        return `file:///${filePath.replace(/\\/g, "/")}`;
    }

    private static async fetchFromCdnAndCache(iconUrl: string, cachePath: string): Promise<string | undefined> {
        const cdnUrl = CdnProvider.cdnUrlFor(`assets/${iconUrl}`);
        if (!cdnUrl) {
            return undefined;
        }

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), CDN_FETCH_TIMEOUT_MS);
        let res: Response;
        try {
            res = await fetch(cdnUrl, { signal: controller.signal });
        } catch {
            GameImageProvider.recordCdnFailure();
            return undefined;
        } finally {
            clearTimeout(timer);
        }

        if (res.status === 404) {
            GameImageProvider.cdnConsecutiveFailures = 0;
            return undefined;
        }
        if (!res.ok) {
            GameImageProvider.recordCdnFailure();
            return undefined;
        }

        try {
            const arrayBuffer = await res.arrayBuffer();
            await FsProvider.instance.mkdirs(path.dirname(cachePath));
            await FsProvider.instance.writeFile(cachePath, buffer.from(arrayBuffer));
            GameImageProvider.cdnConsecutiveFailures = 0;
            return GameImageProvider.fileUrlOf(cachePath);
        } catch {
            GameImageProvider.recordCdnFailure();
            return undefined;
        }
    }

    private static recordCdnFailure(): void {
        GameImageProvider.cdnConsecutiveFailures += 1;
        if (GameImageProvider.cdnConsecutiveFailures >= CDN_BREAKER_THRESHOLD) {
            GameImageProvider.cdnBreakerTripped = true;
        }
    }
}
