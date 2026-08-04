<script lang="ts" setup>
import Game from '../../../model/game/Game';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import { computed, onMounted, ref, watch } from 'vue';
import ManagerSettings from '../../../r2mm/manager/ManagerSettings';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { StorePlatform } from '../../../model/platform/StorePlatform';
import InteractionProvider from '../../../providers/ror2/system/InteractionProvider';
import path from '../../../providers/node/path/path';
import FsProvider from '../../../providers/generic/file/FsProvider';
import LinkProvider from '../../../providers/components/LinkProvider';
import AppWindow from '../../../providers/node/app/app_window';
import os from '../../../providers/node/os/os';
import R2Error from '../../../model/errors/R2Error';
import { useSettingSearch } from '../../composables/SettingSearchComposable';
import { useI18n } from 'vue-i18n';
import ManagerInformation from '../../../_managerinf/ManagerInformation';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const activeGame = computed<Game>(() => store.state.activeGame);
const settings = ref<ManagerSettings | null>(null);

const gameDirectoryPath = ref<string>('');
const gameDirectory = computed<string>(() => gameDirectoryPath.value || t('translations.pages.settings.actions.notSet'));

function syncGameDirectory() {
    gameDirectoryPath.value = settings.value?.getContext().gameSpecific.gameDirectory || '';
}

const { t } = useI18n();

const { isVisible } = useSettingSearch(() => props.searchTerm, 'translations.pages.settings.entries.gameDirectory.searchTerms', () => [
    gameDirectory.value,
]);

onMounted(async () => {
    settings.value = await ManagerSettings.getSingleton(activeGame.value);
    syncGameDirectory();
});

watch(activeGame, async () => {
    settings.value = await ManagerSettings.getSingleton(activeGame.value);
    syncGameDirectory();
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
        title: t('translations.pages.manager.actions.locateGameExecutable', { gameName: activeGame.value.displayName }),
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
        buttonLabel: t('translations.pages.manager.actions.selectExecutable')
    }).then(async files => {
        if (files.length === 1) {
            try {
                const containsGameExecutable = activeGame.value.exeName.find(exeName => path.basename(files[0]!).toLowerCase() === exeName.toLowerCase()) !== undefined
                if (containsGameExecutable) {
                    await settings.value!.setGameDirectory(path.dirname(await FsProvider.instance.realpath(files[0]!)));
                    syncGameDirectory();
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
        title: t('translations.pages.manager.actions.locateGameLaunchHelper'),
        filters: [{ name: "gamelaunchhelper", extensions: ["exe"] }],
        defaultPath: ror2Directory,
        buttonLabel: t('translations.pages.manager.actions.selectExecutable')
    }).then(async files => {
        if (files.length === 1) {
            try {
                const containsGameExecutable = (path.basename(files[0]!).toLowerCase() === "gamelaunchhelper.exe");
                if (containsGameExecutable) {
                    await settings.value!.setGameDirectory(path.dirname(await FsProvider.instance.realpath(files[0]!)));
                    syncGameDirectory();
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
        LinkProvider.instance.openPath(settings.value?.getContext().gameSpecific.gameDirectory!)
    }
}

function openHelpLink() {
    LinkProvider.instance.openLink(ManagerInformation.WIKI_GAME_DIRECTORY_HELP_URL);
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>{{ t('translations.pages.settings.entries.gameDirectory.title', { gameName: activeGame.displayName }) }}</template>
        <template #description>
            <p>
                {{ t('translations.pages.settings.entries.gameDirectory.description') }}
            </p>
            <i18n-t
                tag="p"
                keypath="translations.pages.settings.entries.gameDirectory.warning"
                v-if="StorePlatform[activeGame.activePlatform.storePlatform] === StorePlatform.steam"
            >
                <template v-slot:gameName>
                    <code class="code">{{ activeGame.displayName }}</code>
                </template>
            </i18n-t>
        </template>
        <div class="setting-column">
            <div class="setting-row">
                <input
                    class="input setting-input"
                    type="text"
                    :value="gameDirectory"
                    readonly
                />
                <button class="button" @click="changeGameInstallDirectory">{{ t('translations.pages.settings.actions.change') }}</button>
                <button class="button" @click="browseDirectory">{{ t('translations.pages.settings.actions.browse') }}</button>
            </div>
            <a href="#" class="help-link" @click.prevent.stop="openHelpLink">{{ t('translations.pages.settings.entries.gameDirectory.unsure') }}</a>
        </div>
    </SettingsViewWrapper>
</template>

<style lang="scss" scoped>
.help-link {
    font-size: 0.9rem;
    align-self: flex-start;
}
</style>
