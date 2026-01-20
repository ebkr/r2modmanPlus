<template>
	<div class="manager-main-view">
		<div id='steamIncorrectDir' :class="['modal', {'is-active':(showSteamIncorrectDirectoryModal !== false)}]">
			<div class="modal-background" @click="showSteamIncorrectDirectoryModal = false"></div>
			<div class='modal-content'>
				<div class='notification is-danger'>
					<h3 class='title'>Failed to set the Steam folder</h3>
					<p>The steam executable was not selected.</p>
					<p>If this error has appeared but the executable is correct, please run as administrator.</p>
				</div>
			</div>
			<button class="modal-close is-large" aria-label="close"
			        @click="showSteamIncorrectDirectoryModal = false"></button>
		</div>
		<div id='ror2IncorrectDir' :class="['modal', {'is-active':(showRor2IncorrectDirectoryModal !== false)}]">
			<div class="modal-background" @click="showRor2IncorrectDirectoryModal = false"></div>
			<div class='modal-content'>
				<div class='notification is-danger'>
					<h3 class='title'>Failed to set the {{ activeGame.displayName }} folder</h3>
					<p>The executable must be either of the following: "{{ activeGame.exeName.join('", "') }}".</p>
					<p>If this error has appeared but the executable is correct, please run as administrator.</p>
				</div>
			</div>
			<button class="modal-close is-large" aria-label="close"
			        @click="showRor2IncorrectDirectoryModal = false"></button>
		</div>
		<ModalCard id="steam-installation-validation-modal" :is-active="isValidatingSteamInstallation" @close-modal="closeSteamInstallationValidationModal" :can-close="true">
			<template v-slot:header>
				<h2 class='modal-title'>Clearing the {{activeGame.displayName}} installation directory</h2>
			</template>
			<template v-slot:body>
				<div class='notification is-warning'>
					<p>
						You will not not be able to launch the game until
						Steam has verified the integrity of the game files.
					</p>
				</div>
				<p>
					Steam will be started and will attempt to verify the
					integrity of {{ activeGame.displayName }}.
				</p>
				<br/>
				<p>
					Please check the Steam window for validation progress.
					If the window has not yet appeared, please be patient.
				</p>
			</template>
			<template v-slot:footer>
				<button class="button is-info" @click="closeSteamInstallationValidationModal()">
					I understand
				</button>
			</template>
		</ModalCard>
        <ModalCard id="dependency-strings-modal" :is-active="showDependencyStrings" @close-modal="showDependencyStrings = false;" :can-close="true">
            <template v-slot:header>
                <h2 class='modal-title'>Dependency string list</h2>
            </template>
            <template v-slot:body>
                <ul>
                    <li v-for="(key, index) in localModList" :key="`dep-str-${index}`">
                        {{key.getName()}}-{{key.getVersionNumber().toString()}}
                    </li>
                </ul>
            </template>
            <template v-slot:footer>
                <button class="button is-info"
                        @click="showDependencyStrings = false;">
                    Close
                </button>
            </template>
        </ModalCard>
		<ModalCard id="launch-parameters-modal" :is-active="showLaunchParameterModal" @close-modal="() => {showLaunchParameterModal = false;}" :can-close="true">
			<template v-slot:header>
				<h2 class='modal-title'>Set custom launch parameters</h2>
			</template>
			<template v-slot:body>
				<p>Some arguments are provided by default:</p>
				<br/>
				<p>Modded:
					<br/>
					<code v-if="doorstopTarget.length > 0">
						{{ doorstopTarget }}
					</code>
                    <code v-else>These parameters will be available after installing a mod loader.</code>
				</p>
				<br/>
				<p>Vanilla:
					<br>
					<code>
						{{ vanillaLaunchArgs }}
					</code>
				</p>
				<br/>
				<p>
					<strong>Please note that these are called against the Steam executable. Be careful when
						entering custom launch parameters.</strong>
				</p>
				<br/>
				<input
					v-model='launchParametersModel'
					id='launch-parameters-modal-input'
					class='input'
					placeholder='Enter parameters'
					autocomplete='off'
				/>
			</template>
			<template v-slot:footer>
				<button class='button is-info' @click='updateLaunchParameters()'>
					Update launch parameters
				</button>
			</template>
		</ModalCard>

        <CategoryFilterModal />
        <SortModal />
        <LocalFileImportModal :visible="importingLocalMod" @close-modal="importingLocalMod = false" />
        <ProfileCodeExportModal />
        <DownloadProgressModal />
        <DownloadModVersionSelectModal />
        <UpdateAllInstalledModsModal />
        <LaunchTypeModal v-if="canRenderLaunchTypeModal()" />

        <div class="router-view">
            <router-view name="subview" v-on:setting-invoked="handleSettingsCallbacks($event)" />
        </div>
    </div>
