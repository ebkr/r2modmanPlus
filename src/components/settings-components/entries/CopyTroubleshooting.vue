<script lang="ts" setup>
import { ref } from 'vue';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../composables/SettingSearchComposable';
import { useI18n } from 'vue-i18n';
import InteractionProvider from '../../../providers/ror2/system/InteractionProvider';
import R2Error from '../../../model/errors/R2Error';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const isCopying = ref<boolean>(false);

const { t } = useI18n();

const { isVisible } = useSettingSearch(() => props.searchTerm, 'translations.pages.settings.entries.copyTroubleshooting.searchTerms');

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
        <template #title>{{ t('translations.pages.settings.entries.copyTroubleshooting.title') }}</template>
        <template #description>
            {{ t('translations.pages.settings.entries.copyTroubleshooting.description') }}
        </template>
        <button
            class="button"
            :class="{ 'is-loading': isCopying }"
            :disabled="isCopying"
            @click="copyTroubleshootingInfoToClipboard"
        >
            {{ t('translations.pages.settings.entries.copyTroubleshooting.title') }}
        </button>
    </SettingsViewWrapper>
</template>
