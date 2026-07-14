<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import Game from '../../../../model/game/Game';
import { getStore } from '../../../../providers/generic/store/StoreProvider';
import { State } from '../../../../store';
import ManagerSettings from '../../../../r2mm/manager/ManagerSettings';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from 'src/components/composables/SettingSearchComposable';
import InteractionProvider from '../../../../providers/ror2/system/InteractionProvider';
import path from '../../../../providers/node/path/path';
import FsProvider from '../../../../providers/generic/file/FsProvider';
import LinkProvider from '../../../../providers/components/LinkProvider';
import AppWindow from '../../../../providers/node/app/app_window';
import os from '../../../../providers/node/os/os';
import R2Error from '../../../../model/errors/R2Error';
import ManagerInformation from '../../../../_managerinf/ManagerInformation';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const appName = ManagerInformation.APP_NAME;
const activeGame = computed<Game>(() => store.state.activeGame);
const settings = ref<ManagerSettings | null>(null);

const steamDirectory = computed<string>(() =>
    settings.value?.getContext().global.steamDirectory || 'Not set'
);

const { isVisible } = useSettingSearch(() => props.searchTerm, () => [
    'Change Steam folder',
    'Change Steam directory',
    steamDirectory.value,
    'Browse'
]);

onMounted(async () => {
    settings.value = await ManagerSettings.getSingleton(activeGame.value);
});

watch(activeGame, async () => {
    settings.value = await ManagerSettings.getSingleton(activeGame.value);
});

function computeDefaultSteamDirectory(): string {
    switch (AppWindow.getPlatform()) {
        case 'win32':
            return path.resolve(
                process.env['ProgramFiles(x86)'] || process.env.PROGRAMFILES || 'C:\\Program Files (x86)',
                'Steam'
            );
        case 'linux':
            return path.resolve(os.homedir(), '.local', 'share', 'Steam');
        case 'darwin':
            return path.resolve(os.homedir(), 'Library', 'Application Support', 'Steam');
        default:
            return '';
    }
}

async function checkIfSteamExecutableIsValid(file: string): Promise<boolean> {
    switch (AppWindow.getPlatform()) {
        case 'win32':
            return path.basename(file).toLowerCase() === "steam.exe";
        case 'linux':
            return path.basename(file).toLowerCase() === "steam.sh";
        case 'darwin':
            return path.basename(file).toLowerCase() === 'steam.app';
        default:
            return true;
    }
}

function changeSteamDirectory() {
    const steamDir: string = settings.value!.getContext().global.steamDirectory || computeDefaultSteamDirectory();
    InteractionProvider.instance.selectFile({
        title: 'Locate Steam Executable',
        defaultPath: steamDir,
        filters: [{ name: "steam", extensions: ["exe", "sh", "app"] }],
        buttonLabel: 'Select Executable'
    }).then(async files => {
        if (files.length === 1) {
            try {
                if (await checkIfSteamExecutableIsValid(files[0]!)) {
                    await settings.value!.setSteamDirectory(path.dirname(await FsProvider.instance.realpath(files[0]!)));
                } else {
                    store.commit('openIncorrectSteamDirectoryModal');
                }
            } catch (e) {
                const err = R2Error.fromThrownValue(e, 'Failed to change the Steam folder');
                store.commit('error/handleError', err);
            }
        }
    });
}

function browseDirectory() {
    const dir = settings.value?.getContext().global.steamDirectory;
    if (dir) {
        LinkProvider.instance.openLink(dir);
    }
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>Steam folder</template>
        <template #description>
            Change the location of the Steam folder that {{ appName }} uses.
        </template>
        <div class="steam-directory-setting">
            <div class="steam-directory-setting__field">
                <input
                    class="input steam-directory-setting__input"
                    type="text"
                    :value="steamDirectory"
                    readonly
                />
                <button class="button" @click="changeSteamDirectory">Change</button>
                <button class="button" @click="browseDirectory">Browse</button>
            </div>
        </div>
    </SettingsViewWrapper>
</template>

<style lang="scss" scoped>
.steam-directory-setting {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    flex: 1;

    &__field {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    &__input {
        flex: 1;
        min-width: 14rem;
        max-width: 35rem;
    }
}
</style>