</template>

<script lang='ts' setup>
import { computed, onMounted, ref } from 'vue';
import PathResolver from '../r2mm/manager/PathResolver';
import { SteamInstallationValidator } from '../r2mm/manager/SteamInstallationValidator';
import R2Error from '../model/errors/R2Error';
import ThemeManager from '../r2mm/manager/ThemeManager';
import { DataFolderProvider } from '../providers/ror2/system/DataFolderProvider';
import InteractionProvider from '../providers/ror2/system/InteractionProvider';
import os from '../providers/node/os/os';
import FsProvider from '../providers/generic/file/FsProvider';
import CacheUtil from '../r2mm/mods/CacheUtil';
import LinkProvider from '../providers/components/LinkProvider';
import GameRunnerProvider from '../providers/generic/game/GameRunnerProvider';
import LocalFileImportModal from '../components/importing/LocalFileImportModal.vue';
import { PackageLoader } from '../model/schema/ThunderstoreSchema';
import GameInstructions from '../r2mm/launching/instructions/GameInstructions';
import CategoryFilterModal from '../components/modals/CategoryFilterModal.vue';
import ModalCard from '../components/ModalCard.vue';
import ProfileCodeExportModal from '../components/modals/ProfileCodeExportModal.vue';
import SortModal from '../components/modals/SortModal.vue';
import DownloadModVersionSelectModal from '../components/views/DownloadModVersionSelectModal.vue';
import DownloadProgressModal from '../components/views/DownloadProgressModal.vue';
import UpdateAllInstalledModsModal from '../components/views/UpdateAllInstalledModsModal.vue';
import { getStore } from '../providers/generic/store/StoreProvider';
import { State } from '../store';
import { useRouter } from 'vue-router';
import path from '../providers/node/path/path';
import LaunchTypeModal from "../components/modals/launch-type/LaunchTypeModal.vue";
import appWindow from '../providers/node/app/app_window';
import GameInstructionParser from "../r2mm/launching/instructions/GameInstructionParser";

const store = getStore<State>();
const router = useRouter();

const isValidatingSteamInstallation = ref<boolean>(false);
const showSteamIncorrectDirectoryModal = ref<boolean>(false);
const showRor2IncorrectDirectoryModal = ref<boolean>(false);
const launchParametersModel = ref<string>('');
const showLaunchParameterModal = ref<boolean>(false);
const showDependencyStrings = ref<boolean>(false);
const importingLocalMod = ref<boolean>(false);
const doorstopTarget = ref<string>("");
const vanillaLaunchArgs = ref<string>("");

const activeGame = computed(() => store.state.activeGame);
const settings = computed(() => store.getters['settings']);
const profile = computed(() => store.getters['profile/activeProfile']);
const localModList = computed(() => store.state.profile.modList);

function canRenderLaunchTypeModal() {
    return ['linux', 'darwin'].includes(appWindow.getPlatform());
}

function closeSteamInstallationValidationModal() {
    isValidatingSteamInstallation.value = false;
}

async function validateSteamInstallation() {
    const res = await SteamInstallationValidator.validateInstallation(activeGame.value);
    if (res instanceof R2Error) {
        store.commit('error/handleError', res);
    } else {
        isValidatingSteamInstallation.value = true;
    }
}

