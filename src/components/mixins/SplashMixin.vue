<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

import RequestItem from '../../model/requests/RequestItem';
import type { PackageListChunks, PackageListIndex } from '../../store/modules/TsModsModule';


@Component
export default class SplashMixin extends Vue {
    heroTitle = '';
    heroType: string = 'primary';
    loadingText = '';
    requests: RequestItem[] = [];

    // Provide access to a request item, as item is not stored in a map.
    getRequestItem(name: string) {
        const item = this.requests.find((ri) => ri.getName() === name);

        if (item === undefined) {
            throw new Error(`Unknown RequestItem "${name}"`);
        }

        return item;
    }

    // Used to produce a single, combined, RequestItem.
    reduceRequests() {
        return this.requests.reduce((x, y) => x.merge(y));
    }

    resetRequestProgresses() {
        this.requests.forEach((request) => request.setProgress(0));
    }

    // Get the list of game-specific packages to exclude.
    async getExclusions() {
        this.loadingText = 'Connecting to GitHub repository';

        const showProgress = (progress: number) => {
            this.loadingText = 'Downloading exclusions';
            this.getRequestItem('ExclusionsList').setProgress(progress);
        };

        await this.$store.dispatch('tsMods/updateExclusions', showProgress);

        this.getRequestItem('ExclusionsList').setProgress(100);
    }

    // Wrapper to allow TSMM to inject telemetry gathering.
    async getThunderstoreMods() {
        await this._getThunderstoreMods();
    }

    // Get the list of Thunderstore mods from local cache or API.
    async _getThunderstoreMods() {
        const hasPriorCache = await this.doesGameHaveLocalCache();
        let hasUpdatedCache = false;

        if (!hasPriorCache) {
            const packageListIndex = await this.fetchPackageListIndex();
            const packageListChunks = await this.fetchPackageListChunksIfUpdated(packageListIndex);
            this.getRequestItem('ThunderstoreDownload').setProgress(100);
            hasUpdatedCache = await this.writeModsToPersistentCacheIfUpdated(packageListIndex, packageListChunks);
        }

        if (hasPriorCache || hasUpdatedCache) {
            await this.triggerStoreModListUpdate();
        }

        await this.moveToNextScreen();
    }

    /***
     * Query IndexedDB for an existing version of package list.
     */
    async doesGameHaveLocalCache(): Promise<boolean> {
        this.loadingText = 'Checking for mod list in local cache';
        let hasCache = false;

        try {
            hasCache = await this.$store.dispatch('tsMods/gameHasCachedModList');
        } catch (e) {
            console.error('SplashMixin failed to check mod list in local cache', e);
        }

        if (hasCache) {
            this.getRequestItem('ThunderstoreDownload').setProgress(100);
            this.getRequestItem('CacheOperations').setProgress(50);
            this.loadingText = 'Processing the mod list from cache';
        }

        return hasCache;
    }

    /***
     * Query Thunderstore API for the URLs pointing to parts of the package list.
     */
    async fetchPackageListIndex(): Promise<PackageListIndex|undefined> {
        this.loadingText = 'Checking for mod list updates from Thunderstore';

        try {
            return await this.$store.dispatch('tsMods/fetchPackageListIndex');
        } catch (e) {
            console.error('SplashMixin failed to fetch mod list index from API.', e);
            return undefined;
        }
    }

    /***
     * Load the package list in chunks pointed out by the packageListIndex.
     */
    async fetchPackageListChunksIfUpdated(packageListIndex?: PackageListIndex): Promise<PackageListChunks|undefined> {
        // Skip loading chunks if loading index failed.
        if (!packageListIndex) {
            return undefined;
        }

        const progressCallback = (progress: number) => {
            this.loadingText = 'Loading latest mod list from Thunderstore';
            this.getRequestItem('ThunderstoreDownload').setProgress(progress);
        };

        try {
            return await this.$store.dispatch(
                'tsMods/fetchPackageListChunks',
                {chunkUrls: packageListIndex.content, progressCallback}
            );
        } catch (e) {
            console.error('SplashMixin failed to fetch mod list from API.', e);
            return undefined;
        }
    }

    /***
     * Update a fresh package list to the IndexedDB cache.
     * Done only if a fresh list was loaded successfully from the API.
     */
    async writeModsToPersistentCacheIfUpdated(
        packageListIndex?: PackageListIndex,
        packageListChunks?: PackageListChunks
    ): Promise<boolean> {
        if (packageListIndex && packageListChunks) {
            this.loadingText = 'Storing the mod list into local cache';

            try {
                await this.$store.dispatch(
                    'tsMods/updatePersistentCache',
                    {indexHash: packageListIndex.hash, chunks: packageListChunks}
                );

                this.loadingText = 'Processing the mod list';
                this.getRequestItem('CacheOperations').setProgress(50);
                return true;
            } catch (e) {
                console.error('SplashMixin failed to cache mod list locally.', e);
            }
        }

        return false;
    }

    /***
     * Triggers Vuex store to read and parse the mod list from the
     * IndexedDB cache and to store it in memory.
     */
    async triggerStoreModListUpdate(): Promise<void> {
        try {
            await this.$store.dispatch('tsMods/updateMods');
        } catch (e) {
            console.error('Updating the store mod list by SplashMixin failed.', e);
        } finally {
            this.getRequestItem('CacheOperations').setProgress(100);
        }
    }

    async moveToNextScreen() {
        this.$router.push({name: 'profiles'});
    }
}
</script>
