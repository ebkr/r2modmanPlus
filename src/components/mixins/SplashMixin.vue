<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

import ApiResponse from '../../model/api/ApiResponse';
import GameManager from '../../model/game/GameManager';
import RequestItem from '../../model/requests/RequestItem';
import ConnectionProvider from '../../providers/generic/connection/ConnectionProvider';
import ThunderstorePackages from '../../r2mm/data/ThunderstorePackages';
import ApiCacheUtils from '../../utils/ApiCacheUtils';

@Component
export default class SplashMixin extends Vue {
    activeGame = GameManager.activeGame;
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

    // Get the list of game-specific packages to exclude.
    async getExclusions() {
        this.loadingText = 'Connecting to GitHub repository';

        const showProgress = (progress: number) => {
            this.loadingText = 'Downloading exclusions';
            this.getRequestItem('ExclusionsList').setProgress(progress);
        };

        ThunderstorePackages.EXCLUSIONS = await ConnectionProvider.instance.getExclusions(showProgress);
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
            response = await ConnectionProvider.instance.getPackages(this.activeGame, showProgress, 3);
        } catch (e) {
            this.isOffline = true;
            this.heroTitle = 'Failed to get mods from Thunderstore';
            this.loadingText = 'You may be offline or Thunderstore is unavailabe. Checking cache.';
        } finally {
            this.getRequestItem('ThunderstoreDownload').setProgress(100);
        }

        if (response) {
            ApiCacheUtils.storeLastRequest(response.data);
        } else {
            const cachedResponse = await ApiCacheUtils.getLastRequest();
            response = cachedResponse ? { data: cachedResponse.payload } : undefined;
        }

        if (response) {
            ThunderstorePackages.handlePackageApiResponse(response);
            await this.$store.dispatch('updateThunderstoreModList', ThunderstorePackages.PACKAGES);
            await this.moveToNextScreen();
        } else {
            this.heroTitle = 'Failed to get mods from Thunderstore and cache';
            this.loadingText = 'You may be offline or Thunderstore is unavailabe. However, you may still use the manager offline.';
        }
    }

    async continueOffline() {
        ThunderstorePackages.PACKAGES = [];
        await this.moveToNextScreen();
    }

    async moveToNextScreen() {
        this.$router.push({name: 'profiles'});
    }
}
</script>
