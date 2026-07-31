<script lang="ts" setup>
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../composables/SettingSearchComposable';
import { useI18n } from 'vue-i18n';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const { t } = useI18n();

const { isVisible } = useSettingSearch(() => props.searchTerm, 'translations.pages.settings.entries.importLocalMod.searchTerms');

function importLocalMod() {
    store.commit('openLocalFileImportModal');
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>{{ t('translations.pages.settings.entries.importLocalMod.title') }}</template>
        <template #description>
            {{ t('translations.pages.settings.entries.importLocalMod.description') }}
        </template>
        <button class="button" @click="importLocalMod">{{ t('translations.pages.settings.entries.importLocalMod.title') }}</button>
    </SettingsViewWrapper>
</template>
