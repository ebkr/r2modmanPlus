<script lang="ts" setup>
import R2Error from '../model/errors/R2Error';
import { computed } from 'vue';
import { getStore } from '../providers/generic/store/StoreProvider';
import { State } from '../store';

const store = getStore<State>();

const isModListLoaded = computed<boolean>(() => store.state.tsMods.modsLastUpdated !== undefined);
const isUpdateInProgress = computed<boolean>(() => store.state.tsMods.isThunderstoreModListUpdateInProgress);
const updateError = computed<Error|undefined>(() => store.state.tsMods.thunderstoreModListUpdateError);

async function updateModList() {
    await store.dispatch('tsMods/syncPackageList');
}

function openErrorModal() {
    store.commit('error/handleError', R2Error.fromThrownValue(
        updateError.value,
        'Error updating the mod list from Thunderstore',
    ));
}
</script>

<template>
    <div v-if="!isModListLoaded" id="mod-list-update-banner" class="margin-bottom">
        <div class="notification is-warning margin-right">
            <span v-if="isUpdateInProgress">
                {{ $store.state.tsMods.thunderstoreModListUpdateStatus }}
            </span>
            <span v-else-if="updateError">
                Error refreshing the mod list.
                <a @click="openErrorModal">View error details</a>.
                <br />
                The manager will keep trying to refresh the mod list in the background.
            </span>
            <span v-else-if="$store.getters['download/activeDownloadCount'] > 0">
                An error occurred when refreshing the mod list from Thunderstore.<br />
                However, the mod list can't be refreshed while the are mod downloads in progress.<br />
                Please wait for the downloads to finish before continuing.
            </span>
            <span v-else>
                An error occurred when refreshing the mod list from Thunderstore.
                Would you like to
                <a @click="updateModList">try again now</a>?
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
