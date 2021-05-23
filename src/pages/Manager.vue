<template>
	<div>
        <div class='file-drop'>
            <div :class="['modal', {'is-active':showDragAndDropModal}]">
                <div class="modal-background"></div>
                <div class='modal-content'>
                    <div class='notification is-info'>
                        <h3 class='title' id='dragText'>{{dragAndDropText}}</h3>
                    </div>
                </div>
            </div>
        </div>
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
					<p>The directory must contain the Steam executable file.</p>
					<p>If this error has appeared, but the directory is correct, please run as administrator.</p>
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
					<p>The directory must contain either of the following: "{{ activeGame.exeName.join('", "') }}".</p>
					<p>If this error has appeared, but the directory is correct, please run as administrator.</p>
				</div>
			</div>
			<button class="modal-close is-large" aria-label="close"
			        @click="showRor2IncorrectDirectoryModal = false"></button>
		</div>
		<modal v-show="fixingPreloader" @close-modal="closePreloaderFixModal">
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
        <modal v-show="showDependencyStrings" @close-modal="showDependencyStrings = false;">
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
		<modal v-show="showLaunchParameterModal === true" @close-modal="() => {showLaunchParameterModal = false;}">
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
                    <code v-else>These parameters will be available after installing BepInEx.</code>
				</p>
				<br/>
				<p>Vanilla:
					<br>
					<code>
						--doorstop-enable false
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
		<modal v-show="exportCode !== ''" @close-modal="() => {exportCode = '';}">
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

        <modal v-show="showCategoryFilterModal" :show-close="false">
            <template v-slot:title>
                <p class='card-header-title'>Filter mod categories</p>
            </template>
            <template v-slot:body>

                <div class="input-group">
                    <label>Categories</label>
                    <select class="select select--content-spacing" @change="addFilterCategory($event.target)">
                        <option selected disabled>
                            Select a category
                        </option>
                        <option v-for="(key, index) in availableCategories" :key="`category--${key}-${index}`">
                            {{ key }}
                        </option>
                    </select>
                </div>
                <br/>
                <div class="input-group">
                    <label>Selected categories:</label>
                    <div class="field has-addons" v-if="filterCategories.length > 0">
                        <div class="control" v-for="(key, index) in filterCategories" :key="`${key}-${index}`">
                            <span class="block margin-right">
                                <a href="#" @click="removeCategory(key)">
                                    <span class="tags has-addons">
                                        <span class="tag">{{ key }}</span>
                                        <span class="tag is-danger">
                                            <i class="fas fa-times"></i>
                                        </span>
                                    </span>
                                </a>
                            </span>
                        </div>
                    </div>
                    <div class="field has-addons" v-else>
                        <span class="tags">
                            <span class="tag">No categories selected</span>
                        </span>
                    </div>
                </div>
                <hr/>
                <div>
                    <input class="is-checkradio" id="nsfwCheckbox" type="checkbox" :class="[{'is-dark':!settings.darkTheme}, {'is-white':settings.darkTheme}]" v-model="allowNsfw">
                    <label for="nsfwCheckbox">Allow NSFW (potentially explicit) mods</label>
                </div>
                <br/>
                <div>
                    <div v-for="(key, index) in categoryFilterValues" :key="`cat-filter-${key}-${index}`">
                        <input type="radio" :id="`cat-filter-${key}-${index}`" name="categoryFilterCondition" :value=key :checked="index === 0 ? true : undefined" v-model="categoryFilterMode">
                        <label :for="`cat-filter-${key}-${index}`">&nbsp;{{ key }}</label>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <button class="button is-info" @click="showCategoryFilterModal = false;">
                    Apply filters
                </button>
            </template>
        </modal>

        <DownloadModModal
            :show-download-modal="showUpdateAllModal"
            :update-all-mods="true"
            :thunderstore-mod="null"
            @closed-modal="showUpdateAllModal = false;"
            @error="showError($event)"
        />

		<div class='columns' id='content'>
			<div class="column non-selectable" :class="navbarClass">
                <NavigationMenu :view="view"
                                @clicked-installed="view = 'installed'"
                                @clicked-online="view = 'online'"
                                @clicked-settings="view = 'settings'"
                                @clicked-help="openRoute('/help')"
                                @clicked-config-editor="openRoute('/config-editor')"
                                @clicked-back="$router.go(-1)"
                                @error="showError($event)"
                />
			</div>
			<div class="column" :class="contentClass">
				<div v-show="view === 'online'">
					<div class='sticky-top sticky-top--search border-at-bottom non-selectable'>
						<div class='card is-shadowless is-square'>
							<div class='card-header-title'>
                                <div class="input-group input-group--flex margin-right">
                                    <label for="thunderstore-search-filter">Search</label>
                                    <input id="thunderstore-search-filter" v-model='thunderstoreSearchFilter' class="input" type="text" placeholder="Search for a mod"/>
                                </div>
                                <div class="input-group margin-right">
                                    <label for="thunderstore-sort">Sort</label>
                                    <select id="thunderstore-sort" class='select select--content-spacing' v-model="sortingStyleModel">
                                        <option v-for="(key) in getSortOptions()" v-bind:key="key">{{key}}</option>
                                    </select>
                                    <span>&nbsp;</span>
                                    <select class='select select--content-spacing' v-model="sortingDirectionModel"
                                            :disabled="sortingStyleModel === 'Default'">
                                        <option v-for="(key) in getSortDirections()" v-bind:key="key">{{key}}</option>
                                    </select>
                                </div>
                                <div class="input-group">
                                    <div class="input-group input-group--flex">
                                        <label for="thunderstore-category-filter">Additional filters</label>
                                        <button id="thunderstore-category-filter" class="button" @click="showCategoryFilterModal = true;">Filter categories</button>
                                    </div>
                                </div>
							</div>
						</div>
					</div>
					<OnlineModList
                        :settings="settings"
                        :local-mod-list="localModList"
                        :paged-mod-list="pagedThunderstoreModList"
                        @error="showError($event)"
                    />
					<div class='in-mod-list' v-if='getPaginationSize() > 1'>
						<p class='notification margin-right'>
							Use the numbers below to change page
						</p>
					</div>
					<div class='in-mod-list' v-else-if='getPaginationSize() === 0'>
						<p class='notification margin-right'>
							No mods with that name found
						</p>
					</div>
                    <br/>
					<div class='pagination'>
						<div class='smaller-font'>
							<a v-for='index in getPaginationSize()' :key='"pagination-" + index'
							   :class='["pagination-link", {"is-current": index === pageNumber}]'
							   @click='updatePageNumber(index)'>
								{{index}}
							</a>
						</div>
					</div>
				</div>
				<div v-show="view === 'installed'" class="relative-position full-height--minus-em">
					<template>
						<div class='absolute-center text-center top' v-if="localModList.length === 0">
                            <div class="margin-right">
                                <div>
                                    <i class="fas fa-exclamation fa-5x"></i>
                                </div>
                                <br/>
                                <h3 class='title is-4'>Looks like you don't have any mods installed</h3>
                                <h4 class='subtitle is-5'>Click the Online tab on the left, or click <a
                                        @click="view = 'online'"
                                >here</a>.
                                </h4>
                            </div>
						</div>
						<template v-if="localModList.length > 0">
							<LocalModList
                                :settings="settings"
                                @error="showError($event)">
                                <template v-slot:above-list v-if="numberOfModsWithUpdates > 0 && !dismissedUpdateAll">
                                    <br/>
                                    <div class="margin-bottom">
                                        <div class="notification is-warning margin-right">
                                            <span>You have {{ numberOfModsWithUpdates }} available mod update{{ numberOfModsWithUpdates > 1 ? "s" : ""}}. Would you like to <a @click="showUpdateAllModal = true">update all</a>?</span>
                                            <a class="float-right cursor-pointer" @click="$store.dispatch('dismissUpdateAll')"><i class="fas fa-times"></i></a>
                                        </div>
                                    </div>
                                </template>
                            </LocalModList>
						</template>
					</template>
				</div>
				<div v-show="view === 'settings'">
					<template>
                        <settings-view v-on:setting-invoked="handleSettingsCallbacks($event)"/>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang='ts'>
	import Vue from 'vue';
	import Component from 'vue-class-component';
    import { Prop, Watch } from 'vue-property-decorator';
	import { ExpandableCard, Hero, Link, Modal, Progress } from '../components/all';

	import ThunderstoreMod from '../model/ThunderstoreMod';
	import ThunderstoreCombo from '../model/ThunderstoreCombo';
	import Mod from '../model/Mod';
	import ThunderstoreDownloaderProvider from '../providers/ror2/downloading/ThunderstoreDownloaderProvider';
	import ThunderstoreVersion from '../model/ThunderstoreVersion';
	import ProfileModList from '../r2mm/mods/ProfileModList';
	import ProfileInstallerProvider from '../providers/ror2/installing/ProfileInstallerProvider';
	import PathResolver from '../r2mm/manager/PathResolver';
	import PreloaderFixer from '../r2mm/manager/PreloaderFixer';

	import LoggerProvider, { LogSeverity } from '../providers/ror2/logging/LoggerProvider';

	import Profile from '../model/Profile';
	import VersionNumber from '../model/VersionNumber';
	import StatusEnum from '../model/enums/StatusEnum';
	import SortingStyle from '../model/enums/SortingStyle';
	import SortingDirection from '../model/enums/SortingDirection';
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
    import LocalModInstallerProvider from '../providers/ror2/installing/LocalModInstallerProvider';

    import FileDragDrop from '../r2mm/data/FileDragDrop';
    import SettingsView from '../components/settings-components/SettingsView.vue';
    import DownloadModModal from '../components/views/DownloadModModal.vue';
    import CacheUtil from '../r2mm/mods/CacheUtil';
    import CategoryFilterMode from '../model/enums/CategoryFilterMode';
    import ArrayUtils from '../utils/ArrayUtils';
    import 'bulma-checkradio/dist/css/bulma-checkradio.min.css';
    import LinkProvider from '../providers/components/LinkProvider';
    import SettingsViewProvider from '../providers/components/loaders/SettingsViewProvider';
    import OnlineModListProvider from '../providers/components/loaders/OnlineModListProvider';
    import LocalModListProvider from '../providers/components/loaders/LocalModListProvider';
    import NavigationMenuProvider from '../providers/components/loaders/NavigationMenuProvider';
    import GameManager from '../model/game/GameManager';
    import Game from '../model/game/Game';
    import GameRunnerProvider from '../providers/generic/game/GameRunnerProvider';

	@Component({
		components: {
            OnlineModList: OnlineModListProvider.provider,
            LocalModList: LocalModListProvider.provider,
            NavigationMenu: NavigationMenuProvider.provider,
            SettingsView,
            DownloadModModal,
			'hero': Hero,
			'progress-bar': Progress,
			'ExpandableCard': ExpandableCard,
			'link-component': Link,
			'modal': Modal,
            'settings-view': SettingsViewProvider.provider,
		}
	})
	export default class Manager extends Vue {

	    @Prop({default: "is-one-quarter"})
        private navbarClass!: string;

        @Prop({default: "is-three-quarters"})
        private contentClass!: string;


		view: string = 'installed';
		sortedThunderstoreModList: ThunderstoreMod[] = [];
		searchableThunderstoreModList: ThunderstoreMod[] = [];
		pagedThunderstoreModList: ThunderstoreMod[] = [];
		thunderstoreSearchFilter: string = '';
		settings: ManagerSettings = new ManagerSettings();
		// Increment by one each time new modal is shown
		downloadObject: any | null = null;
		downloadingMod: boolean = false;
		sortingStyleModel: string = SortingStyle.DEFAULT;
		sortingStyle: string = SortingStyle.DEFAULT;
		sortingDirectionModel: string = SortingDirection.STANDARD;
		sortDescending: boolean = true;
		dependencyListDisplayType: string = DependencyListDisplayType.DISABLE;
		portableUpdateAvailable: boolean = false;
		updateTagName: string = '';
		fixingPreloader: boolean = false;
		exportCode: string = '';
		pageNumber: number = 1;
		showSteamIncorrectDirectoryModal: boolean = false;
		showRor2IncorrectDirectoryModal: boolean = false;
		launchParametersModel: string = '';
		showLaunchParameterModal: boolean = false;
		dragAndDropText: string = 'Drag and drop file here to install mod';
		showDragAndDropModal: boolean = false;
		showUpdateAllModal: boolean = false;
        showDependencyStrings: boolean = false;

        showCategoryFilterModal: boolean = false;
        filterCategories: string[] = [];
        categoryFilterMode: string = CategoryFilterMode.OR;
        allowNsfw: boolean = false;

        doorstopTarget: string = "";

        private activeGame!: Game;
        private contextProfile: Profile | null = null;

		@Watch('pageNumber')
		changePage() {
			this.pagedThunderstoreModList = this.searchableThunderstoreModList.slice(
				(this.pageNumber - 1) * this.getPageResultSize(),
				this.pageNumber * this.getPageResultSize());
		}

		@Watch('thunderstoreSearchFilter')
		onThunderstoreFilterUpdate() {
			this.pageNumber = 1;
			this.filterThunderstoreModList();
		}

		get thunderstoreModList(): ThunderstoreMod[] {
            return this.$store.state.thunderstoreModList || [];
        }

        get profilePath(): string {
		    if (this.contextProfile === null) {
		        return "";
            }
		    return this.contextProfile!.getPathOfProfile().replace("/", "\\");
        }

        get appName(): string {
		    return ManagerInformation.APP_NAME;
        }

        get numberOfModsWithUpdates(): number {
		    return ThunderstoreDownloaderProvider.instance.getLatestOfAllToUpdate(this.$store.state.localModList, this.$store.state.thunderstoreModList).length;
        }

        get dismissedUpdateAll() {
		    return this.$store.state.dismissedUpdateAll;
        }

        @Watch("thunderstoreModList")
        @Watch("showCategoryFilterModal")
        thunderstoreModListUpdate() {
		    this.sortThunderstoreModList();
        }

		filterThunderstoreModList() {
			this.searchableThunderstoreModList = this.sortedThunderstoreModList.filter((x: ThunderstoreMod) => {
				return x.getFullName().toLowerCase().indexOf(this.thunderstoreSearchFilter.toLowerCase()) >= 0
                    || x.getVersions()[0].getDescription().toLowerCase().indexOf(this.thunderstoreSearchFilter.toLowerCase()) >= 0
                    || this.thunderstoreSearchFilter.trim() === '';
			});
			this.searchableThunderstoreModList = this.searchableThunderstoreModList.filter(mod => (mod.getNsfwFlag() && this.allowNsfw) || !mod.getNsfwFlag());
			if (this.filterCategories.length > 0) {
			    this.searchableThunderstoreModList = this.searchableThunderstoreModList.filter((x: ThunderstoreMod) => {
			        switch(this.categoryFilterMode) {
			            case CategoryFilterMode.OR:
			                return ArrayUtils.includesSome(x.getCategories(), this.filterCategories);
                        case CategoryFilterMode.AND:
                            return ArrayUtils.includesAll(x.getCategories(), this.filterCategories);
                        case CategoryFilterMode.EXCLUDE:
                            return !ArrayUtils.includesSome(x.getCategories(), this.filterCategories);
                    }
                })
            }
			this.changePage();
		}

		@Watch('sortingStyleModel')
		@Watch('sortingDirectionModel')
		sortThunderstoreModList() {
			this.sortingStyle = this.sortingStyleModel;
			this.sortDescending = this.sortingDirectionModel == SortingDirection.STANDARD;
			const sortedList = [...this.thunderstoreModList];
			sortedList.sort((a: ThunderstoreMod, b: ThunderstoreMod) => {
				let result: boolean;
				switch (this.sortingStyle) {
					case SortingStyle.LAST_UPDATED:
						result = this.sortDescending ? a.getDateUpdated() < b.getDateUpdated() : a.getDateUpdated() > b.getDateUpdated();
						break;
					case SortingStyle.ALPHABETICAL:
						result = this.sortDescending ? a.getName().localeCompare(b.getName()) > 0 : a.getName().localeCompare(b.getName()) < 0;
						break;
					case SortingStyle.DOWNLOADS:
						result = this.sortDescending ? a.getDownloadCount() < b.getDownloadCount() : a.getDownloadCount() > b.getDownloadCount();
						break;
					case SortingStyle.RATING:
						result = this.sortDescending ? a.getRating() < b.getRating() : a.getRating() > b.getRating();
						break;
					case SortingStyle.DEFAULT:
						result = true;
						break;
					default:
						result = true;
						break;
				}
				return result ? 1 : -1;
			});
			this.sortedThunderstoreModList = sortedList;
			this.filterThunderstoreModList();
		}


		get localModList() : ManifestV2[] {
            GameRunnerProvider.instance.getGameArguments(this.activeGame, this.contextProfile!).then(target => {
                if (target instanceof R2Error) {
                    this.doorstopTarget = "";
                } else {
                    this.doorstopTarget = target;
                }
            });
			return this.$store.state.localModList || [];
		}

		updatePageNumber(page: number) {
			this.pageNumber = page;
			window.scrollTo({
				top: 0,
				left: 0,
				behavior: 'auto'
			});
		}

		closeModal() {
			const modal: Element | null = document.getElementById('downloadModal');
			if (modal !== null) {
				modal.className = 'modal';
			}
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

		async installModAfterDownload(mod: ThunderstoreMod, version: ThunderstoreVersion): Promise<R2Error | void> {
			const manifestMod: ManifestV2 = new ManifestV2().fromThunderstoreMod(mod, version);
			if (manifestMod.getName().toLowerCase() !== 'bbepis-bepinexpack') {
                await ProfileInstallerProvider.instance.uninstallMod(manifestMod, this.contextProfile!);
			}
			const installError: R2Error | null = await ProfileInstallerProvider.instance.installMod(manifestMod, this.contextProfile!);
			if (!(installError instanceof R2Error)) {
				const newModList: ManifestV2[] | R2Error = await ProfileModList.addMod(manifestMod, this.contextProfile!);
				if (!(newModList instanceof R2Error)) {
					await this.$store.dispatch("updateModList", newModList);
					// this.localModList = newModList;
					this.sortThunderstoreModList();
				}
			} else {
				// (mod failed to be placed in /{profile} directory)
				this.showError(installError);
			}
		}

		downloadHandler(tsMod: ThunderstoreMod, tsVersion: ThunderstoreVersion) {
			this.downloadObject = {
				progress: 0,
				modName: tsMod.getName()
			};
			this.downloadingMod = true;
			this.closeModal();
			ThunderstoreDownloaderProvider.instance.download(this.activeGame, tsMod, tsVersion, this.thunderstoreModList, (progress: number, modName: string, status: number, err: R2Error | null) => {
				if (status === StatusEnum.FAILURE) {
					if (err !== null) {
						this.downloadingMod = false;
						this.showError(err);
					}
				} else if (status === StatusEnum.PENDING) {
					this.downloadObject = Object.assign({}, {
						progress: progress,
						modName: modName
					});
				}
			}, (downloadedMods: ThunderstoreCombo[]) => {
                ProfileModList.requestLock(async () => {
                    for (const combo of downloadedMods) {
                        await this.installModAfterDownload(combo.getMod(), combo.getVersion());
                    }
                    this.downloadingMod = false;
                });
			});
		}

		getSortOptions() {
			const options = [];
			const sorting: { [key: string]: string } = SortingStyle;
			for (const key in sorting) {
				options.push(sorting[key]);
			}
			return options;
		}

		getSortDirections() {
			const options = [];
			const sorting: { [key: string]: string } = SortingDirection;
			for (const key in sorting) {
				options.push(sorting[key]);
			}
			return options;
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
				default:
					return '';
			}
		}

		changeGameInstallDirectory() {
            const fs = FsProvider.instance;
			const ror2Directory: string = this.settings.getContext().gameSpecific.gameDirectory || this.computeDefaultInstallDirectory();
			InteractionProvider.instance.selectFolder({
                title: `Locate ${this.activeGame.displayName} Directory`,
                defaultPath: ror2Directory,
                buttonLabel: 'Select Directory'
            }).then(async files => {
                if (files.length === 1) {
                    const containsGameExecutable = (await fs.readdir(files[0]))
                        .find(value => this.activeGame.exeName.find(exeName => value.toLowerCase() === exeName.toLowerCase()) !== undefined);
                    if (containsGameExecutable) {
                        await this.settings.setGameDirectory(files[0]);
                    } else {
                        this.showRor2IncorrectDirectoryModal = true;
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
				default:
					return '';
			}
		}

		async checkIfSteamDirectoryIsValid(dir : string) : Promise<boolean> {
			switch(process.platform){
				case 'win32':
					return (await FsProvider.instance.readdir(dir))
							.find(value => value.toLowerCase() === 'steam.exe') !== undefined;
				case 'linux':
					return (await FsProvider.instance.readdir(dir))
							.find(value => value.toLowerCase() === 'steam.sh') !== undefined;
				default:
					return true;
			}
		}

		changeSteamDirectory() {
            const fs = FsProvider.instance;
			const ror2Directory: string = this.settings.getContext().global.steamDirectory || this.computeDefaultSteamDirectory();
			InteractionProvider.instance.selectFolder({
                title: 'Locate Steam Directory',
                defaultPath: ror2Directory,
                buttonLabel: 'Select Directory'
            }).then(async files => {
				if (files.length === 1) {
					if (await this.checkIfSteamDirectoryIsValid(files[0])) {
						this.settings.setSteamDirectory(files[0]);
					} else {
						this.showSteamIncorrectDirectoryModal = true;
					}
				}
            });
		}

		setFunkyMode(value: boolean) {
			this.settings.setFunkyMode(value);
		}

		async exportProfile() {
			const exportErr = await ProfileModList.exportModList(this.contextProfile!);
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

		changeProfile() {
			this.$router.push({ path: '/profiles' });
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
			this.view = 'installed';
			this.$forceUpdate();
		}

		async toggleDarkTheme() {
			const result: R2Error | void = await this.settings.toggleDarkTheme();
			if (result instanceof R2Error) {
				this.showError(result);
			}
			ThemeManager.apply();
		}

		openRoute(route: string) {
			this.$router.push(route);
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

		getPaginationSize() {
			return Math.ceil(this.searchableThunderstoreModList.length / this.getPageResultSize());
		}

		getPageResultSize() {
			return 140;
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
			const logOutputPath = path.join(this.contextProfile!.getPathOfProfile(), "BepInEx", "LogOutput.log");
			if (await this.logFileExists()) {
				const text = (await fs.readFile(logOutputPath)).toString();
				if (text.length >= 1992) {
				    InteractionProvider.instance.copyToClipboard(text);
				} else {
                    InteractionProvider.instance.copyToClipboard("```\n" + text + "\n```");
				}
			}
		}

		async logFileExists() {
            const fs = FsProvider.instance;
			const logOutputPath = path.join(this.contextProfile!.getPathOfProfile(), "BepInEx", "LogOutput.log");
			return fs.exists(logOutputPath);
		}

		installLocalMod() {
            InteractionProvider.instance.selectFile({
                title: 'Import mod',
                filters: ['.zip', '.dll'],
                buttonLabel: 'Import'
            }).then(async files => {
                if (files.length > 0) {
                    await this.installLocalModAfterFileSelection(files[0]);
                }
            })
        }

        async installLocalModAfterFileSelection(file: string) {
		    const convertError = await LocalModInstallerProvider.instance.extractToCache(this.contextProfile!, file, (async (success, error) => {
		        if (!success && error !== null) {
		            this.showError(error);
		            return;
                }
                const updatedModListResult = await ProfileModList.getModList(this.contextProfile!);
                if (updatedModListResult instanceof R2Error) {
                    this.showError(updatedModListResult);
                    return;
                }
				await this.$store.dispatch("updateModList", updatedModListResult);
                this.sortThunderstoreModList();
            }));
		    if (convertError instanceof R2Error) {
		        this.showError(convertError);
		        return;
            }
		    this.view = 'installed';
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
                const update: ManifestV2[] | R2Error = await ProfileModList.updateMod(mod, this.contextProfile!, (updatingMod: ManifestV2) => {
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
            this.view = 'installed';
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

        get availableCategories(): string[] {
		    this.filterCategories.includes("");
		    const flatArray: Array<string> = Array.from(
		        new Set(this.thunderstoreModList
                    .map((value) => value.getCategories())
                    .flat(1))
            );
		    return flatArray
                .filter((category) => !this.filterCategories.includes(category))
                .sort();
        }

        addFilterCategory(target: HTMLSelectElement) {
		    this.filterCategories.push(target.value);
            target.selectedIndex = 0;
        }

        removeCategory(key: string) {
		    this.filterCategories = this.filterCategories.filter(value => value !== key);
        }

        get categoryFilterValues() {
		    return Object.values(CategoryFilterMode);
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
                    this.changeProfile();
                    break;
                case "ImportLocalMod":
                    this.installLocalMod();
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
                    this.showUpdateAllModal = true;
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
				// this.localModList = newModList;
			} else {
                LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, `Failed to retrieve local mod list\n-> ${newModList.message}`);
                this.$emit('error', newModList);
			}
			this.sortThunderstoreModList();

			InteractionProvider.instance.hookModInstallProtocol(data => {
                const combo: ThunderstoreCombo | R2Error = ThunderstoreCombo.fromProtocol(data, this.thunderstoreModList);
                if (combo instanceof R2Error) {
                    this.showError(combo);
                    LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, `${combo.name}\n-> ${combo.message}`);
                    return;
                }
                this.downloadHandler(combo.getMod(), combo.getVersion());
            });

			this.isManagerUpdateAvailable();

			// Bind drag and drop listeners
            const defaultDragText = 'Drag and drop file here to install mod';

            document.ondragover = (ev) => {
                this.dragAndDropText = defaultDragText;
                this.showDragAndDropModal = true;
                ev.preventDefault();
            }

            document.ondragleave = (ev) => {
                if (ev.relatedTarget === null) {
                    this.showDragAndDropModal = false;
                }
                ev.preventDefault();
            }

            document.body.ondrop = (ev) => {
                if (FileDragDrop.areMultipleFilesDragged(ev)) {
                    this.dragAndDropText = 'Only a single mod can be installed at a time';
                    return;
                } else if (!FileDragDrop.areAllFileExtensionsIn(ev, [".zip"])) {
                    this.dragAndDropText = 'Mod must be a .zip file';
                    return;
                } else {
                    this.installLocalModAfterFileSelection(FileDragDrop.getFiles(ev)[0].path);
                }
                this.showDragAndDropModal = false;
                ev.preventDefault()
            }

            document.onclick = () => {
                this.showDragAndDropModal = false;
            }
		}

		mounted() {
		    this.view = (this.$route.query.view as string) || "installed";
        }
	}

</script>
