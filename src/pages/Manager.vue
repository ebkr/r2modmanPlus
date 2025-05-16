<template>
	<div class="manager-main-view">
		<div class='notification is-warning' v-if="portableUpdateAvailable">
			<div class='container'>
				<p>
					An update is available.
					<ExternalLink :url="`https://github.com/ebkr/r2modmanPlus/releases/tag/${updateTagName}`">
                        Click here to go to the release page.
					</ExternalLink>
				</p>
			</div>
		</div>
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
				<p>Some parameters are provided by default:</p>
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
        <DownloadModModal />

        <div class="router-view">
            <router-view name="subview" v-on:setting-invoked="handleSettingsCallbacks($event)" />
        </div>
    </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { Hero, ExternalLink, Modal, Progress } from '../components/all';

import PathResolver from '../r2mm/manager/PathResolver';
import { SteamInstallationValidator} from '../r2mm/manager/SteamInstallationValidator';

import Profile from '../model/Profile';
import VersionNumber from '../model/VersionNumber';
import R2Error from '../model/errors/R2Error';
import ManifestV2 from '../model/ManifestV2';
import ManagerSettings from '../r2mm/manager/ManagerSettings';
import ThemeManager from '../r2mm/manager/ThemeManager';
import ManagerInformation from '../_managerinf/ManagerInformation';
import { DataFolderProvider } from '../providers/ror2/system/DataFolderProvider';
import InteractionProvider from '../providers/ror2/system/InteractionProvider';

import { homedir } from 'os';
import * as path from 'path';
import FsProvider from '../providers/generic/file/FsProvider';
import DownloadModModal from '../components/views/DownloadModModal.vue';
import CacheUtil from '../r2mm/mods/CacheUtil';
import LinkProvider from '../providers/components/LinkProvider';
import Game from '../model/game/Game';
import GameRunnerProvider from '../providers/generic/game/GameRunnerProvider';
import LocalFileImportModal from '../components/importing/LocalFileImportModal.vue';
import { PackageLoader } from '../model/installing/PackageLoader';
import GameInstructions from '../r2mm/launching/instructions/GameInstructions';
import CategoryFilterModal from '../components/modals/CategoryFilterModal.vue';
import ModalCard from '../components/ModalCard.vue';
import ProfileCodeExportModal from '../components/modals/ProfileCodeExportModal.vue';
import SortModal from '../components/modals/SortModal.vue';

