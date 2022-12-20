<template>
	<div>
		<div class='notification is-warning' v-if="portableUpdateAvailable">
			<div class='container'>
				<p>
					An update is available.
					<link-component :url="`https://github.com/ebkr/r2modmanPlus/releases/tag/${updateTagName}`"
					                :target="'external'"
					>Click here to go to the release page.
					</link-component>
				</p>
			</div>
		</div>
		<div id='steamIncorrectDir' :class="['modal', {'is-active':(showSteamIncorrectDirectoryModal !== false)}]">
			<div class="modal-background" @click="showSteamIncorrectDirectoryModal = false"></div>
			<div class='modal-content'>
				<div class='notification is-danger'>
					<h3 class='title'>Failed to set the Steam directory</h3>
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
					<h3 class='title'>Failed to set the {{ activeGame.displayName }} directory</h3>
					<p>The executable must be either of the following: "{{ activeGame.exeName.join('", "') }}".</p>
					<p>If this error has appeared but the executable is correct, please run as administrator.</p>
				</div>
			</div>
			<button class="modal-close is-large" aria-label="close"
			        @click="showRor2IncorrectDirectoryModal = false"></button>
		</div>
		<modal v-show="fixingPreloader" :open="fixingPreloader" @close-modal="closePreloaderFixModal">
			<template v-slot:title>
				<p class='card-header-title'>Attempting to fix preloader issues</p>
			</template>
			<template v-slot:body>
				<div class='notification is-warning'>
					<p>You will not not be able to launch the game until Steam has verified the integrity of the
						game.
					</p>
				</div>
				<p>Steam will be started, and will attempt to verify the integrity of {{ activeGame.displayName }}.</p>
				<br/>
				<p>Please check the Steam window for validation progress. If the window has not yet appeared, please be
					patient.
				</p>
			</template>
			<template v-slot:footer>
				<button v-if="dependencyListDisplayType === 'view'" class="button is-info"
				        @click="closePreloaderFixModal()">
					I understand
				</button>
			</template>
		</modal>
        <modal v-show="showDependencyStrings" :open="showDependencyStrings" @close-modal="showDependencyStrings = false;">
            <template v-slot:title>
                <p class='card-header-title'>Dependency string list</p>
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
        </modal>
		<modal v-show="showLaunchParameterModal === true" :open="showLaunchParameterModal" @close-modal="() => {showLaunchParameterModal = false;}">
			<template v-slot:title>
				<p class='card-header-title'>Set custom launch parameters</p>
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
				<input class='input' v-model='launchParametersModel' placeholder='Enter parameters'/>
			</template>
			<template v-slot:footer>
				<button class='button is-info' @click='updateLaunchParameters()'>
					Update launch parameters
				</button>
			</template>
		</modal>
		<modal v-show="exportCode !== ''" :open="exportCode !== ''" @close-modal="() => {exportCode = '';}">
			<template v-slot:title>
				<p class='card-header-title'>Profile exported</p>
			</template>
			<template v-slot:body>
				<p>Your code: <strong>{{exportCode}}</strong> has been copied to your clipboard. Just give it to a
					friend!
				</p>
			</template>
			<template v-slot:footer>
				<button v-if="dependencyListDisplayType === 'view'" class="button is-info" @click="exportCode = ''">
					Done
				</button>
			</template>
		</modal>

        <CategoryFilterModal />
        <LocalFileImportModal :visible="importingLocalMod" @close-modal="importingLocalMod = false" @error="showError($event)"/>
        <DownloadModModal @error="showError($event)" />
        <GameRunningModal :activeGame="activeGame" />

        <router-view name="subview"
                     @error="showError"
                     v-on:setting-invoked="handleSettingsCallbacks($event)" />
    </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { ExpandableCard, Hero, Link, Modal, Progress } from '../components/all';

import ThunderstoreMod from '../model/ThunderstoreMod';
import ThunderstoreCombo from '../model/ThunderstoreCombo';
import ProfileModList from '../r2mm/mods/ProfileModList';
import ProfileInstallerProvider from '../providers/ror2/installing/ProfileInstallerProvider';
import PathResolver from '../r2mm/manager/PathResolver';
import PreloaderFixer from '../r2mm/manager/PreloaderFixer';

import LoggerProvider, { LogSeverity } from '../providers/ror2/logging/LoggerProvider';

import Profile from '../model/Profile';
import VersionNumber from '../model/VersionNumber';
import DependencyListDisplayType from '../model/enums/DependencyListDisplayType';
import R2Error from '../model/errors/R2Error';
import ManifestV2 from '../model/ManifestV2';
import ManagerSettings from '../r2mm/manager/ManagerSettings';
import ThemeManager from '../r2mm/manager/ThemeManager';
import ManagerInformation from '../_managerinf/ManagerInformation';
import InteractionProvider from '../providers/ror2/system/InteractionProvider';

