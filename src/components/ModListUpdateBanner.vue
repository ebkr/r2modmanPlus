<script lang="ts" setup>
import R2Error from '../model/errors/R2Error';
import { computed } from 'vue';
import { getStore } from '../providers/generic/store/StoreProvider';
import { State } from '../store';

const store = getStore<State>();

const isModListLoaded = computed<boolean>(() => store.state.tsMods.modsLastUpdated !== undefined);
const isUpdateInProgress = computed<boolean>(() => store.state.tsMods.isThunderstoreModListUpdateInProgress);
const updateError = computed<Error|undefined>(() => store.state.tsMods.thunderstoreModListUpdateError);

function updateModList() {
    store.dispatch('tsMods/syncPackageList');
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
                {{ store.state.tsMods.thunderstoreModListUpdateStatus }}
            </span>
            <span v-else-if="updateError">
                {{ $t('ModListUpdateBanner.error_refreshing_the_mod_list') }}
                <a @click="openErrorModal">{{ $t('ModListUpdateBanner.view_error_details') }}</a>.
                <br />
                {{ $t('ModListUpdateBanner.the_manager_will_keep_trying_t') }}
            </span>
            <span v-else-if="store.getters['download/activeDownloadCount'] > 0">
                {{ $t('ModListUpdateBanner.an_error_occurred_when_refresh') }}<br />
                {{ $t('ModListUpdateBanner.however_the_mod_list_can_t_be') }}<br />
                {{ $t('ModListUpdateBanner.please_wait_for_the_downloads') }}
            </span>
            <span v-else>
                {{ $t('ModListUpdateBanner.an_error_occurred_when_refresh') }} {{ $t('ModListUpdateBanner.would_you_like_to') }} <a @click="updateModList">{{ $t('ModListUpdateBanner.try_again_now') }}</a>?
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
