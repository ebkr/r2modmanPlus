<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../../components/composables/SettingSearchComposable';
import { useI18n } from 'vue-i18n';
import R2Error from '../../../model/errors/R2Error';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const isCleaning = ref<boolean>(false);
const cacheStatus = ref<string>('');

const { t } = useI18n();

const { isVisible } = useSettingSearch(() => props.searchTerm, 'translations.pages.settings.entries.cleanOnlineModListCache.searchTerms');

async function refreshStatus() {
    try {
        cacheStatus.value = await store.dispatch('tsMods/getActiveGameCacheStatus');
    } catch (e) {
        cacheStatus.value = '';
    }
}

onMounted(refreshStatus);

async function cleanOnlineModList() {
    isCleaning.value = true;
    try {
        await store.dispatch('tsMods/resetActiveGameCache');
        await refreshStatus();
    } catch (e) {
        store.commit('error/handleError', R2Error.fromThrownValue(e, 'Failed to clean the online mod list'));
    } finally {
        isCleaning.value = false;
    }
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>{{ t('translations.pages.settings.entries.cleanOnlineModListCache.title') }}</template>
        <template #description>
            {{ t('translations.pages.settings.entries.cleanOnlineModListCache.description') }}
            <template v-if="cacheStatus">{{ cacheStatus }}</template>
        </template>
        <button
            class="button"
            :class="{ 'is-loading': isCleaning }"
            :disabled="isCleaning"
            @click="cleanOnlineModList"
        >
            {{ t('translations.pages.settings.entries.cleanOnlineModListCache.action') }}
        </button>
    </SettingsViewWrapper>
</template>
