<script lang="ts" setup>
import Game from '../../../../model/game/Game';
import { getStore } from '../../../../providers/generic/store/StoreProvider';
import { State } from '../../../../store';
import { computed, onMounted, ref, watch } from 'vue';
import ManagerSettings from '../../../../r2mm/manager/ManagerSettings';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { StorePlatform } from '../../../../model/platform/StorePlatform';
import InteractionProvider from '../../../../providers/ror2/system/InteractionProvider';
import path from '../../../../providers/node/path/path';
import FsProvider from '../../../../providers/generic/file/FsProvider';
import LinkProvider from '../../../../providers/components/LinkProvider';
import AppWindow from '../../../../providers/node/app/app_window';
import os from '../../../../providers/node/os/os';
import R2Error from '../../../../model/errors/R2Error';
import { useSettingSearch } from 'src/components/composables/SettingSearchComposable';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const activeGame = computed<Game>(() => store.state.activeGame);
const settings = ref<ManagerSettings | null>(null);

const gameDirectory = computed<string>(() =>
    settings.value?.getContext().gameSpecific.gameDirectory || 'Not set'
);

const { isVisible } = useSettingSearch(() => props.searchTerm, () => [
    `${activeGame.value.displayName} folder`,
    gameDirectory.value,
    'Change',
    'Browse',
]);

onMounted(async () => {
    settings.value = await ManagerSettings.getSingleton(activeGame.value);
});

watch(activeGame, async () => {
    settings.value = await ManagerSettings.getSingleton(activeGame.value);
});

function changeGameInstallDirectory() {
    if (StorePlatform[activeGame.value!.activePlatform.storePlatform] === StorePlatform['xbox-game-pass']) {
        changeGameInstallDirectoryGamePass();
    } else {
        changeGameInstallDirectoryGeneral();
    }
}

function changeGameInstallDirectoryGeneral() {
    const ror2Directory: string = settings.value!.getContext().gameSpecific.gameDirectory || computeDefaultInstallDirectory();
    InteractionProvider.instance.selectFile({
        title: `Locate ${activeGame.value.displayName} Executable`,
        // Lazy reduce. Assume Linux name and Windows name are identical besides extension.
        // Should fix if needed, although unlikely.
        filters: (activeGame.value.exeName.map(value => {
            const nameSplit = value.split(".");
            return [{
                name: nameSplit[0],
                extensions: [nameSplit[1]]
            }] as any
        }).reduce((previousValue, currentValue) => {
            previousValue[0].extensions = [...previousValue[0].extensions, ...currentValue[0].extensions];
            return previousValue;
        })),
        defaultPath: ror2Directory,
        buttonLabel: 'Select Executable'
    }).then(async files => {
        if (files.length === 1) {
            try {
                const containsGameExecutable = activeGame.value.exeName.find(exeName => path.basename(files[0]).toLowerCase() === exeName.toLowerCase()) !== undefined
                if (containsGameExecutable) {
                    await settings.value!.setGameDirectory(path.dirname(await FsProvider.instance.realpath(files[0])));
                } else {
                    store.commit('openIncorrectGameDirectoryModal');
                }
            } catch (e) {
                const err = R2Error.fromThrownValue(e, 'Failed to change the game folder');
                store.commit('error/handleError', err);
            }
        }
    });
}

function changeGameInstallDirectoryGamePass() {
    const ror2Directory: string = settings.value!.getContext().gameSpecific.gameDirectory || computeDefaultInstallDirectory();
    InteractionProvider.instance.selectFile({
        title: `Locate gamelaunchhelper Executable`,
        filters: [{ name: "gamelaunchhelper", extensions: ["exe"] }],
        defaultPath: ror2Directory,
        buttonLabel: 'Select Executable'
    }).then(async files => {
        if (files.length === 1) {
            try {
                const containsGameExecutable = (path.basename(files[0]!).toLowerCase() === "gamelaunchhelper.exe");
                if (containsGameExecutable) {
                    await settings.value!.setGameDirectory(path.dirname(await FsProvider.instance.realpath(files[0]!)));
                } else {
                    throw new Error("The selected executable is not gamelaunchhelper.exe");
                }
            } catch (e) {
                const err = R2Error.fromThrownValue(e, 'Failed to change the game folder');
                store.commit('error/handleError', err);
            }
        }
    });
}

function computeDefaultInstallDirectory(): string {
    switch(AppWindow.getPlatform()){
        case 'win32':
            return path.resolve(
                process.env['ProgramFiles(x86)'] || process.env.PROGRAMFILES || 'C:\\Program Files (x86)',
                'Steam', 'steamapps', 'common', activeGame.value.steamFolderName
            );
        case 'linux':
            return path.resolve(os.homedir(), '.local', 'share', 'Steam', 'steamapps', 'common', activeGame.value.steamFolderName);
        case 'darwin':
            return path.resolve(os.homedir(), 'Library', 'Application Support', 'Steam',
                'steamapps', 'common', activeGame.value.steamFolderName);
        default:
            return '';
    }
}

function browseDirectory() {
    if (settings.value?.getContext().gameSpecific.gameDirectory) {
        LinkProvider.instance.openLink(settings.value?.getContext().gameSpecific.gameDirectory!)
    }
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>{{ activeGame.displayName }} folder</template>
        <template #description>
            The game directory is required to place the appropriate files correctly.
            <span v-if="StorePlatform[activeGame.activePlatform.storePlatform] === StorePlatform.steam">
                However <code class="code">{{ activeGame.displayName }}</code> will launch without mods if this is not set appropriately.
            </span>
        </template>
        <div class="game-directory-setting">
            <div class="game-directory-setting__field">
                <input
                    class="input game-directory-setting__input"
                    type="text"
                    :value="gameDirectory"
                    readonly
                />
                <button class="button" @click="changeGameInstallDirectory">Change</button>
                <button class="button" @click="browseDirectory">Browse</button>
            </div>
            <a href="#" class="help-link">I'm not sure what this should be</a>
        </div>
    </SettingsViewWrapper>
</template>

<style lang="scss" scoped>
.game-directory-setting {
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

.help-link {
    font-size: 0.9rem;
    align-self: flex-start;
}
</style>
