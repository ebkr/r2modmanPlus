<script lang="ts" setup>
import R2Error from '../model/errors/R2Error';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { getStore } from '../providers/generic/store/StoreProvider';
import { State } from '../store';


const { t } = useI18n();

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
                {{ t(`translations.modListStatus.${store.state.tsMods.thunderstoreModListUpdateStatus}`) }}
            </span>
            <span v-else-if="updateError">
                {{ t('translations.banners.modListUpdate.error') }}
                <a @click="openErrorModal">{{ t('translations.banners.modListUpdate.viewDetails') }}</a>.
                <br />
                {{ t('translations.banners.modListUpdate.willKeepTrying') }}
            </span>
            <span v-else-if="store.getters['download/activeDownloadCount'] > 0">
                {{ t('translations.banners.modListUpdate.errorOccurred') }}<br />
                {{ t('translations.banners.modListUpdate.blockedByDownloads') }}<br />
                {{ t('translations.banners.modListUpdate.waitForDownloads') }}
            </span>
            <i18n-t v-else tag="span" keypath="translations.banners.modListUpdate.retryPrompt">
                <template v-slot:retryAction>
                    <a @click="updateModList">{{ t('translations.banners.modListUpdate.retryAction') }}</a>
                </template>
            </i18n-t>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
