<script lang="ts" setup>
import { getStore } from '../../../../providers/generic/store/StoreProvider';
import { State } from '../../../../store';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from 'src/components/composables/SettingSearchComposable';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const { isVisible } = useSettingSearch(() => props.searchTerm, [
    'Import local mod',
    'Install offline',
    'Import'
]);

function importLocalMod() {
    store.commit('openLocalFileImportModal');
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>Import local mod</template>
        <template #description>
            Install a mod offline from your files. Not all mods can be installed locally.
        </template>
        <button class="button" @click="importLocalMod">Import local mod</button>
    </SettingsViewWrapper>
</template>
