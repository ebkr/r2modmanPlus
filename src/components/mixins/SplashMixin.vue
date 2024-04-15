<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

import ApiResponse from '../../model/api/ApiResponse';
import RequestItem from '../../model/requests/RequestItem';
import ConnectionProvider from '../../providers/generic/connection/ConnectionProvider';

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

    // Get the list of Thunderstore mods from API.
    async getThunderstoreMods() {
        this.loadingText = 'Connecting to Thunderstore';
        let response: ApiResponse|undefined = undefined;

        const showProgress = (progress: number) => {
            this.loadingText = 'Getting mod list from Thunderstore';
            this.getRequestItem('ThunderstoreDownload').setProgress(progress);
        };

        try {
            response = await ConnectionProvider.instance.getPackages(this.$store.state.activeGame, showProgress, 3);
        } catch (e) {
            // No-op
        } finally {
            this.getRequestItem('ThunderstoreDownload').setProgress(100);
        }

        if (response) {
            this.heroTitle = 'Received mod list from Thunderstore';
            this.loadingText = 'Caching the mod list locally';

            await this.$store.dispatch('tsMods/updatePersistentCache', response.data);

            this.loadingText = 'Processing the mod list';
        } else {
            this.heroTitle = 'Failed to get mods from Thunderstore';
            this.loadingText = 'You may be offline or Thunderstore is unavailabe. Checking cache.';
        }

        this.getRequestItem('CacheOperations').setProgress(50);
        await this.$store.dispatch('tsMods/updateMods');
        this.getRequestItem('CacheOperations').setProgress(100);

        if (this.$store.state.tsMods.modsLastUpdated === undefined) {
            this.heroTitle = 'Failed to get mods from Thunderstore and cache';
            this.loadingText = 'You may be offline or Thunderstore is unavailabe. However, you may still use the manager offline.';
            this.isOffline = true;
        } else {
            await this.moveToNextScreen();
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
