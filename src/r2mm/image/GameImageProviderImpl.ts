import buffer from '../../providers/node/buffer/buffer';
import path from '../../providers/node/path/path';
import CdnProvider from '../../providers/generic/connection/CdnProvider';
import FsProvider from '../../providers/generic/file/FsProvider';
import { GameImageProvider } from '../../providers/generic/image/GameImageProvider';
import LoggerProvider, { LogSeverity } from '../../providers/ror2/logging/LoggerProvider';
import PathResolver from '../manager/PathResolver';
import ProtocolProvider from '../../providers/generic/protocol/ProtocolProvider';

const BUNDLED_ASSET_DIR = "/images/game_selection";
const PLACEHOLDER_FILE = "placeholder.webp";
const CDN_ASSET_BASE = "https://gcdn.thunderstore.io/assets";
const LOCAL_DEV_ASSET_BASE = "/_local/assets";
const CDN_FETCH_TIMEOUT_MS = 10000;
const CDN_BREAKER_THRESHOLD = 3;
const CACHE_SUBDIR = "image-cache";

class GameImageProviderImpl implements GameImageProvider {

    private cacheRoot: string | undefined;
    private cdnConsecutiveFailures = 0;
    private cdnBreakerTripped = false;
    private resolveCache = new Map<string, string>();

    public async init(): Promise<void> {
        if (PathResolver.APPDATA_DIR) {
            const root = path.join(PathResolver.APPDATA_DIR, CACHE_SUBDIR);
            await FsProvider.instance.mkdirs(root);
            this.cacheRoot = root;
        }
    }

    public get placeholderUrl(): string {
        return this.bundledUrlFor(PLACEHOLDER_FILE);
    }

    public async resolve(iconUrl: string): Promise<string> {
        if (!iconUrl) {
            return this.placeholderUrl;
        }

        const memoryCached = this.resolveCache.get(iconUrl);
        if (memoryCached !== undefined) {
            return memoryCached;
        }

        let result: string;

        const bundledUrl = this.bundledUrlFor(iconUrl);
        if (await this.urlReachable(bundledUrl)) {
            result = bundledUrl;
        } else if (import.meta.env.MODE === "development") {
            const localUrl = `${LOCAL_DEV_ASSET_BASE}/${iconUrl}`;
            if (await this.urlReachable(localUrl)) {
                result = localUrl;
            } else {
                result = await this.resolveFromCacheOrCdn(iconUrl);
            }
        } else {
            result = await this.resolveFromCacheOrCdn(iconUrl);
        }

        this.resolveCache.set(iconUrl, result);
        return result;
    }

    private async resolveFromCacheOrCdn(iconUrl: string): Promise<string> {
        const cachePath = this.cachePathFor(iconUrl);
        if (cachePath && await FsProvider.instance.exists(cachePath)) {
            return await this.dataUrlFromFile(cachePath);
        }

        if (cachePath && !this.cdnBreakerTripped) {
            const cached = await this.fetchFromCdnAndCache(iconUrl, cachePath);
            if (cached) {
                return cached;
            }
        }

        return this.placeholderUrl;
    }

    public async prefetchAll(iconUrls: string[]): Promise<void> {
        if (!this.cacheRoot || this.cdnBreakerTripped) {
            return;
        }
        const unique = [...new Set(iconUrls.filter(Boolean))];
        await Promise.allSettled(unique.map(iconUrl => this.prefetchOne(iconUrl)));
    }

    private async prefetchOne(iconUrl: string): Promise<void> {
        if (this.cdnBreakerTripped) {
            return;
        }
        const cachePath = this.cachePathFor(iconUrl);
        if (cachePath) {
            await this.fetchFromCdnAndCache(iconUrl, cachePath);
        }
    }

    private bundledUrlFor(iconUrl: string): string {
        return ProtocolProvider.getPublicAssetUrl(`${BUNDLED_ASSET_DIR}/${iconUrl}`);
    }

    private async urlReachable(url: string): Promise<boolean> {
        return fetch(url).then(res => {
            if (!res.ok) {
                return false;
            }
            const contentType = res.headers.get("content-type") ?? "";
            return !contentType.includes("text/html");
        }).catch(() => false);
    }

    private cachePathFor(iconUrl: string): string | undefined {
        if (!this.cacheRoot) {
            return undefined;
        }
        if (iconUrl.includes("..") || iconUrl.startsWith("/") || iconUrl.includes("\\")) {
            return undefined;
        }
        return path.join(this.cacheRoot, ...iconUrl.split("/"));
    }

    private async dataUrlFromFile(filePath: string): Promise<string> {
        const content = await FsProvider.instance.base64FromZip(filePath);
        return `data:image/webp;base64,${content}`;
    }

    private async fetchFromCdnAndCache(iconUrl: string, cachePath: string): Promise<string | undefined> {
        const cdnUrl = CdnProvider.replaceCdnHost(`${CDN_ASSET_BASE}/${iconUrl}`);

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), CDN_FETCH_TIMEOUT_MS);
        let res: Response;
        try {
            res = await fetch(cdnUrl, { signal: controller.signal });
        } catch (e) {
            this.recordCdnFailure(`fetch threw for ${cdnUrl}: ${(e as Error).message}`);
            return undefined;
        } finally {
            clearTimeout(timer);
        }

        if (res.status === 404 || res.status === 403) {
            this.cdnConsecutiveFailures = 0;
            return undefined;
        }
        if (!res.ok) {
            this.recordCdnFailure(`${res.status} ${res.statusText} on ${cdnUrl}`);
            return undefined;
        }

        try {
            const arrayBuffer = await res.arrayBuffer();
            await FsProvider.instance.mkdirs(path.dirname(cachePath));
            await FsProvider.instance.writeFile(cachePath, buffer.from(arrayBuffer));
            this.cdnConsecutiveFailures = 0;
            return await this.dataUrlFromFile(cachePath);
        } catch (e) {
            this.recordCdnFailure(`Failed to cache ${cdnUrl}: ${(e as Error).message}`);
            return undefined;
        }
    }

    private recordCdnFailure(detail: string): void {
        this.cdnConsecutiveFailures += 1;
        LoggerProvider.instance.Log(LogSeverity.ERROR, `GameImage CDN fetch failed: ${detail}`);
        if (this.cdnConsecutiveFailures >= CDN_BREAKER_THRESHOLD) {
            this.cdnBreakerTripped = true;
        }
    }

}

export const GameImageProviderImplementation: GameImageProvider = new GameImageProviderImpl();
