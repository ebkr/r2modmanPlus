<script lang="ts" setup>
import { computed } from 'vue';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../../components/composables/SettingSearchComposable';
import { useI18n } from 'vue-i18n';
import { useDateLocale } from '../../../components/composables/DateLocaleComposable';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const { t, d } = useI18n();
const { getDateLocale } = useDateLocale();
const dateLocale = getDateLocale();

const { isVisible } = useSettingSearch(() => props.searchTerm, 'translations.pages.settings.entries.refreshOnlineModList.searchTerms');

const isRefreshing = computed<boolean>(() => store.state.tsMods.isThunderstoreModListUpdateInProgress);
const hasActiveDownloads = computed<boolean>(() => store.getters['download/activeDownloadCount'] > 0);

const status = computed<string>(() => {
    if (isRefreshing.value) {
        const statusKey = store.state.tsMods.thunderstoreModListUpdateStatus;
        return statusKey
            ? t(`translations.modListStatus.${statusKey}`, { progress: store.state.tsMods.thunderstoreModListUpdateProgress })
            : t('translations.pages.settings.entries.refreshOnlineModList.states.refreshing');
    }
    if (store.state.tsMods.thunderstoreModListUpdateError) {
        return t('translations.pages.settings.entries.refreshOnlineModList.states.error', { message: store.state.tsMods.thunderstoreModListUpdateError.message });
    }
    if (hasActiveDownloads.value) {
        return t('translations.pages.settings.entries.refreshOnlineModList.states.disabledWhileDownloading');
    }
    if (store.state.tsMods.modsLastUpdated !== undefined) {
        return t('translations.pages.settings.entries.refreshOnlineModList.states.cacheDate', { date: d(store.state.tsMods.modsLastUpdated!, 'long', dateLocale.value) });
    }
    return t('translations.pages.settings.entries.refreshOnlineModList.states.noApiInfo');
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
