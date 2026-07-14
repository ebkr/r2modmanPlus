<script lang="ts" setup>
import { computed, ref } from 'vue';
import moment from 'moment';
import { getStore } from '../../../../providers/generic/store/StoreProvider';
import { State } from '../../../../store';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from 'src/components/composables/SettingSearchComposable';
import R2Error from '../../../../model/errors/R2Error';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const isRefreshing = computed<boolean>(() => store.state.tsMods.isThunderstoreModListUpdateInProgress);
const hasActiveDownloads = computed<boolean>(() => store.getters['download/activeDownloadCount'] > 0);
const isCleaning = ref<boolean>(false);

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
        return 'Last updated on: ' + moment(store.state.tsMods.modsLastUpdated).format('MMMM Do YYYY, h:mm:ss a');
    }
    return 'No API information available';
});

const { isVisible } = useSettingSearch(() => props.searchTerm, [
    'Refresh online mod list',
    'Check for new mod releases',
    'Clean online mod list cache',
    'Reset mod list cache',
]);

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
        <template #title>Online mod list</template>
        <template #description>
        <p>
            Check for new mod releases, or clear the local copy.
        </p>
        <p>{{ status }}</p>
        </template>
        <div class="online-mod-list-setting">
            <button
                class="button"
                :class="{ 'is-loading': isRefreshing && !isCleaning }"
                :disabled="isRefreshing || hasActiveDownloads"
                @click="refresh"
            >
                Refresh
            </button>
            <button
                class="button"
                :class="{ 'is-loading': isCleaning }"
                :disabled="isRefreshing || isCleaning"
                @click="cleanCache"
            >
                Delete copy
            </button>
        </div>
    </SettingsViewWrapper>
</template>

<style scoped lang="scss">
.online-mod-list-setting {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}
</style>