@Component({
		components: {
            ProfileCodeExportModal,
            SortModal,
            ModalCard,
            LocalFileImportModal,
            CategoryFilterModal,
            DownloadModModal,
			'hero': Hero,
			'progress-bar': Progress,
			'modal': Modal,
            ExternalLink,
		}
	})
	export default class Manager extends Vue {
		portableUpdateAvailable: boolean = false;
		updateTagName: string = '';
		isValidatingSteamInstallation: boolean = false;
		showSteamIncorrectDirectoryModal: boolean = false;
		showRor2IncorrectDirectoryModal: boolean = false;
		launchParametersModel: string = '';
		showLaunchParameterModal: boolean = false;
        showDependencyStrings: boolean = false;
        importingLocalMod: boolean = false;
        doorstopTarget: string = "";
        vanillaLaunchArgs: string = "";

        get activeGame(): Game {
            return this.$store.state.activeGame;
        }

        get settings(): ManagerSettings {
            return this.$store.getters['settings'];
        };

        get profile(): Profile {
            return this.$store.getters['profile/activeProfile'];
        };

		get localModList(): ManifestV2[] {
			return this.$store.state.profile.modList;
		}

		closeSteamInstallationValidationModal() {
			this.isValidatingSteamInstallation = false;
		}

		async validateSteamInstallation() {
			const res = await SteamInstallationValidator.validateInstallation(this.activeGame);
			if (res instanceof R2Error) {
				this.$store.commit('error/handleError', res);
			} else {
				this.isValidatingSteamInstallation = true;
			}
		}

		computeDefaultInstallDirectory() : string {
			switch(process.platform){
				case 'win32':
					return path.resolve(
						process.env['ProgramFiles(x86)'] || process.env.PROGRAMFILES || 'C:\\Program Files (x86)',
						'Steam', 'steamapps', 'common', this.activeGame.steamFolderName
					);
				case 'linux':
					return path.resolve(homedir(), '.local', 'share', 'Steam', 'steamapps', 'common', this.activeGame.steamFolderName);
                case 'darwin':
                    return path.resolve(homedir(), 'Library', 'Application Support', 'Steam',
                        'steamapps', 'common', this.activeGame.steamFolderName);
                default:
					return '';
			}
		}

		changeGameInstallDirectory() {
			const ror2Directory: string = this.settings.getContext().gameSpecific.gameDirectory || this.computeDefaultInstallDirectory();
			InteractionProvider.instance.selectFile({
                title: `Locate ${this.activeGame.displayName} Executable`,
                // Lazy reduce. Assume Linux name and Windows name are identical besides extension.
                // Should fix if needed, although unlikely.
                filters: (this.activeGame.exeName.map(value => {
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
                        const containsGameExecutable = this.activeGame.exeName.find(exeName => path.basename(files[0]).toLowerCase() === exeName.toLowerCase()) !== undefined
                        if (containsGameExecutable) {
                            await this.settings.setGameDirectory(path.dirname(await FsProvider.instance.realpath(files[0])));
                        } else {
                            this.showRor2IncorrectDirectoryModal = true;
                        }
                    } catch (e) {
                        const err = R2Error.fromThrownValue(e, 'Failed to change the game folder');
                        this.$store.commit('error/handleError', err);
                    }
                }
            });
		}

		changeGameInstallDirectoryGamePass() {
			const ror2Directory: string = this.settings.getContext().gameSpecific.gameDirectory || this.computeDefaultInstallDirectory();
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
							await this.settings.setGameDirectory(path.dirname(await FsProvider.instance.realpath(files[0])));
						} else {
							throw new Error("The selected executable is not gamelaunchhelper.exe");
						}
					} catch (e) {
						const err = R2Error.fromThrownValue(e, 'Failed to change the game folder');
						this.$store.commit('error/handleError', err);
					}
				}
			});
		}

		computeDefaultSteamDirectory() : string {
			switch(process.platform){
				case 'win32':
					return path.resolve(
						process.env['ProgramFiles(x86)'] || process.env.PROGRAMFILES || 'C:\\Program Files (x86)',
						'Steam'
					);
				case 'linux':
					return path.resolve(homedir(), '.local', 'share', 'Steam');
                case 'darwin':
                    return path.resolve(homedir(), 'Library', 'Application Support', 'Steam');
				default:
					return '';
			}
		}

		async checkIfSteamExecutableIsValid(file: string) : Promise<boolean> {
			switch(process.platform){
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

		changeSteamDirectory() {
			const steamDir: string = this.settings.getContext().global.steamDirectory || this.computeDefaultSteamDirectory();
			InteractionProvider.instance.selectFile({
                title: 'Locate Steam Executable',
                defaultPath: steamDir,
                filters: [{name: "steam", extensions: ["exe", "sh", "app"]}],
                buttonLabel: 'Select Executable'
            }).then(async files => {
				if (files.length === 1) {
				    try {
                        if (await this.checkIfSteamExecutableIsValid(files[0])) {
                            await this.settings.setSteamDirectory(path.dirname(await FsProvider.instance.realpath(files[0])));
                        } else {
                            this.showSteamIncorrectDirectoryModal = true;
                        }
                    } catch (e) {
                        const err = R2Error.fromThrownValue(e, 'Failed to change the Steam folder');
                        this.$store.commit('error/handleError', err);
                    }
				}
            });
		}

		setFunkyMode(value: boolean) {
			this.settings.setFunkyMode(value);
		}

		browseDataFolder() {
            LinkProvider.instance.openLink('file://' + PathResolver.ROOT);
		}

        browseProfileFolder() {
            LinkProvider.instance.openLink('file://' + this.profile.getProfilePath());
		}

		toggleCardExpanded(expanded: boolean) {
			if (expanded) {
				this.settings.expandCards();
			} else {
				this.settings.collapseCards();
			}
			this.$router.push({name: "manager.installed"});
		}

		async toggleDarkTheme() {
			await this.settings.toggleDarkTheme();
			ThemeManager.apply();
		}

		isManagerUpdateAvailable() {
			if (!ManagerInformation.IS_PORTABLE) {
				return;
			}
			fetch('https://api.github.com/repos/ebkr/r2modmanPlus/releases')
				.then(response => response.json())
				.then((parsed: any) => {
					parsed.sort((a: any, b: any) => {
						if (b !== null) {
							const versionA = new VersionNumber(a.name);
							const versionB = new VersionNumber(b.name);
							return versionA.isNewerThan(versionB);
						}
						return 1;
					});
					let foundMatch = false;
					parsed.forEach((release: any) => {
						if (!foundMatch && !release.draft) {
							const releaseVersion = new VersionNumber(release.name);
							if (releaseVersion.isNewerThan(ManagerInformation.VERSION)) {
								this.portableUpdateAvailable = true;
								this.updateTagName = release.tag_name;
								foundMatch = true;
								return;
							}
						}
					});
				}).catch(err => {
				// Do nothing, potentially offline. Try next launch.
			});
			return;
		}

		showLaunchParameters() {
			GameInstructions.getInstructionsForGame(this.activeGame, this.profile).then(instructions => {
				this.vanillaLaunchArgs = instructions.vanillaParameters;
			});

			GameRunnerProvider.instance.getGameArguments(this.activeGame, this.profile).then(target => {
				if (target instanceof R2Error) {
					this.doorstopTarget = "";
				} else {
					this.doorstopTarget = target;
				}
			});

			this.launchParametersModel = this.settings.getContext().gameSpecific.launchParameters;
			this.showLaunchParameterModal = true;
		}

		updateLaunchParameters() {
			this.settings.setLaunchParameters(this.launchParametersModel);
			this.showLaunchParameterModal = false;
		}

		async copyLogToClipboard() {
            const fs = FsProvider.instance;
            let logOutputPath = "";
            switch (this.activeGame.packageLoader) {
                case PackageLoader.BEPINEX:
                    logOutputPath = path.join(this.profile.getProfilePath(), "BepInEx", "LogOutput.log");
                    break;
                case PackageLoader.MELON_LOADER:
                    logOutputPath = path.join(this.profile.getProfilePath(), "MelonLoader", "Latest.log");
                    break;
                case PackageLoader.RETURN_OF_MODDING:
                    logOutputPath = path.join(this.profile.getProfilePath(), "ReturnOfModding", "LogOutput.log");
                    break;
                case PackageLoader.GDWEAVE:
                    logOutputPath = path.join(this.profile.getProfilePath(), "GDWeave", "GDWeave.log");
                    break;
            }
            const text = (await fs.readFile(logOutputPath)).toString();
            if (text.length >= 1992) {
                InteractionProvider.instance.copyToClipboard(text);
            } else {
                InteractionProvider.instance.copyToClipboard("```\n" + text + "\n```");
            }
		}

        async copyTroubleshootingInfoToClipboard() {
            const content = await this.$store.dispatch('profile/generateTroubleshootingString');
            InteractionProvider.instance.copyToClipboard('```' + content + '```');
        }

        async changeDataFolder() {
            try {
                const folder = await DataFolderProvider.instance.showSelectionDialog();

                if (folder === null) {
                    return;
                }

                await DataFolderProvider.instance.throwForInvalidFolder(folder);
                await DataFolderProvider.instance.writeOverrideFile(folder);
                await this.settings.setDataDirectory(folder);
                InteractionProvider.instance.restartApp();
            } catch(err) {
                this.$store.commit("error/handleError", R2Error.fromThrownValue(err));
                return
            }
        }

        async handleSettingsCallbacks(invokedSetting: any) {
		    switch(invokedSetting) {
		        case "BrowseDataFolder":
		            this.browseDataFolder();
		            break;
                case "BrowseProfileFolder":
                    this.browseProfileFolder();
                    break;
                case "ChangeGameDirectory":
                    this.changeGameInstallDirectory();
					break;
                case "ChangeGameDirectoryGamePass":
                    this.changeGameInstallDirectoryGamePass();
                    break;
                case "ChangeSteamDirectory":
                    this.changeSteamDirectory();
                    break;
                case "CopyLogToClipboard":
                    this.copyLogToClipboard();
                    break;
                case "CopyTroubleshootingInfoToClipboard":
                    this.copyTroubleshootingInfoToClipboard();
                    break;
                case "ToggleDownloadCache":
                    await this.$store.dispatch('download/toggleIgnoreCache');
                    break;
                case "ValidateSteamInstallation":
                    this.validateSteamInstallation();
                    break;
                case "SetLaunchParameters":
                    this.showLaunchParameters();
                    break;
                case "ChangeProfile":
                    this.$router.push({name: "profiles"});
                    break;
                case "ImportLocalMod":
                    this.importingLocalMod = true;
                    break;
                case "ToggleFunkyMode":
                    this.setFunkyMode(!this.settings.getContext().global.funkyModeEnabled);
                    break;
                case "SwitchTheme":
                    this.toggleDarkTheme();
                    document.documentElement.classList.toggle('html--dark', this.settings.getContext().global.darkTheme);
                    break;
                case "SwitchCard":
                    this.toggleCardExpanded(!this.settings.getContext().global.expandedCards);
                    break;
                case "EnableAll":
                    await this.$store.dispatch(
                        "profile/enableModsOnActiveProfile",
                        {mods: this.localModList}
                    );
                    await this.$router.push({name: "manager.installed"});
                    break;
                case "DisableAll":
                    await this.$store.dispatch(
                        "profile/disableModsFromActiveProfile",
                        {mods: this.localModList}
                    );
                    await this.$router.push({name: "manager.installed"});
                    break;
                case "UpdateAllMods":
                    this.$store.commit("openUpdateAllModsModal");
                    break;
                case "ShowDependencyStrings":
                    this.showDependencyStrings = true;
                    break;
                case "ChangeDataFolder":
                    await this.changeDataFolder();
                    break;
                case "CleanCache":
                    CacheUtil.clean();
                    break;
            }
        }

        async beforeCreate() {
            // Used by SearchAndSort, but need to be called here to
            // ensure the settings are loaded before LocalModList
            // accesses visibleModList from Vuex store.
            await this.$store.dispatch('profile/loadOrderingSettings');

            // Used by OnlineModView, called here for consistency.
            this.$store.commit('modFilters/reset');
        }

		async created() {
			this.launchParametersModel = this.settings.getContext().gameSpecific.launchParameters;

			this.isManagerUpdateAvailable();
		}
	}

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
