<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import ManagerInformation from '../_managerinf/ManagerInformation';

@Component({})
export default class ModListUpdateBanner extends Vue {
    updateError = '';

    get appName(): string {
        return ManagerInformation.APP_NAME;
    }

    get isModListLoaded(): boolean {
        return this.$store.state.tsMods.modsLastUpdated !== undefined;
    }

    get isUpdateInProgress(): boolean {
        return this.$store.state.tsMods.isThunderstoreModListUpdateInProgress;
    }

    @Watch('isUpdateInProgress')
    onLoadingProgressChange(newVal: boolean, oldVal: boolean) {
        // React to background update as well as the manual update from the banner.
        if (!oldVal && newVal) {
            this.updateError = '';
        }
    }

    async updateModList() {
        if (this.isUpdateInProgress) {
            return;
        }

        this.$store.commit('tsMods/startThunderstoreModListUpdate');
        this.updateError = '';

        try {
            // Invalidate hash to force a refresh. Otherwise a scenario where
            // the latest index hash is already present in IndexedDB but loading
            // the package list into Vuex store has failed would cause the banner
            // to just disappear when fetchAndProcessPackageList skips the actual
            // update but updates the timestamp of the hash.
            await this.$store.dispatch('tsMods/updateIndexHash', 'invalidated');
            await this.$store.dispatch('tsMods/fetchAndProcessPackageList');
        } catch (e) {
            this.updateError = `${e}`;
        } finally {
            this.$store.commit('tsMods/finishThunderstoreModListUpdate');
        }
    }
}
</script>

<template>
    <div v-if="!isModListLoaded" id="mod-list-update-banner" class="margin-bottom">
        <div class="notification is-warning margin-right">
            <span v-if="isUpdateInProgress">
                Updating mod list from Thunderstore...
            </span>
            <span v-else-if="updateError">
                Error updating the mod list: {{ updateError }}<br />
                {{ appName }} will keep trying to update the mod list in the background.
            </span>
            <span v-else>
                It seems like the latest mod list hasn't been loaded from Thunderstore yet.
                Would you like to
                <a @click="updateModList">update now</a>?
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
