<script lang="ts" setup>
import { computed } from 'vue';
import moment from 'moment';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../../components/composables/SettingSearchComposable';
import { useI18n } from 'vue-i18n';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const { t } = useI18n();

const { isVisible } = useSettingSearch(() => props.searchTerm, 'translations.pages.settings.entries.refreshOnlineModList.searchTerms');

const isRefreshing = computed<boolean>(() => store.state.tsMods.isThunderstoreModListUpdateInProgress);
const hasActiveDownloads = computed<boolean>(() => store.getters['download/activeDownloadCount'] > 0);

const status = computed<string>(() => {
    if (isRefreshing.value) {
        return store.state.tsMods.thunderstoreModListUpdateStatus || 'Refreshing...';
    }
    if (store.state.tsMods.thunderstoreModListUpdateError) {
        return `Error refreshing the mod list: ${store.state.tsMods.thunderstoreModListUpdateError.message}`;
    }
    if (hasActiveDownloads.value) {
        return 'Refreshing the mod list is disabled while there are active downloads.';
    }
    if (store.state.tsMods.modsLastUpdated !== undefined) {
        return 'Cache date: ' + moment(store.state.tsMods.modsLastUpdated).format('MMMM Do YYYY, h:mm:ss a');
    }
    return 'No API information available';
});

async function refresh() {
    if (isRefreshing.value || hasActiveDownloads.value) {
        return;
    }
    await store.dispatch('tsMods/syncPackageList');
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>{{ t('translations.pages.settings.entries.refreshOnlineModList.title') }}</template>
        <template #description>
            {{ t('translations.pages.settings.entries.refreshOnlineModList.description', { status }) }}
        </template>
        <button
            class="button"
            :class="{ 'is-loading': isRefreshing }"
            :disabled="isRefreshing || hasActiveDownloads"
            @click="refresh"
        >
            {{ t('translations.pages.settings.entries.refreshOnlineModList.action') }}
        </button>
    </SettingsViewWrapper>
</template>
