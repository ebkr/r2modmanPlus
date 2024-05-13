<template>
	<div>
		<div class='notification is-warning' v-if="portableUpdateAvailable">
			<div class='container'>
				<p>
                    {{ $t(`pages.manager.update`) }}
					<link-component :url="`https://github.com/ebkr/r2modmanPlus/releases/tag/${updateTagName}`"
					                :target="'external'"
					>{{ $t(`pages.manager.clickHere`) }}
					</link-component>
				</p>
			</div>
		</div>
		<div id='steamIncorrectDir' :class="['modal', {'is-active':(showSteamIncorrectDirectoryModal !== false)}]">
			<div class="modal-background" @click="showSteamIncorrectDirectoryModal = false"></div>
			<div class='modal-content'>
				<div class='notification is-danger'>
					<h3 class='title'>{{ $t(`pages.manager.steamIncorrectDir`) }}</h3>
					<p>{{ $t(`pages.manager.steamIncorrectDirTip1`) }}</p>
					<p>{{ $t(`pages.manager.steamIncorrectDirTip2`) }}</p>
				</div>
			</div>
			<button class="modal-close is-large" aria-label="close"
			        @click="showSteamIncorrectDirectoryModal = false"></button>
		</div>
		<div id='ror2IncorrectDir' :class="['modal', {'is-active':(showRor2IncorrectDirectoryModal !== false)}]">
			<div class="modal-background" @click="showRor2IncorrectDirectoryModal = false"></div>
			<div class='modal-content'>
				<div class='notification is-danger'>
					<h3 class='title'>{{ $t(`pages.manager.IncorrectDir`, {name: activeGame.displayName}) }}</h3>
					<p>{{ $t(`pages.manager.IncorrectDirTip1`, {name: activeGame.exeName.join('", "')}) }}</p>
					<p>{{ $t(`pages.manager.IncorrectDirTip2`) }}</p>
				</div>
			</div>
			<button class="modal-close is-large" aria-label="close"
			        @click="showRor2IncorrectDirectoryModal = false"></button>
		</div>
		<modal v-show="fixingPreloader" :open="fixingPreloader" @close-modal="closePreloaderFixModal">
			<template v-slot:title>
				<p class='card-header-title'>{{ $t(`pages.manager.fixingPreloader`) }}</p>
			</template>
			<template v-slot:body>
				<div class='notification is-warning'>
					<p>
                        {{ $t(`pages.manager.fixingPreloaderTip1`) }}
					</p>
				</div>
				<p>
                    {{ $t(`pages.manager.fixingPreloaderTip2`, {name: activeGame.displayName}) }}
                </p>
				<br/>
				<p>
                    {{ $t(`pages.manager.fixingPreloaderTip3`) }}
				</p>
			</template>
			<template v-slot:footer>
				<button v-if="dependencyListDisplayType === 'view'" class="button is-info"
				        @click="closePreloaderFixModal()">
                    {{ $t(`pages.manager.understand`) }}
				</button>
			</template>
		</modal>
        <modal v-if="showDependencyStrings" :open="showDependencyStrings" @close-modal="showDependencyStrings = false;">
            <template v-slot:title>
                <p class='card-header-title'>{{ $t(`pages.manager.showDependencyStrings`) }}</p>
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
				<p class='card-header-title'>{{ $t(`pages.manager.parameters`) }}</p>
			</template>
			<template v-slot:body>
				<p>{{ $t(`pages.manager.default`) }}</p>
				<br/>
				<p>{{ $t(`pages.manager.modded`) }}
					<br/>
					<code v-if="doorstopTarget.length > 0">
						{{ doorstopTarget }}
					</code>
                    <code v-else>{{ $t(`pages.manager.moddedElse`) }}</code>
				</p>
				<br/>
				<p>{{ $t(`pages.manager.vanilla`) }}
					<br>
					<code>
						{{ vanillaLaunchArgs }}
					</code>
				</p>
				<br/>
				<p>
					<strong>{{ $t(`pages.manager.vanillaTip`) }}</strong>
				</p>
				<br/>
				<input class='input' v-model='launchParametersModel' :placeholder='$t(`pages.manager.placeholder`)'/>
			</template>
			<template v-slot:footer>
				<button class='button is-info' @click='updateLaunchParameters()'>
                    {{ $t(`pages.manager.updateParameters`) }}
				</button>
			</template>
		</modal>
		<modal v-show="exportCode !== ''" :open="exportCode !== ''" @close-modal="() => {exportCode = '';}">
			<template v-slot:title>
				<p class='card-header-title'>{{ $t(`pages.manager.exported`) }}</p>
			</template>
			<template v-slot:body>
                <i18n path="pages.manager.exportedTip" tag="p">
                    <template v-slot:strong>
                        <strong>{{exportCode}}</strong>
                    </template>
                </i18n>
			</template>
			<template v-slot:footer>
				<button v-if="dependencyListDisplayType === 'view'" class="button is-info" @click="exportCode = ''">
                    {{ $t(`pages.manager.done`) }}
				</button>
			</template>
		</modal>
        <modal v-show="showLanguageModal === true" :open="showLanguageModal" @close-modal="() => {showLanguageModal = false;}">
            <template v-slot:title>
                <p class='card-header-title'>{{ $t(`pages.manager.selectLanguage`) }}</p>
            </template>
            <template v-slot:body>
                <select
                    v-model="displayLanguage"
                    id="display-language"
                    class="select select--content-spacing margin-right margin-right--half-width">
                    <option v-for="(value, key) in languageOption" :key="`language-option-${option}`" :value="key">
                        {{ value }}
                    </option>
                </select>
            </template>
            <template v-slot:footer>
                <button class='button is-info' @click='updateDisplayLanguage()'>
                    {{ $t(`pages.manager.setLanguage`) }}
                </button>
            </template>
        </modal>

        <CategoryFilterModal />
        <LocalFileImportModal :visible="importingLocalMod" @close-modal="importingLocalMod = false" />
        <DownloadModModal />

        <router-view name="subview"
                     v-on:setting-invoked="handleSettingsCallbacks($event)" />
    </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { Hero, Link, Modal, Progress } from '../components/all';

