<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import PathResolver from '../../../../r2mm/manager/PathResolver';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import LinkProvider from '../../../../providers/components/LinkProvider';
import { DataFolderProvider } from '../../../../providers/ror2/system/DataFolderProvider';
import ManagerSettings from '../../../../r2mm/manager/ManagerSettings';
import { getStore } from '../../../../providers/generic/store/StoreProvider';
import { State } from '../../../../store';
import Game from '../../../../model/game/Game';
import InteractionProvider from '../../../../providers/ror2/system/InteractionProvider';
import R2Error from '../../../../model/errors/R2Error';
import { useSettingSearch } from 'src/components/composables/SettingSearchComposable';

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

const { isVisible } = useSettingSearch(() => props.searchTerm, () => [
    'Data and profile directories',
    dataDirectory.value,
    profileDirectory.value,
    'Change',
    'Browse',
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
        LinkProvider.instance.openLink(PathResolver.ROOT);
    }
}

function browseProfileFolder() {
    const profilePath = store.getters['profile/activeProfile']?.getProfilePath();
    if (profilePath) {
        LinkProvider.instance.openLink(profilePath);
    }
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>Data and profile directories</template>
        <template #description>
            The folder where mods are stored for all games and profiles.
            The folder will not be deleted, and existing profiles will not carry across.
        </template>
        <div class="directory-settings">
            <div class="directory-settings__row">
                <label class="directory-settings__label">Data folder</label>
                <input
                    class="input directory-settings__input"
                    type="text"
                    :value="dataDirectory"
                    readonly
                />
                <button class="button" @click="changeDataFolder">Change</button>
                <button class="button" @click="browseDataFolder">Browse</button>
            </div>
            <div class="directory-settings__row">
                <label class="directory-settings__label">Profile folder</label>
                <input
                    class="input directory-settings__input"
                    type="text"
                    :value="profileDirectory"
                    readonly
                />
                <button class="button" @click="browseProfileFolder">Browse</button>
            </div>
        </div>
    </SettingsViewWrapper>
</template>

<style lang="scss" scoped>
.directory-settings {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    flex: 1;

    &__row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    &__label {
        flex: 0 0 6.5rem;
        font-size: 0.9rem;
        color: var(--text-secondary, #6b6464);
    }

    &__input {
        flex: 1;
        min-width: 14rem;
        max-width: 35rem;
    }
}
</style>
