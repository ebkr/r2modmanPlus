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
    'Set custom launch arguments',
    'Launch parameters',
]);

function openLaunchArguments() {
    store.commit('openLaunchArgumentsModal');
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>Launch arguments</template>
        <template #description>
            Provide custom arguments that are added when starting the game.
        </template>
        <button class="button" @click="openLaunchArguments">Set launch arguments</button>
    </SettingsViewWrapper>
</template>
