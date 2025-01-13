<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class ModListUpdateBanner extends Vue {
    get isModListLoaded(): boolean {
        return this.$store.state.tsMods.modsLastUpdated !== undefined;
    }

    get isUpdateInProgress(): boolean {
        return this.$store.state.tsMods.isThunderstoreModListUpdateInProgress;
    }

    get updateError(): string {
        return this.$store.state.tsMods.thunderstoreModListUpdateError;
    }

    async updateModList() {
        await this.$store.dispatch('tsMods/syncPackageList');
    }
}
</script>

<template>
    <div v-if="!isModListLoaded" id="mod-list-update-banner" class="margin-bottom">
        <div class="notification is-warning margin-right">
            <span v-if="isUpdateInProgress">
                {{ $store.state.tsMods.thunderstoreModListUpdateStatus }}
            </span>
            <span v-else-if="updateError">
                Error updating the mod list: {{ updateError }}.<br />
                The manager will keep trying to update the mod list in the background.
            </span>
            <span v-else>
                An error occurred when updating the mod list from Thunderstore.
                Would you like to
                <a @click="updateModList">try again now</a>?
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
