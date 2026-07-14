<script lang="ts" setup>
import { ref } from 'vue';
import { getStore } from '../../../../providers/generic/store/StoreProvider';
import { State } from '../../../../store';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../../composables/SettingSearchComposable';
import InteractionProvider from '../../../../providers/ror2/system/InteractionProvider';
import R2Error from '../../../../model/errors/R2Error';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const isCopying = ref<boolean>(false);

const { isVisible } = useSettingSearch(() => props.searchTerm, [
    'Copy troubleshooting information to clipboard',
    'Discord',
    'support',
]);

async function copyTroubleshootingInfoToClipboard() {
    isCopying.value = true;
    try {
        const content = await store.dispatch('profile/generateTroubleshootingString');
        InteractionProvider.instance.copyToClipboard('```' + content + '```');
    } catch (e) {
        store.commit('error/handleError', R2Error.fromThrownValue(e, 'Failed to copy troubleshooting information'));
    } finally {
        isCopying.value = false;
    }
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>Copy troubleshooting info to clipboard</template>
        <template #description>
            Copy settings and other information to your clipboard, formatted for Discord. Share this when requesting support.
        </template>
        <button
            class="button"
            :class="{ 'is-loading': isCopying }"
            :disabled="isCopying"
            @click="copyTroubleshootingInfoToClipboard"
        >
            Copy troubleshooting info to clipboard
        </button>
    </SettingsViewWrapper>
</template>
