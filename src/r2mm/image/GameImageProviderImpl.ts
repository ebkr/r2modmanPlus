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
const LOCAL_DEV_ASSET_BASE = "/_local-assets";
const CDN_FETCH_TIMEOUT_MS = 10000;
const CDN_BREAKER_THRESHOLD = 3;
const CACHE_SUBDIR = "image-cache";

class GameImageProviderImpl implements GameImageProvider {

    private cacheRoot: string | undefined;
    private cdnConsecutiveFailures = 0;
    private cdnBreakerTripped = false;

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

        const bundledUrl = this.bundledUrlFor(iconUrl);
        if (await this.urlReachable(bundledUrl)) {
            return bundledUrl;
        }

        if (import.meta.env.MODE === "development") {
            const localUrl = `${LOCAL_DEV_ASSET_BASE}/${iconUrl}`;
            if (await this.urlReachable(localUrl)) {
                return localUrl;
            }
        }

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

    private bundledUrlFor(iconUrl: string): string {
        return ProtocolProvider.getPublicAssetUrl(`${BUNDLED_ASSET_DIR}/${iconUrl}`);
    }

    private async urlReachable(url: string): Promise<boolean> {
        return fetch(url).then(res => res.ok).catch(() => false);
    }

    private cachePathFor(iconUrl: string): string | undefined {
        if (!this.cacheRoot) {
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

        if (res.status === 404) {
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
