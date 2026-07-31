<script lang="ts" setup>
import { computed } from 'vue';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../composables/SettingSearchComposable';
import { useI18n } from 'vue-i18n';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const modCount = computed<number>(() => store.state.profile.modList.length);

const { t } = useI18n();

const { isVisible } = useSettingSearch(() => props.searchTerm, 'translations.pages.settings.entries.showDependencyStrings.searchTerms');

function showDependencyStrings() {
    store.commit('openDependencyStringsModal');
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>{{ t('translations.pages.settings.entries.showDependencyStrings.title') }}</template>
        <template #description>
            {{ t('translations.pages.settings.entries.showDependencyStrings.description', { modCount }) }}
        </template>
        <button class="button" @click="showDependencyStrings">{{ t('translations.pages.settings.entries.showDependencyStrings.title') }}</button>
    </SettingsViewWrapper>
</template>
