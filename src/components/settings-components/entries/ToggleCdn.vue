<script lang="ts" setup>
import { ref } from 'vue';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../composables/SettingSearchComposable';
import { useI18n } from 'vue-i18n';
import CdnProvider from '../../../providers/generic/connection/CdnProvider';

const props = defineProps<{
    searchTerm?: string;
}>();

const currentCdn = ref(CdnProvider.current);

const { t } = useI18n();

const { isVisible } = useSettingSearch(() => props.searchTerm, 'translations.pages.settings.entries.toggleCdn.searchTerms', () => [
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
        <template #title>{{ t('translations.pages.settings.entries.toggleCdn.title') }}</template>
        <template #description>
            <p>{{ t('translations.pages.settings.entries.toggleCdn.description') }}</p>
            <p>{{ t('translations.pages.settings.entries.toggleCdn.current', { label: currentCdn.label }) }}<template v-if="currentCdn.url"> ({{ currentCdn.url }})</template>.</p>
        </template>
        <button class="button" @click="toggleCdn">{{ t('translations.pages.settings.entries.toggleCdn.action') }}</button>
    </SettingsViewWrapper>
</template>
