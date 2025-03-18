<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

import RequestItem from '../../model/requests/RequestItem';
import type { PackageListIndex } from '../../store/modules/TsModsModule';


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

    // Wrapper to allow TSMM to inject telemetry gathering.
    async getThunderstoreMods() {
        await this._getThunderstoreMods();
    }

    // Get the list of Thunderstore mods from local cache or API.
    async _getThunderstoreMods() {
        this.$store.commit('tsMods/startThunderstoreModListUpdate');
        const hasPriorCache = await this.doesGameHaveLocalCache();

        if (!hasPriorCache) {
            const packageListIndex = await this.fetchPackageListIndex();
            const areAllChunksProcessedSuccessfully = await this.fetchPackageListChunksIfUpdated(packageListIndex);
            await this.pruneRemovedMods(packageListIndex, areAllChunksProcessedSuccessfully);
        }

        await this.triggerStoreModListUpdate();
        this.$store.commit('tsMods/finishThunderstoreModListUpdate');

        if (hasPriorCache) {
            // We want this to trigger in the background to ensure that the user gets an up-to-date modlist as soon as possible.
            this.$store.dispatch('tsMods/syncPackageList');
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
            this.getRequestItem('PackageListIndex').setProgress(100);
            this.getRequestItem('PackageListChunks').setProgress(100);
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
        } finally {
            this.getRequestItem('PackageListIndex').setProgress(100);
        }
    }

    /***
     * Load the package list chunks pointed out by the packageListIndex.
     * Chunks are stored in IndexedDB for persistent caching
     */
    async fetchPackageListChunksIfUpdated(packageListIndex?: PackageListIndex): Promise<boolean> {
        // Skip loading chunks if loading index failed.
        if (!packageListIndex) {
            return false;
        }

        this.loadingText = 'Loading latest mod list from Thunderstore';

        const progressCallback = (progress: number) => {
            this.getRequestItem('PackageListChunks').setProgress(progress);
        };

        try {
            return await this.$store.dispatch(
                'tsMods/fetchAndCachePackageListChunks',
                {packageListIndex, progressCallback}
            );
        } catch (e) {
            console.error('SplashMixin failed to fetch mod list from API.', e);
            return false;
        } finally {
            progressCallback(100);
        }
    }

    /***
     * Delete mods no longer returned by the Thunderstore API from the IndexedDB cache.
     */
    async pruneRemovedMods(
        packageListIndex?: PackageListIndex,
        areAllChunksProcessedSuccessfully?: boolean
    ): Promise<void> {
        // Deletion depends on all mods in the persistent cache having a fresh
        // timestamp, which isn't the case if one or more chunks failed to be
        // downloaded or processed.
        if (!packageListIndex || !areAllChunksProcessedSuccessfully) {
            return;
        }

        this.loadingText = 'Pruning removed mods from local cache';

        try {
            await this.$store.dispatch('tsMods/pruneRemovedModsFromCache', packageListIndex.dateFetched);
        } catch (e) {
            console.error('SplashMixin failed to delete outdated mods from local cache.', e);
        }
    }

    /***
     * Triggers Vuex store to read and parse the mod list from the
     * IndexedDB cache and to store it in memory.
     */
    async triggerStoreModListUpdate(): Promise<void> {
        this.loadingText = 'Processing the mod list';

        try {
            await this.$store.dispatch('tsMods/updateMods');
        } catch (e) {
            console.error('Updating the store mod list by SplashMixin failed.', e);
        } finally {
            this.getRequestItem('Vuex').setProgress(100);
        }
    }

    async moveToNextScreen() {
        this.$router.push({name: 'profiles'});
    }
}
</script>
