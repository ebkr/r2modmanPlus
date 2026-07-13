<script lang="ts" setup>
import { ref } from 'vue';
import { getStore } from '../../../../providers/generic/store/StoreProvider';
import { State } from '../../../../store';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from 'src/components/composables/SettingSearchComposable';
import CacheUtil from '../../../../r2mm/mods/CacheUtil';
import R2Error from '../../../../model/errors/R2Error';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const isCleaning = ref<boolean>(false);

const { isVisible } = useSettingSearch(() => props.searchTerm, [
    'Clean mod cache',
    'Free space',
    'Clean',
]);

async function cleanCache() {
    isCleaning.value = true;
    try {
        await CacheUtil.clean();
    } catch (e) {
        store.commit('error/handleError', R2Error.fromThrownValue(e, 'Failed to clean the mod cache'));
    } finally {
        isCleaning.value = false;
    }
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>Clean mod cache</template>
        <template #description>
            Free extra space caused by cached mods that are not currently in a profile.
            Checks all profiles for unused mods and clears the cache.
        </template>
        <button
            class="button"
            :class="{ 'is-loading': isCleaning }"
            :disabled="isCleaning"
            @click="cleanCache"
        >
            Clean mod cache
        </button>
    </SettingsViewWrapper>
</template>
