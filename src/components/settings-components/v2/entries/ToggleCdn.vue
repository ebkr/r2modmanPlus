<script lang="ts" setup>
import { ref } from 'vue';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../../composables/SettingSearchComposable';
import CdnProvider from '../../../../providers/generic/connection/CdnProvider';

const props = defineProps<{
    searchTerm?: string;
}>();

const currentCdn = ref(CdnProvider.current);

const { isVisible } = useSettingSearch(() => props.searchTerm, () => [
    'Toggle preferred Thunderstore CDN',
    'CDN',
    currentCdn.value.label,
    currentCdn.value.url,
]);

function toggleCdn() {
    CdnProvider.togglePreferredCdn();
    currentCdn.value = CdnProvider.current;
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>Toggle preferred Thunderstore CDN</template>
        <template #description>
            Switch the CDN until the app is restarted. This might bypass issues with downloading mods.
            Current: {{ currentCdn.label }}<template v-if="currentCdn.url"> ({{ currentCdn.url }})</template>.
        </template>
        <button class="button" @click="toggleCdn">Toggle preferred CDN</button>
    </SettingsViewWrapper>
</template>
