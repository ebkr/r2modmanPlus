<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import Game from '../../../model/game/Game';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import ManagerSettings from '../../../r2mm/manager/ManagerSettings';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../composables/SettingSearchComposable';
import { useI18n } from 'vue-i18n';
import InteractionProvider from '../../../providers/ror2/system/InteractionProvider';
import path from '../../../providers/node/path/path';
import FsProvider from '../../../providers/generic/file/FsProvider';
import LinkProvider from '../../../providers/components/LinkProvider';
import AppWindow from '../../../providers/node/app/app_window';
import os from '../../../providers/node/os/os';
import R2Error from '../../../model/errors/R2Error';
import ManagerInformation from '../../../_managerinf/ManagerInformation';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const appName = ManagerInformation.APP_NAME;
const activeGame = computed<Game>(() => store.state.activeGame);
const settings = ref<ManagerSettings | null>(null);

const steamDirectoryPath = ref<string>('');
const steamDirectory = computed<string>(() => steamDirectoryPath.value || t('translations.pages.settings.actions.notSet'));

function syncSteamDirectory() {
    steamDirectoryPath.value = settings.value?.getContext().global.steamDirectory || '';
}

const { t } = useI18n();

const { isVisible } = useSettingSearch(() => props.searchTerm, 'translations.pages.settings.entries.steamDirectory.searchTerms', () => [
    steamDirectory.value,
]);

onMounted(async () => {
    settings.value = await ManagerSettings.getSingleton(activeGame.value);
    syncSteamDirectory();
});

watch(activeGame, async () => {
    settings.value = await ManagerSettings.getSingleton(activeGame.value);
    syncSteamDirectory();
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
        title: t('translations.pages.manager.actions.locateSteamExecutable'),
        defaultPath: steamDir,
        filters: [{ name: "steam", extensions: ["exe", "sh", "app"] }],
        buttonLabel: t('translations.pages.manager.actions.selectExecutable')
    }).then(async files => {
        if (files.length === 1) {
            try {
                if (await checkIfSteamExecutableIsValid(files[0]!)) {
                    await settings.value!.setSteamDirectory(path.dirname(await FsProvider.instance.realpath(files[0]!)));
                    syncSteamDirectory();
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
        LinkProvider.instance.openPath(dir);
    }
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>{{ t('translations.pages.settings.entries.steamDirectory.title') }}</template>
        <template #description>
            <p>{{ t('translations.pages.settings.entries.steamDirectory.description') }}</p>
            <p>{{ t('translations.pages.settings.entries.steamDirectory.value', { appName }) }}</p>
        </template>
        <div class="setting-column">
            <div class="setting-row">
                <input
                    class="input setting-input"
                    type="text"
                    :value="steamDirectory"
                    readonly
                />
                <button class="button" @click="changeSteamDirectory">{{ t('translations.pages.settings.actions.change') }}</button>
                <button class="button" @click="browseDirectory">{{ t('translations.pages.settings.actions.browse') }}</button>
            </div>
        </div>
    </SettingsViewWrapper>
</template>
