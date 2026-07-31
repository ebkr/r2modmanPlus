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

const outdatedCount = computed<number>(() => store.getters['profile/modsWithUpdates'].length);

const statusText = computed<string>(() =>
    outdatedCount.value === 1
        ? '1 mod has an update available.'
        : `${outdatedCount.value} mods have an update available.`
);

const { t } = useI18n();

const { isVisible } = useSettingSearch(() => props.searchTerm, 'translations.pages.settings.entries.updateAllMods.searchTerms');

function updateAllMods() {
    store.commit('openUpdateAllModsModal');
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>{{ t('translations.pages.settings.entries.updateAllMods.title') }}</template>
        <template #description>
            {{ t('translations.pages.settings.entries.updateAllMods.description', { status: statusText }) }}
        </template>
        <button
            class="button"
            :disabled="outdatedCount === 0"
            @click="updateAllMods"
        >
            {{ t('translations.pages.settings.entries.updateAllMods.title') }}
        </button>
    </SettingsViewWrapper>
</template>
