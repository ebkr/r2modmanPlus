<script lang="ts" setup>
import { computed } from 'vue';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../composables/SettingSearchComposable';
import { useI18n } from 'vue-i18n';

const store = getStore<State>();
const { t } = useI18n();

const props = defineProps<{
    searchTerm?: string;
}>();

const activeGame = computed(() => store.state.activeGame);

const { isVisible } = useSettingSearch(() => props.searchTerm, 'translations.pages.settings.entries.resetGameInstallation.searchTerms');

async function validateSteamInstallation() {
    store.commit('openSteamInstallationValidationModal');
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>{{ t('translations.pages.settings.entries.resetGameInstallation.title', { gameName: activeGame.displayName }) }}</template>
        <template #description>
            <i18n-t
                tag="span"
                keypath="translations.pages.settings.entries.resetGameInstallation.description"
            >
                <template v-slot:folderName>
                    <code class="code">{{ activeGame.steamFolderName }}</code>
                </template>
            </i18n-t>
        </template>
        <button
            class="button"
            @click="validateSteamInstallation"
        >
            {{ t('translations.pages.settings.entries.resetGameInstallation.action') }}
        </button>
    </SettingsViewWrapper>
</template>