import { homedir } from 'os';
import * as path from 'path';
import FsProvider from '../providers/generic/file/FsProvider';
import DownloadModModal from '../components/views/DownloadModModal.vue';
import CacheUtil from '../r2mm/mods/CacheUtil';
import 'bulma-checkradio/dist/css/bulma-checkradio.min.css';
import LinkProvider from '../providers/components/LinkProvider';
import GameManager from '../model/game/GameManager';
import Game from '../model/game/Game';
import GameRunnerProvider from '../providers/generic/game/GameRunnerProvider';
import LocalFileImportModal from '../components/importing/LocalFileImportModal.vue';
import { PackageLoader } from '../model/installing/PackageLoader';
import GameInstructions from '../r2mm/launching/instructions/GameInstructions';
import CategoryFilterModal from '../components/modals/CategoryFilterModal.vue';
import GameRunningModal from '../components/modals/GameRunningModal.vue';

@Component({
		components: {
            LocalFileImportModal,
            CategoryFilterModal,
            DownloadModModal,
            GameRunningModal,
			'hero': Hero,
			'progress-bar': Progress,
			'ExpandableCard': ExpandableCard,
			'link-component': Link,
			'modal': Modal,
		}
	})
	export default class Manager extends Vue {
		settings: ManagerSettings = new ManagerSettings();
		dependencyListDisplayType: string = DependencyListDisplayType.DISABLE;
		portableUpdateAvailable: boolean = false;
		updateTagName: string = '';
		fixingPreloader: boolean = false;
		exportCode: string = '';
		showSteamIncorrectDirectoryModal: boolean = false;
		showRor2IncorrectDirectoryModal: boolean = false;
		launchParametersModel: string = '';
		showLaunchParameterModal: boolean = false;
        showDependencyStrings: boolean = false;
        importingLocalMod: boolean = false;
        doorstopTarget: string = "";
        vanillaLaunchArgs: string = "";

        private activeGame!: Game;
        private contextProfile: Profile | null = null;

		get thunderstoreModList(): ThunderstoreMod[] {
            return this.$store.state.thunderstoreModList || [];
        }

		get localModList() : ManifestV2[] {
		    if (this.contextProfile !== null) {
                GameInstructions.getInstructionsForGame(this.activeGame, this.contextProfile!).then(async instructions => {
                    this.doorstopTarget = instructions.moddedParameters;
                    this.vanillaLaunchArgs = instructions.vanillaParameters;
                });
                GameRunnerProvider.instance.getGameArguments(this.activeGame, this.contextProfile!).then(target => {
                    if (target instanceof R2Error) {
                        this.doorstopTarget = "";
                    } else {
                        this.doorstopTarget = target;
                    }
                });
            }
			return this.$store.state.localModList || [];
		}

		showError(error: R2Error) {
			this.$emit("error", error);
		}

		closePreloaderFixModal() {
			this.fixingPreloader = false;
		}

		async fixPreloader() {
			const res = await PreloaderFixer.fix(this.activeGame);
			if (res instanceof R2Error) {
				this.showError(res);
			} else {
				this.fixingPreloader = true;
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
                        const err: Error = e as Error;
                        this.showError(new R2Error(
                            "Failed to change the game directory",
                            err.message,
                            null
                        ));
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
						const err: Error = e as Error;
						this.showError(new R2Error(
							"Failed to change the game directory",
							err.message,
							null
						));
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
				        const err: Error = e as Error;
				        this.showError(new R2Error(
				            "Failed to change the Steam directory",
                            err.message,
                            null
                        ));
                    }
				}
            });
		}

		setFunkyMode(value: boolean) {
			this.settings.setFunkyMode(value);
		}

		async exportProfile() {
			const exportErr = await ProfileModList.exportModListToFile(this.contextProfile!);
			if (exportErr instanceof R2Error) {
				this.showError(exportErr);
			}
		}

		async exportProfileAsCode() {
			const exportErr = await ProfileModList.exportModListAsCode(this.contextProfile!, (code: string, err: R2Error | null) => {
				if (err !== null) {
					this.showError(err);
				} else {
					this.exportCode = code;
					InteractionProvider.instance.copyToClipboard(code);
				}
			});
			if (exportErr instanceof R2Error) {
				this.showError(exportErr);
			}
		}

		browseDataFolder() {
            LinkProvider.instance.openLink('file://' + PathResolver.ROOT);
		}

        browseProfileFolder() {
            LinkProvider.instance.openLink('file://' + this.contextProfile!.getPathOfProfile());
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
			const result: R2Error | void = await this.settings.toggleDarkTheme();
			if (result instanceof R2Error) {
				this.showError(result);
			}
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
			this.launchParametersModel = this.settings.getContext().gameSpecific.launchParameters;
			this.showLaunchParameterModal = true;
		}

		updateLaunchParameters() {
			this.settings.setLaunchParameters(this.launchParametersModel);
			this.showLaunchParameterModal = false;
		}

		toggleIgnoreCache() {
			this.settings.setIgnoreCache(!this.settings.getContext().global.ignoreCache);
		}

		async copyLogToClipboard() {
            const fs = FsProvider.instance;
            let logOutputPath = "";
            switch (this.activeGame.packageLoader) {
                case PackageLoader.BEPINEX:
                    logOutputPath = path.join(this.contextProfile!.getPathOfProfile(), "BepInEx", "LogOutput.log");
                    break;
                case PackageLoader.MELON_LOADER:
                    logOutputPath = path.join(this.contextProfile!.getPathOfProfile(), "MelonLoader", "Latest.log");
                    break;
            }
            const text = (await fs.readFile(logOutputPath)).toString();
            if (text.length >= 1992) {
                InteractionProvider.instance.copyToClipboard(text);
            } else {
                InteractionProvider.instance.copyToClipboard("```\n" + text + "\n```");
            }
		}

        async setAllModsEnabled(enabled: boolean) {
            for (const mod of this.localModList) {
                let profileErr: R2Error | void;
                if (enabled) {
                    profileErr = await ProfileInstallerProvider.instance.enableMod(mod, this.contextProfile!);
                } else {
                    profileErr = await ProfileInstallerProvider.instance.disableMod(mod, this.contextProfile!);
                }
                if (profileErr instanceof R2Error) {
                    this.showError(profileErr);
                    continue;
                }
                const update: ManifestV2[] | R2Error = await ProfileModList.updateMod(mod, this.contextProfile!, async (updatingMod: ManifestV2) => {
                    if (enabled) {
                        updatingMod.enable();
                    } else {
                        updatingMod.disable();
                    }
                });
                if (update instanceof R2Error) {
                    this.showError(update);
                    continue;
                }
                await this.$store.dispatch("updateModList", update);
            }
            await this.$router.push({name: "manager.installed"});
        }

        changeDataFolder() {
            const fs = FsProvider.instance;
            const dir: string = PathResolver.ROOT;
            InteractionProvider.instance.selectFolder({
                title: `Select a new folder to store ${ManagerInformation.APP_NAME} data`,
                defaultPath: dir,
                buttonLabel: 'Select Data Folder'
            }).then(async files => {
                if (files.length === 1) {
                    const filesInDirectory = await fs.readdir(files[0]);
                    if (filesInDirectory.length > 0 && files[0] !== PathResolver.APPDATA_DIR) {
                        this.showError(new R2Error("Selected directory is not empty", `Directory is not empty: ${files[0]}. Contains ${filesInDirectory.length} files.`, "Select an empty directory or create a new one."));
                        return;
                    } else {
                        await this.settings.setDataDirectory(files[0]);
                        InteractionProvider.instance.restartApp();
                    }
                }
            });
        }

        handleSettingsCallbacks(invokedSetting: any) {
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
                case "ToggleDownloadCache":
                    this.toggleIgnoreCache();
                    break;
                case "RunPreloaderFix":
                    this.fixPreloader();
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
                case "ExportFile":
                    this.exportProfile();
                    break;
                case "ExportCode":
                    this.exportProfileAsCode();
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
                    this.settings = (() => this.settings)();
                    break;
                case "EnableAll":
                    this.setAllModsEnabled(true);
                    break;
                case "DisableAll":
                    this.setAllModsEnabled(false);
                    break;
                case "UpdateAllMods":
                    this.$store.commit("openUpdateAllModsModal");
                    break;
                case "ShowDependencyStrings":
                    this.showDependencyStrings = true;
                    break;
                case "ChangeDataFolder":
                    this.changeDataFolder();
                    break;
                case "CleanCache":
                    CacheUtil.clean();
                    break;
                case "RefreshedThunderstorePackages":
                    ProfileModList.getModList(this.contextProfile!).then(value => {
                        if (!(value instanceof R2Error)) {
                            this.$store.dispatch("updateModList", value);
                        }
                    });
                    break;
            }
        }

        beforeCreate() {
            this.activeGame = GameManager.activeGame;
        }

		async created() {
		    this.settings = await ManagerSettings.getSingleton(this.activeGame);
		    this.contextProfile = Profile.getActiveProfile();
			this.launchParametersModel = this.settings.getContext().gameSpecific.launchParameters;
			const newModList: ManifestV2[] | R2Error = await ProfileModList.getModList(this.contextProfile!);
			if (!(newModList instanceof R2Error)) {
				await this.$store.dispatch("updateModList", newModList);
			} else {
                LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, `Failed to retrieve local mod list\n-> ${newModList.message}`);
                this.$emit('error', newModList);
			}
			this.$store.commit("modFilters/reset");

			InteractionProvider.instance.hookModInstallProtocol(async data => {
                const combo: ThunderstoreCombo | R2Error = ThunderstoreCombo.fromProtocol(data, this.thunderstoreModList);
                if (combo instanceof R2Error) {
                    this.showError(combo);
                    LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, `${combo.name}\n-> ${combo.message}`);
                    return;
                }
                DownloadModModal.downloadSpecific(this.activeGame, this.contextProfile!, combo, this.thunderstoreModList)
                    .then(async value => {
                        const modList = await ProfileModList.getModList(this.contextProfile!);
                        if (!(modList instanceof R2Error)) {
                            await this.$store.dispatch('updateModList', modList);
                        } else {
                            this.showError(modList);
                        }
                    })
                    .catch(this.showError);
            });

			this.isManagerUpdateAvailable();
		}
	}

</script>
