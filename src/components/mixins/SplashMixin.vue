<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

import R2Error from '../../model/errors/R2Error';
import RequestItem from '../../model/requests/RequestItem';
import type { PackageListChunks } from '../../store/modules/TsModsModule';


@Component
export default class SplashMixin extends Vue {
    heroTitle = '';
    heroType: string = 'is-info';
    isOffline = false;
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

    // Get the list of Thunderstore mods from API or local cache.
    async getThunderstoreMods() {
        const packageListChunks = await this.fetchPackageListChunksIfUpdated();
        this.getRequestItem('ThunderstoreDownload').setProgress(100);
        await this.writeModsToPersistentCacheIfUpdated(packageListChunks);
        const isModListLoaded = await this.readModsToVuex();

        // To proceed, the loading of the mod list should result in a non-empty list.
        // Empty list is allowed if that's actually what the API returned.
        const modListHasMods = this.$store.state.tsMods.mods.length;
        const apiReturnedEmptyList = packageListChunks && packageListChunks[0].length === 0;
        if (isModListLoaded && (modListHasMods || apiReturnedEmptyList)) {
            await this.moveToNextScreen();
        } else {
            this.heroTitle = 'Failed to get the list of online mods';
            this.loadingText = 'You may still use the manager offline, but some features might be unavailable.';
            this.isOffline = true;
        }
    }

    /***
     * Load the package list in chunks.
     * Fails silently to fallback reading the old values from the IndexedDB cache.
     */
    async fetchPackageListChunksIfUpdated(): Promise<PackageListChunks|undefined> {

        const showProgress = (progress: number) => {
            this.loadingText = 'Loading latest mod list from Thunderstore';
            this.getRequestItem('ThunderstoreDownload').setProgress(progress);
        };

        try {
            return await this.$store.dispatch('tsMods/fetchPackageListChunks', showProgress);
        } catch (e) {
            console.error('SplashMixin failed to fetch mod list from API.', e);
            return undefined;
        }
    }

    /***
     * Update a fresh package list to the IndexedDB cache.
     * Done only if the package list was loaded successfully.
     * Fails silently to fallback reading the old values from the IndexedDB cache.
     */
    async writeModsToPersistentCacheIfUpdated(packageListChunks?: PackageListChunks) {
        if (packageListChunks) {
            this.loadingText = 'Storing the mod list into local cache';

            try {
                await this.$store.dispatch('tsMods/updatePersistentCache', packageListChunks)
            } catch (e) {
                console.error('SplashMixin failed to cache mod list locally.', e);
            }

            this.loadingText = 'Processing the mod list';
        } else {
            this.loadingText = 'Processing the mod list from cache';
        }

        this.getRequestItem('CacheOperations').setProgress(50);
    }

    /***
     * Read mod list from the IndexedDB cache to Vuex so it's kept in memory.
     * Always read from the IndexedDB since we don't know if the mod list was
     * queried from the API successfully or not. This also handles the type
     * casting, since mod manager expects the data to be formatted into objects.
     *
     * Return value is used to tell whether Vuex might contain an empty list
     * after calling this because there was an error, or because the package
     * list is actually empty.
     *
     * Failure at this point is no longer silently ignored, instead an error
     * modal is shown.
     */
    async readModsToVuex(): Promise<boolean> {
        let isModListLoaded = false;

        try {
            await this.$store.dispatch('tsMods/updateMods');
            isModListLoaded = true;
        } catch (e) {
            this.$store.commit(
                'error/handleError',
                R2Error.fromThrownValue(e, `${this.loadingText} failed`)
            );
        } finally {
            this.getRequestItem('CacheOperations').setProgress(100);
            return isModListLoaded;
        }
    }

    async continueOffline() {
        await this.moveToNextScreen();
    }

    async moveToNextScreen() {
        this.$router.push({name: 'profiles'});
    }
}
</script>