import ThunderstoreMod from '../model/ThunderstoreMod';
import ThunderstoreCombo from '../model/ThunderstoreCombo';
import ProfileModList from '../r2mm/mods/ProfileModList';
import PathResolver from '../r2mm/manager/PathResolver';
import PreloaderFixer from '../r2mm/manager/PreloaderFixer';

import { LogSeverity } from '../providers/ror2/logging/LoggerProvider';

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
import Game from '../model/game/Game';
import GameRunnerProvider from '../providers/generic/game/GameRunnerProvider';
import LocalFileImportModal from '../components/importing/LocalFileImportModal.vue';
import { PackageLoader } from '../model/installing/PackageLoader';
import GameInstructions from '../r2mm/launching/instructions/GameInstructions';
import CategoryFilterModal from '../components/modals/CategoryFilterModal.vue';
import Language from 'src/model/enums/Language';

@Component({
		components: {
            LocalFileImportModal,
            CategoryFilterModal,
            DownloadModModal,
			'hero': Hero,
			'progress-bar': Progress,
			'link-component': Link,
			'modal': Modal,
		}
	})
	export default class Manager extends Vue {
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
        showLanguageModal: boolean = false;
        displayLanguage: string = this.$i18n.locale;

        get activeGame(): Game {
            return this.$store.state.activeGame;
        }

        get settings(): ManagerSettings {
            return this.$store.getters['settings'];
        };

        get profile(): Profile {
            return this.$store.getters['profile/activeProfile'];
        };

		get thunderstoreModList(): ThunderstoreMod[] {
            return this.$store.state.tsMods.mods;
        }

		get localModList(): ManifestV2[] {
			return this.$store.state.profile.modList;
		}

        get languageOption(){
            return Language;
        }

		closePreloaderFixModal() {
			this.fixingPreloader = false;
		}

		async fixPreloader() {
			const res = await PreloaderFixer.fix(this.activeGame);
			if (res instanceof R2Error) {
				this.$store.commit('error/handleError', res);
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
                title: this.$t(`pages.manager.locate`, [this.activeGame.displayName]),
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
                buttonLabel: this.$t(`pages.manager.selectExecutable`)
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
                        const err = R2Error.fromThrownValue(e, 'Failed to change the game directory');
                        this.$store.commit('error/handleError', err);
                    }
                }
            });
		}

		changeGameInstallDirectoryGamePass() {
			const ror2Directory: string = this.settings.getContext().gameSpecific.gameDirectory || this.computeDefaultInstallDirectory();
			InteractionProvider.instance.selectFile({
                title: this.$t(`pages.manager.locate`, ['gamelaunchhelper']),
                filters: [{ name: "gamelaunchhelper", extensions: ["exe"] }],
				defaultPath: ror2Directory,
				buttonLabel: this.$t(`pages.manager.selectExecutable`)
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
						const err = R2Error.fromThrownValue(e, 'Failed to change the game directory');
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
                title: this.$t(`pages.manager.locate`, ['Steam']),
                defaultPath: steamDir,
                filters: [{name: "steam", extensions: ["exe", "sh", "app"]}],
                buttonLabel: this.$t(`pages.manager.selectExecutable`)
            }).then(async files => {
				if (files.length === 1) {
				    try {
                        if (await this.checkIfSteamExecutableIsValid(files[0])) {
                            await this.settings.setSteamDirectory(path.dirname(await FsProvider.instance.realpath(files[0])));
                        } else {
                            this.showSteamIncorrectDirectoryModal = true;
                        }
                    } catch (e) {
                        const err = R2Error.fromThrownValue(e, 'Failed to change the Steam directory');
                        this.$store.commit('error/handleError', err);
                    }
				}
            });
		}

		setFunkyMode(value: boolean) {
			this.settings.setFunkyMode(value);
		}

		async exportProfile() {
			if (!this.localModList.length) {
				const err = new R2Error(
					'Profile is empty',
					'The profile must contain at least one mod to export it as a file.'
				);
				this.$store.commit('error/handleError', err);
				return;
			}
			const exportErr = await ProfileModList.exportModListToFile(this.profile);
			if (exportErr instanceof R2Error) {
				this.$store.commit('error/handleError', exportErr);
			}
		}

		async exportProfileAsCode() {
			if (!this.localModList.length) {
				const err = new R2Error(
					'Profile is empty',
					'The profile must contain at least one mod to export it as a code.'
				);
				this.$store.commit('error/handleError', err);
				return;
			}
			const exportErr = await ProfileModList.exportModListAsCode(this.profile, (code: string, err: R2Error | null) => {
				if (err !== null) {
					this.$store.commit('error/handleError', err);
				} else {
					this.exportCode = code;
					InteractionProvider.instance.copyToClipboard(code);
				}
			});
			if (exportErr instanceof R2Error) {
				this.$store.commit('error/handleError', exportErr);
			}
		}

		browseDataFolder() {
            LinkProvider.instance.openLink('file://' + PathResolver.ROOT);
		}

        browseProfileFolder() {
            LinkProvider.instance.openLink('file://' + this.profile.getPathOfProfile());
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

        showDisplayLanguage() {
            this.showLanguageModal = true;
        }

		updateLaunchParameters() {
			this.settings.setLaunchParameters(this.launchParametersModel);
			this.showLaunchParameterModal = false;
		}

        updateDisplayLanguage() {
            this.$i18n.locale = this.displayLanguage;
            this.settings.setDisplayLanguage(this.displayLanguage);
            this.showLanguageModal = false;
        }

		toggleIgnoreCache() {
			this.settings.setIgnoreCache(!this.settings.getContext().global.ignoreCache);
		}

		async copyLogToClipboard() {
            const fs = FsProvider.instance;
            let logOutputPath = "";
            switch (this.activeGame.packageLoader) {
                case PackageLoader.BEPINEX:
                    logOutputPath = path.join(this.profile.getPathOfProfile(), "BepInEx", "LogOutput.log");
                    break;
                case PackageLoader.MELON_LOADER:
                    logOutputPath = path.join(this.profile.getPathOfProfile(), "MelonLoader", "Latest.log");
                    break;
            }
            const text = (await fs.readFile(logOutputPath)).toString();
            if (text.length >= 1992) {
                InteractionProvider.instance.copyToClipboard(text);
            } else {
                InteractionProvider.instance.copyToClipboard("```\n" + text + "\n```");
            }
		}

        changeDataFolder() {
            const fs = FsProvider.instance;
            const dir: string = PathResolver.ROOT;
            InteractionProvider.instance.selectFolder({
                title: this.$t(`pages.manager.selectNew`, [ManagerInformation.APP_NAME]),
                defaultPath: dir,
                buttonLabel: this.$t(`pages.manager.selectFolder`)
            }).then(async files => {
                if (files.length === 1) {
                    const dataDirectoryOverrideFile = ".ddir.mm";
                    const filesInDirectory = await fs.readdir(files[0]);

                    const hasOverrideFile = filesInDirectory.find(value => value.toLowerCase() === dataDirectoryOverrideFile) != undefined;
                    const directoryHasContents = filesInDirectory.length > 0;
                    const isDefaultDataDirectory = files[0] === PathResolver.APPDATA_DIR;

                    if (hasOverrideFile || !directoryHasContents || isDefaultDataDirectory) {
                        // Write dataDirectoryOverrideFile to allow re-selection of directory if changed at a later point.
                        await fs.writeFile(path.join(files[0], dataDirectoryOverrideFile), "");
                        await this.settings.setDataDirectory(files[0]);
                        InteractionProvider.instance.restartApp();
                    } else {
                        this.$store.commit('error/handleError', new R2Error(
                            "Selected directory is not empty",
                            `Directory is not empty: ${files[0]}. Contains ${filesInDirectory.length} files.`,
                            "Select an empty directory or create a new one."
                        ));
                    }
                }
            }).catch((err) => {
                this.$store.commit(
                    "error/handleError",
                    R2Error.fromThrownValue(err, "Failed to change Data Folder")
                );
            });
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
                    this.changeDataFolder();
                    break;
                case "CleanCache":
                    CacheUtil.clean();
                    break;
                case "SetDisplayLanguage":
                    this.showDisplayLanguage();
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

			InteractionProvider.instance.hookModInstallProtocol(async data => {
                const combo: ThunderstoreCombo | R2Error = ThunderstoreCombo.fromProtocol(data, this.thunderstoreModList);
                if (combo instanceof R2Error) {
                    this.$store.commit('error/handleError', {
                        error: combo,
                        severity: LogSeverity.ACTION_STOPPED
                    });
                    return;
                }
                DownloadModModal.downloadSpecific(this.activeGame, this.profile, combo, this.thunderstoreModList)
                    .then(async value => {
                        const modList = await ProfileModList.getModList(this.profile);
                        if (!(modList instanceof R2Error)) {
                            await this.$store.dispatch('profile/updateModList', modList);
                        } else {
                            this.$store.commit('error/handleError', modList);
                        }
                    })
                    .catch(
                        (err: R2Error) => this.$store.commit('error/handleError', err)
                    );
            });

			this.isManagerUpdateAvailable();
		}
	}

</script>
