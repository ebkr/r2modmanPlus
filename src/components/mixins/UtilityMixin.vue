<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

import R2Error from '../../model/errors/R2Error';
import GameManager from '../../model/game/GameManager';
import Profile from '../../model/Profile';
import ThunderstorePackages from '../../r2mm/data/ThunderstorePackages';
import ThunderstoreSchema from '../../r2mm/data/ThunderstoreSchema';
import ProfileModList from '../../r2mm/mods/ProfileModList';
import ApiCacheUtils from '../../utils/ApiCacheUtils';

@Component
export default class UtilityMixin extends Vue {
    readonly REFRESH_INTERVAL = 5 * 60 * 1000;
    readonly FILTER_REFRESH_MODIFIER = 4;
    private tsRefreshFailed = false;

    hookProfileModListRefresh() {
        setInterval(this.refreshProfileModList, this.REFRESH_INTERVAL);
    }

    hookThunderstoreModListRefresh() {
        setInterval(this.tryRefreshThunderstoreModList, this.REFRESH_INTERVAL);
    }

    hookThunderstoreSectionFilterRefresh() {
        setInterval(this.refreshThunderstoreSectionFilter, this.REFRESH_INTERVAL * this.FILTER_REFRESH_MODIFIER);
    }

    async refreshProfileModList() {
        const profile = Profile.getActiveProfile();

        // If no profile is selected on game selection then getActiveProfile will return undefined.
        if (profile === undefined) {
            return;
        }

        const modList = await ProfileModList.getModList(profile);

        if (!(modList instanceof R2Error)) {
            this.$store.dispatch("updateModList", modList);
        }
    }

    async refreshThunderstoreModList() {
        const response = await ThunderstorePackages.update(GameManager.activeGame);
        await ApiCacheUtils.storeLastRequest(response.data);
        await this.$store.dispatch("updateThunderstoreModList", ThunderstorePackages.PACKAGES);
    }

    async refreshThunderstoreSectionFilter() {
        const response = await ThunderstoreSchema.update(GameManager.activeGame);
        await ApiCacheUtils.storeLastRequest(response.data);
        if (ThunderstoreSchema.GAME_SCHEMA !== null) {
            await this.$store.dispatch("updateThunderstoreSectionFilter", ThunderstoreSchema.GAME_SCHEMA.sections);
        }
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
}
</script>
