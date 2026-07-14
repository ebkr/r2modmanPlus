<script lang="ts" setup>
import { computed } from 'vue';
import { getStore } from '../../../../providers/generic/store/StoreProvider';
import { State } from '../../../../store';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from 'src/components/composables/SettingSearchComposable';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const modCount = computed<number>(() => store.state.profile.modList.length);

const { isVisible } = useSettingSearch(() => props.searchTerm, [
    'Show dependency strings',
    'Dependency',
]);

function showDependencyStrings() {
    store.commit('openDependencyStringsModal');
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>Show dependency strings</template>
        <template #description>
            View a list of installed mods with their version strings, as used inside the dependencies array of a
            manifest.json file. Shows dependency strings for {{ modCount }} mod(s).
        </template>
        <button class="button" @click="showDependencyStrings">Show dependency strings</button>
    </SettingsViewWrapper>
</template>