function computeDefaultInstallDirectory(): string {
    switch(appWindow.getPlatform()){
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

function changeGameInstallDirectory() {
    const ror2Directory: string = settings.value.getContext().gameSpecific.gameDirectory || computeDefaultInstallDirectory();
    InteractionProvider.instance.selectFile({
        title: `Locate ${activeGame.value.displayName} Executable`,
        // Lazy reduce. Assume Linux name and Windows name are identical besides extension.
        // Should fix if needed, although unlikely.
        filters: (activeGame.value.exeName.map(value => {
            const nameSplit = value.split(".");
            return [{
                name: nameSplit[0],
                extensions: [nameSplit[1]]
            }]
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
                    await settings.value.setGameDirectory(path.dirname(await FsProvider.instance.realpath(files[0])));
                } else {
                    showRor2IncorrectDirectoryModal.value = true;
                }
            } catch (e) {
                const err = R2Error.fromThrownValue(e, 'Failed to change the game folder');
                store.commit('error/handleError', err);
            }
        }
    });
}

function changeGameInstallDirectoryGamePass() {
    const ror2Directory: string = settings.value.getContext().gameSpecific.gameDirectory || computeDefaultInstallDirectory();
    InteractionProvider.instance.selectFile({
        title: `Locate gamelaunchhelper Executable`,
        filters: [{ name: "gamelaunchhelper", extensions: ["exe"] }],
        defaultPath: ror2Directory,
        buttonLabel: 'Select Executable'
    }).then(async files => {
        if (files.length === 1) {
            try {
                const containsGameExecutable = (path.basename(files[0]).toLowerCase() === "gamelaunchhelper.exe");
                if (containsGameExecutable) {
                    await settings.value.setGameDirectory(path.dirname(await FsProvider.instance.realpath(files[0])));
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

function computeDefaultSteamDirectory(): string {
    switch(appWindow.getPlatform()){
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
    switch(appWindow.getPlatform()){
        case 'win32':
            return path.basename(file).toLowerCase() === "steam.exe"
        case 'linux':
            return path.basename(file).toLowerCase() === "steam.sh"
        case 'darwin':
            return path.basename(file).toLowerCase() === 'steam.app'
        default:
            return true;
    }
}

function changeSteamDirectory() {
    const steamDir: string = settings.value.getContext().global.steamDirectory || computeDefaultSteamDirectory();
    InteractionProvider.instance.selectFile({
        title: 'Locate Steam Executable',
        defaultPath: steamDir,
        filters: [{name: "steam", extensions: ["exe", "sh", "app"]}],
        buttonLabel: 'Select Executable'
    }).then(async files => {
        if (files.length === 1) {
            try {
                if (await checkIfSteamExecutableIsValid(files[0])) {
                    await settings.value.setSteamDirectory(path.dirname(await FsProvider.instance.realpath(files[0])));
                } else {
                    showSteamIncorrectDirectoryModal.value = true;
                }
            } catch (e) {
                const err = R2Error.fromThrownValue(e, 'Failed to change the Steam folder');
                store.commit('error/handleError', err);
            }
        }
    });
}

function setFunkyMode(value: boolean) {
    settings.value.setFunkyMode(value);
}

function browseDataFolder() {
    LinkProvider.instance.openLink('file://' + PathResolver.ROOT);
}

function browseProfileFolder() {
    LinkProvider.instance.openLink('file://' + profile.value.getProfilePath());
}

function toggleCardExpanded(expanded: boolean) {
    if (expanded) {
        settings.value.expandCards();
    } else {
        settings.value.collapseCards();
    }
    router.push({name: "manager.installed"});
}

async function toggleDarkTheme() {
    await settings.value.toggleDarkTheme();
    ThemeManager.apply();
}

function showLaunchParameters() {
    GameInstructions.getInstructionsForGame(activeGame.value, profile.value).then(instructions => {
        vanillaLaunchArgs.value = instructions.vanillaParameterList.map(value => `"${value}"`).join(' ');
    });

    GameRunnerProvider.instance.getGameArguments(activeGame.value, profile.value).then(target => {
        if (target instanceof R2Error) {
            doorstopTarget.value = "";
        } else {
            GameInstructionParser.parseList(target, activeGame.value, profile.value)
                .then(instructions => {
                    if (instructions instanceof R2Error) {
                        throw instructions;
                    }
                    doorstopTarget.value = instructions.map(value => `"${value}"`).join(' ');
                })
        }
    });

    launchParametersModel.value = settings.value.getContext().gameSpecific.launchParameters;
    showLaunchParameterModal.value = true;
}

function updateLaunchParameters() {
    settings.value.setLaunchParameters(launchParametersModel.value);
    showLaunchParameterModal.value = false;
}

async function copyLogToClipboard() {
    const fs = FsProvider.instance;
    let logOutputPath = "";
    switch (activeGame.value.packageLoader) {
        case PackageLoader.BEPINEX:
        case PackageLoader.BEPISLOADER:
            logOutputPath = path.join(profile.value.getProfilePath(), "BepInEx", "LogOutput.log");
            break;
        case PackageLoader.MELONLOADER:
            logOutputPath = path.join(profile.value.getProfilePath(), "MelonLoader", "Latest.log");
            break;
        case PackageLoader.RETURN_OF_MODDING:
            logOutputPath = path.join(profile.value.getProfilePath(), "ReturnOfModding", "LogOutput.log");
            break;
        case PackageLoader.GDWEAVE:
            logOutputPath = path.join(profile.value.getProfilePath(), "GDWeave", "GDWeave.log");
            break;
        case PackageLoader.UMM:
            logOutputPath = path.join(profile.value.getProfilePath(), "UMM", "Core", "Log.txt");
            break;
        case PackageLoader.RIVET:
            logOutputPath = path.join(profile.value.getProfilePath(), "Rivet", "RivetLoader.log");
            break;
    }
    const text = (await fs.readFile(logOutputPath)).toString();
    if (text.length >= 1992) {
        InteractionProvider.instance.copyToClipboard(text);
    } else {
        InteractionProvider.instance.copyToClipboard("```\n" + text + "\n```");
    }
}

async function copyTroubleshootingInfoToClipboard() {
    const content = await store.dispatch('profile/generateTroubleshootingString');
    InteractionProvider.instance.copyToClipboard('```' + content + '```');
}

async function changeDataFolder() {
    try {
        const folder = await DataFolderProvider.instance.showSelectionDialog();

        if (folder === null) {
            return;
        }

        await DataFolderProvider.instance.throwForInvalidFolder(folder);
        await DataFolderProvider.instance.writeOverrideFile(folder);
        await settings.value.setDataDirectory(folder);
        InteractionProvider.instance.restartApp();
    } catch(err) {
        store.commit("error/handleError", R2Error.fromThrownValue(err));
        return
    }
}

async function handleSettingsCallbacks(invokedSetting: any) {
    switch(invokedSetting) {
        case "BrowseDataFolder":
            browseDataFolder();
            break;
        case "BrowseProfileFolder":
            browseProfileFolder();
            break;
        case "ChangeGameDirectory":
            changeGameInstallDirectory();
            break;
        case "ChangeGameDirectoryGamePass":
            changeGameInstallDirectoryGamePass();
            break;
        case "ChangeSteamDirectory":
            changeSteamDirectory();
            break;
        case "CopyLogToClipboard":
            copyLogToClipboard();
            break;
        case "CopyTroubleshootingInfoToClipboard":
            copyTroubleshootingInfoToClipboard();
            break;
        case "ToggleDownloadCache":
            await store.dispatch('download/toggleIgnoreCache');
            break;
        case "ValidateSteamInstallation":
            validateSteamInstallation();
            break;
        case "SetLaunchParameters":
            showLaunchParameters();
            break;
        case "ChangeProfile":
            router.push({name: "profiles"});
            break;
        case "ImportLocalMod":
            importingLocalMod.value = true;
            break;
        case "ToggleFunkyMode":
            setFunkyMode(!settings.value.getContext().global.funkyModeEnabled);
            break;
        case "SwitchTheme":
            toggleDarkTheme();
            document.documentElement.classList.toggle('html--dark', settings.value.getContext().global.darkTheme);
            break;
        case "SwitchCard":
            toggleCardExpanded(!settings.value.getContext().global.expandedCards);
            break;
        case "EnableAll":
            await store.dispatch(
                "profile/enableModsOnActiveProfile",
                {mods: localModList.value}
            );
            await router.push({name: "manager.installed"});
            break;
        case "DisableAll":
            await store.dispatch(
                "profile/disableModsFromActiveProfile",
                {mods: localModList.value}
            );
            await router.push({name: "manager.installed"});
            break;
        case "UpdateAllMods":
            store.commit("openUpdateAllModsModal");
            break;
        case "ShowDependencyStrings":
            showDependencyStrings.value = true;
            break;
        case "ChangeDataFolder":
            await changeDataFolder();
            break;
        case "CleanCache":
            CacheUtil.clean();
            break;
    }
}

store.dispatch('profile/loadOrderingSettings');
store.commit('modFilters/reset');

onMounted(async () => {
    launchParametersModel.value = settings.value.getContext().gameSpecific.launchParameters;
})

</script>

<style lang="scss">
.manager-main-view {
    display: flex;
    flex: 1;
    width: 100%;
}

.router-view {
    display: flex;
    flex: 1;
    width: 100%;
}
</style>
