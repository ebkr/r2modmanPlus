<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

import R2Error from '../../model/errors/R2Error';
import GameManager from '../../model/game/GameManager';
import Profile from '../../model/Profile';
import ThunderstorePackages from '../../r2mm/data/ThunderstorePackages';
import ProfileModList from '../../r2mm/mods/ProfileModList';
import ApiCacheUtils from '../../utils/ApiCacheUtils';

@Component
export default class UtilityMixin extends Vue {
    readonly REFRESH_INTERVAL = 5 * 60 * 1000;

    hookProfileModListRefresh() {
        setInterval(this.refreshProfileModList, this.REFRESH_INTERVAL);
    }

    hookThunderstoreModListRefresh() {
        setInterval(this.refreshThunderstoreModList, this.REFRESH_INTERVAL);
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
}
</script>
