<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

import R2Error from '../../model/errors/R2Error';
import CdnProvider from '../../providers/generic/connection/CdnProvider';
import ConnectionProvider from '../../providers/generic/connection/ConnectionProvider';
import { isCanceledByRequest, isNetworkError } from '../../utils/HttpUtils';

@Component
export default class UtilityMixin extends Vue {
    readonly REFRESH_INTERVAL = 5 * 60 * 1000;
    private tsRefreshFailed = false;
    private tsRefreshInterval: NodeJS.Timeout|undefined;

    hookThunderstoreModListRefresh() {
        this.tsRefreshInterval = setInterval(
            this.tryRefreshThunderstoreModList,
            this.REFRESH_INTERVAL
        );
    }

    async refreshThunderstoreModList() {
        const response = await ConnectionProvider.instance.getPackages(this.$store.state.activeGame);
        await this.$store.dispatch("tsMods/updatePersistentCache", response.data);
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
                // Turn off the background update process after two consecutive
                // attempts have failed, as assumably further retries would just
                // drain resources and possibly cause other issues with little
                // hope of succeeding.
                clearInterval(this.tsRefreshInterval);
                this.tsRefreshInterval = undefined;

                this.$store.commit("error/handleError", new R2Error(
                    "Background updates halted",
                    `Two consecutive attempts to update the online mod list on the
                     background have failed, and the background update has been
                     disabled. You can continue to use the app, but the online mod
                     list won't be updated automatically anymore. Error code: "${e}"`,
                    "Restart the app to reactivate the background update."
                ));

                // Rethrow non-trivial errors to get them logged.
                if (!isCanceledByRequest(e) && !isNetworkError(e)) {
                    throw e;
                }
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
