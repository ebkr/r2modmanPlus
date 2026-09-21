<script lang="ts" setup>
import { computed, ref } from 'vue';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../composables/SettingSearchComposable';
import { useI18n } from 'vue-i18n';
import { useDateLocale } from '../../composables/DateLocaleComposable';
import R2Error from '../../../model/errors/R2Error';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const { t, d } = useI18n();
const { getDateLocale } = useDateLocale();
const dateLocale = getDateLocale();

const isRefreshing = computed<boolean>(() => store.state.tsMods.isThunderstoreModListUpdateInProgress);
const hasActiveDownloads = computed<boolean>(() => store.getters['download/activeDownloadCount'] > 0);
const isCleaning = ref<boolean>(false);

const status = computed<string>(() => {
    if (isRefreshing.value) {
        const statusKey = store.state.tsMods.thunderstoreModListUpdateStatus;
        return statusKey
            ? t(`translations.modListStatus.${statusKey}`, { progress: store.state.tsMods.thunderstoreModListUpdateProgress })
            : t('translations.pages.settings.entries.onlineModList.states.refreshing');
    }
    if (store.state.tsMods.thunderstoreModListUpdateError) {
        return t('translations.pages.settings.entries.onlineModList.states.error', { message: store.state.tsMods.thunderstoreModListUpdateError.message });
    }
    if (hasActiveDownloads.value) {
        return t('translations.pages.settings.entries.onlineModList.states.disabledWhileDownloading');
    }
    if (store.state.tsMods.modsLastUpdated !== undefined) {
        return t('translations.pages.settings.entries.onlineModList.states.lastUpdated', { date: d(store.state.tsMods.modsLastUpdated!, 'long', dateLocale.value) });
    }
    return t('translations.pages.settings.entries.onlineModList.states.noApiInfo');
});


const { isVisible } = useSettingSearch(() => props.searchTerm, 'translations.pages.settings.entries.onlineModList.searchTerms');

async function refresh() {
    if (isRefreshing.value || hasActiveDownloads.value) {
        return;
    }
    await store.dispatch('tsMods/syncPackageList');
}

async function cleanCache() {
    if (isRefreshing.value || isCleaning.value) {
        return;
    }
    isCleaning.value = true;
    try {
        await store.dispatch('tsMods/resetActiveGameCache');
    } catch (e) {
        store.commit('error/handleError', R2Error.fromThrownValue(e, 'Failed to clean the online mod list'));
    } finally {
        isCleaning.value = false;
    }
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>{{ t('translations.pages.settings.entries.onlineModList.title') }}</template>
        <template #description>
        <p>
            {{ t('translations.pages.settings.entries.onlineModList.description') }}
        </p>
        <p>{{ status }}</p>
        </template>
        <div class="setting-row">
            <button
                class="button"
                :class="{ 'is-loading': isRefreshing && !isCleaning }"
                :disabled="isRefreshing || hasActiveDownloads"
                @click="refresh"
            >
                {{ t('translations.pages.settings.entries.onlineModList.refresh') }}
            </button>
            <button
                class="button"
                :class="{ 'is-loading': isCleaning }"
                :disabled="isRefreshing || isCleaning"
                @click="cleanCache"
            >
                {{ t('translations.pages.settings.entries.onlineModList.deleteCopy') }}
            </button>
        </div>
    </SettingsViewWrapper>
</template>
