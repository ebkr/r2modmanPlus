<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

import R2Error from '../../model/errors/R2Error';
import CdnProvider from '../../providers/generic/connection/CdnProvider';
import { PackageListIndex } from '../../store/modules/TsModsModule';

@Component
export default class UtilityMixin extends Vue {
    readonly REFRESH_INTERVAL = 5 * 60 * 1000;
    private tsRefreshFailed = false;

    hookThunderstoreModListRefresh() {
        setInterval(this.tryRefreshThunderstoreModList, this.REFRESH_INTERVAL);
    }

    async refreshThunderstoreModList() {
        const packageListIndex: PackageListIndex = await this.$store.dispatch("tsMods/fetchPackageListIndex");

        if (packageListIndex.isLatest) {
            return;
        }

        const packageListChunks = await this.$store.dispatch(
            "tsMods/fetchPackageListChunks",
            {chunkUrls: packageListIndex.content},
        );
        await this.$store.dispatch(
            "tsMods/updatePersistentCache",
            {chunks: packageListChunks, indexHash: packageListIndex.hash},
        );
        await this.$store.dispatch("tsMods/updateMods");
        await this.$store.dispatch("profile/tryLoadModListFromDisk");
        await this.$store.dispatch("tsMods/prewarmCache");
    }

    /**
     * Thunderstore's Sentry gets regular errors about this failing with
     * HTTP status code 0. The assumption is that it's caused by users
     * closing the window while update is in progress. Ignore the first
     * failure to see how this affects the number of reported errors.
     */
    private async tryRefreshThunderstoreModList() {
        // Don't do background update on index route since the game
        // isn't really chosen yet, nor in the splash screen since it
        // proactively updates the package list.
        const exemptRoutes = ["index", "splash"];

        if (this.$route.name && exemptRoutes.includes(this.$route.name)) {
            return;
        }

        if (this.$store.state.tsMods.isBackgroundUpdateInProgress) {
            return;
        }

        try {
            this.$store.commit("tsMods/startBackgroundUpdate");
            await this.refreshThunderstoreModList();
        } catch (e) {
            if (this.tsRefreshFailed) {
                console.error("Two consecutive background refresh attempts failed");
                throw e;
            }

            this.tsRefreshFailed = true;
            return;
        } finally {
            this.$store.commit("tsMods/finishBackgroundUpdate");
        }

        this.tsRefreshFailed = false;
    }

    /**
     * Set internal state of CdnProvider to prefer a mirror CDN if the
     * main CDN is unreachable.
     */
    async checkCdnConnection() {
        try {
            await CdnProvider.checkCdnConnection();
        } catch (error: unknown) {
            if (error instanceof R2Error) {
                this.$store.commit('error/handleError', error);
            } else {
                console.error(error);
            }
        }
    }
}
</script>
