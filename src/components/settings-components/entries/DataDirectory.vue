<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import PathResolver from '../../../r2mm/manager/PathResolver';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import LinkProvider from '../../../providers/components/LinkProvider';
import { DataFolderProvider } from '../../../providers/ror2/system/DataFolderProvider';
import ManagerSettings from '../../../r2mm/manager/ManagerSettings';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import Game from '../../../model/game/Game';
import InteractionProvider from '../../../providers/ror2/system/InteractionProvider';
import R2Error from '../../../model/errors/R2Error';
import { useSettingSearch } from '../../composables/SettingSearchComposable';
import { useI18n } from 'vue-i18n';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const dataDirectory = ref<string>(PathResolver.ROOT || 'Not set');
const activeGame = computed<Game>(() => store.state.activeGame);
const settings = ref<ManagerSettings | null>(null);

const profileDirectory = computed<string>(() =>
    store.getters['profile/activeProfile']?.getProfilePath() || 'Not set'
);

const { t } = useI18n();

const { isVisible } = useSettingSearch(() => props.searchTerm, 'translations.pages.settings.entries.dataDirectory.searchTerms', () => [
    dataDirectory.value,
    profileDirectory.value,
]);

onMounted(async () => {
    settings.value = await ManagerSettings.getSingleton(activeGame.value);
});

watch(activeGame, async () => {
    settings.value = await ManagerSettings.getSingleton(activeGame.value);
});

async function changeDataFolder() {
    try {
        const folder = await DataFolderProvider.instance.showSelectionDialog();

        if (folder === null) {
            return;
        }

        await DataFolderProvider.instance.throwForInvalidFolder(folder);
        await DataFolderProvider.instance.writeOverrideFile(folder);
        await settings.value!.setDataDirectory(folder);
        InteractionProvider.instance.restartApp();
    } catch(err) {
        store.commit("error/handleError", R2Error.fromThrownValue(err));
        return
    }
}

function browseDataFolder() {
    if (PathResolver.ROOT) {
        LinkProvider.instance.openPath(PathResolver.ROOT);
    }
}

function browseProfileFolder() {
    const profilePath = store.getters['profile/activeProfile']?.getProfilePath();
    if (profilePath) {
        LinkProvider.instance.openPath(profilePath);
    }
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>{{ t('translations.pages.settings.entries.dataDirectory.title') }}</template>
        <template #description>
            <p>{{ t('translations.pages.settings.entries.dataDirectory.description') }}</p>
            <p>{{ t('translations.pages.settings.entries.dataDirectory.warning') }}</p>
        </template>
        <div class="setting-column">
            <div class="setting-row">
                <label class="setting-label">{{ t('translations.pages.settings.entries.dataDirectory.dataFolder') }}</label>
                <input
                    class="input setting-input"
                    type="text"
                    :value="dataDirectory"
                    readonly
                />
                <button class="button" @click="changeDataFolder">{{ t('translations.pages.settings.actions.change') }}</button>
                <button class="button" @click="browseDataFolder">{{ t('translations.pages.settings.actions.browse') }}</button>
            </div>
            <div class="setting-row">
                <label class="setting-label">{{ t('translations.pages.settings.entries.dataDirectory.profileFolder') }}</label>
                <input
                    class="input setting-input"
                    type="text"
                    :value="profileDirectory"
                    readonly
                />
                <button class="button" @click="browseProfileFolder">{{ t('translations.pages.settings.actions.browse') }}</button>
            </div>
        </div>
    </SettingsViewWrapper>
</template>
