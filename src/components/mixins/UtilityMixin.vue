<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

import R2Error from '../../model/errors/R2Error';
import GameManager from '../../model/game/GameManager';
import Profile from '../../model/Profile';
import CdnProvider from '../../providers/generic/connection/CdnProvider';
import ThunderstorePackages from '../../r2mm/data/ThunderstorePackages';
import ProfileModList from '../../r2mm/mods/ProfileModList';
import ApiCacheUtils from '../../utils/ApiCacheUtils';

@Component
export default class UtilityMixin extends Vue {
    readonly REFRESH_INTERVAL = 5 * 60 * 1000;
    private tsRefreshFailed = false;

    hookProfileModListRefresh() {
        setInterval(this.refreshProfileModList, this.REFRESH_INTERVAL);
    }

    hookThunderstoreModListRefresh() {
        setInterval(this.tryRefreshThunderstoreModList, this.REFRESH_INTERVAL);
    }

    async refreshProfileModList() {
        const profile = Profile.getActiveProfile();

        // If no profile is selected on game selection then getActiveProfile will return undefined.
        if (profile === undefined) {
            return;
        }

        const modList = await ProfileModList.getModList(profile);

        if (!(modList instanceof R2Error)) {
            await this.$store.dispatch("profile/updateModList", modList);
        }
    }

    async refreshThunderstoreModList() {
        // Don't do background update on index route since the game
        // isn't really chosen yet, nor in the splash screen since it
        // proactively updates the package list.
        const exemptRoutes = ["index", "splash"];

        if (this.$route.name && exemptRoutes.includes(this.$route.name)) {
            return;
        }

        const response = await ThunderstorePackages.update(GameManager.activeGame);
        await ApiCacheUtils.storeLastRequest(response.data);
        await this.$store.dispatch("updateThunderstoreModList", ThunderstorePackages.PACKAGES);
    }

    /**
     * Thunderstore's Sentry gets regular errors about this failing with
     * HTTP status code 0. The assumption is that it's caused by users
     * closing the window while update is in progress. Ignore the first
     * failure to see how this affects the number of reported errors.
     */
    private async tryRefreshThunderstoreModList() {
        try {
            await this.refreshThunderstoreModList();
        } catch (e) {
            if (this.tsRefreshFailed) {
                console.error("Two consecutive background refresh attempts failed");
                throw e;
            }

            this.tsRefreshFailed = true;
            return;
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
