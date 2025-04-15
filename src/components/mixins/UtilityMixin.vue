<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

import R2Error from '../../model/errors/R2Error';
import CdnProvider from '../../providers/generic/connection/CdnProvider';

@Component
export default class UtilityMixin extends Vue {
    readonly REFRESH_INTERVAL = 5 * 60 * 1000;
    private tsBackgroundRefreshFailed = false;

    hookBackgroundUpdateThunderstoreModList() {
        setInterval(this.backgroundRefreshThunderstoreModList, this.REFRESH_INTERVAL);
    }

    /**
     * Periodically refresh the Thunderstore mod list in the background.
     *
     * Thunderstore's Sentry gets regular errors about this failing with
     * HTTP status code 0. The assumption is that it's caused by users
     * closing the window while update is in progress. Ignore the first
     * failure to see how this affects the number of reported errors.
     */
    private async backgroundRefreshThunderstoreModList() {
        // Don't do background update on index route since the game
        // isn't really chosen yet, nor in the splash screen since it
        // proactively updates the package list.
        const exemptRoutes = ["index", "splash"];

        if (this.$route.name && exemptRoutes.includes(this.$route.name)) {
            return;
        }

        await this.$store.dispatch("tsMods/syncPackageList");

        if (this.$store.state.tsMods.thunderstoreModListUpdateError) {
            if (this.tsBackgroundRefreshFailed) {
                console.error("Two consecutive background refresh attempts failed");
                throw this.$store.state.tsMods.thunderstoreModListUpdateError;
            }

            this.tsBackgroundRefreshFailed = true;
            return;
        }

        this.tsBackgroundRefreshFailed = false;
    }

    /**
     * Set internal state of CdnProvider to prefer a mirror CDN if the
     * main CDN is unreachable.
     */
    async checkCdnConnection() {
        try {
            await CdnProvider.fetchCdnDefinitions();
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
