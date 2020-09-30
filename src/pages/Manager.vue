<template>
    <div class='manager' :class='{"show-all-icons": settings.allIconDisplayMode}'>
        <div class='file-drop'>
            <div :class="['modal', {'is-active':showDragAndDropModal}]">
                <div class="modal-background" @click="closeGameRunningModal()"></div>
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
        <div id='gameRunningModal' :class="['modal', {'is-active':(gameRunning !== false)}]">
            <div class="modal-background" @click="closeGameRunningModal()"></div>
            <div class='modal-content'>
                <div class='notification is-info'>
                    <h3 class='title'>Risk of Rain 2 is launching via Steam</h3>
                    <h5 class="title is-5">Close this message to continue modding.</h5>
                    <p>If this is taking a while, it's likely due to Steam starting.</p>
                    <p>Please be patient, and have fun!</p>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeGameRunningModal()"></button>
        </div>
        <div id='steamIncorrectDir' :class="['modal', {'is-active':(showSteamIncorrectDirectoryModal !== false)}]">
            <div class="modal-background" @click="showSteamIncorrectDirectoryModal = false"></div>
            <div class='modal-content'>
                <div class='notification is-danger'>
                    <h3 class='title'>Failed to set the Steam directory</h3>
                    <p>The directory must contain "Steam.exe".</p>
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
                    <h3 class='title'>Failed to set the Risk of Rain 2 directory</h3>
                    <p>The directory must contain "Risk of Rain 2.exe".</p>
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
                <p>Steam will be started, and will attempt to verify the integrity of Risk of Rain 2.</p>
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
                    <code>
                        --doorstop-enable true --doorstop-target r2modman\BepInEx\core\BepInEx.Preloader.dll
                    </code>
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

        <DownloadModModal
            :show-download-modal="showUpdateAllModal"
            :update-all-mods="true"
            :thunderstore-mod="null"
            @closed-modal="showUpdateAllModal = false;"
            @error="showError($event)"
        />

        <div id='errorModal' :class="['modal', {'is-active':(errorMessage !== '')}]">
            <div class="modal-background" @click="closeErrorModal()"></div>
            <div class='modal-content'>
                <div class='notification is-danger'>
                    <h3 class='title'>Error</h3>
                    <h5 class="title is-5">{{errorMessage}}</h5>
                    <p>{{errorStack}}</p>
                    <div v-if="errorSolution !== ''">
                        <br/>
                        <h5 class="title is-5">Suggestion</h5>
                        <p>{{errorSolution}}</p>
                    </div>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeErrorModal()"></button>
        </div>
        <div class='columns' id='content'>
            <div class="column is-one-quarter non-selectable">
                <aside class="menu">
                    <p class="menu-label">Risk of Rain 2</p>
                    <ul class="menu-list">
                        <li><a href="#" @click="launchModded()"><i class="fas fa-play-circle"/>&nbsp;&nbsp;Start modded</a></li>
                        <li>
                            <a href="#" @click="launchVanilla()"><i class="far fa-play-circle"/>&nbsp;&nbsp;Start vanilla</a>
                        </li>
                    </ul>
                    <p class="menu-label">Mods</p>
                    <ul class="menu-list">
                        <li>
                            <a href="#" @click="() => {view = 'installed';}"
                               :class="[view === 'installed' ? 'is-active' : '']">
                                <i class="fas fa-folder"/>&nbsp;&nbsp;Installed ({{localModList.length}})
                            </a>
                        </li>
                        <li>
                            <a href="#" @click="() => {view = 'online'; thunderstoreSearchFilter = ''}"
                               :class="[view === 'online' ? 'is-active' : '']">
                                <i class="fas fa-globe"/>&nbsp;&nbsp;Online ({{thunderstoreModList.length}})
                            </a>
                        </li>
                    </ul>
                    <p class='menu-label'>Other</p>
                    <ul class='menu-list'>
                        <li>
                            <a href="#" @click="openConfigEditor()" :class="[view === 'config_editor' ? 'is-active' : '']"
                               v-if="!settings.legacyInstallMode">
                                <i class="fas fa-edit"/>&nbsp;&nbsp;Config editor
                            </a>
                        </li>
                        <li>
                            <a href="#" @click="view = 'settings'" :class="[view === 'settings' ? 'is-active' : '']">
                                <i class="fas fa-cog"/>&nbsp;&nbsp;Settings
                            </a>
                        </li>
                        <li>
                            <a href="#" @click="() => {view = 'help'; helpPage = ''}"
                               :class="[view === 'help' ? 'is-active' : '']">
                                <i class="fas fa-question-circle"/>&nbsp;&nbsp;Help</a>
                            <ul v-if="view === 'help'">
                                <li>
                                    <a href='#' :class="[{'is-active': helpPage === 'tips&tricks'}]"
                                       @click="helpPage = 'tips&tricks'">
                                        <i class="fas fa-lightbulb"/>&nbsp;&nbsp;Tips and tricks
                                    </a>
                                </li>
                                <li>
                                    <a href='#' :class="[{'is-active': helpPage === 'gameWontStart'}]"
                                       @click="helpPage = 'gameWontStart'">
                                        <i class="fas fa-gamepad"/>&nbsp;&nbsp;Game won't start
                                    </a>
                                </li>
                                <li>
                                    <a href='#' :class="[{'is-active': helpPage === 'modsNotWorking'}]"
                                       @click="helpPage = 'modsNotWorking'">
                                        <i class="fas fa-ban"/>&nbsp;&nbsp;Mods aren't working
                                    </a>
                                </li>
                                <li>
                                    <a href='#' :class="[{'is-active': helpPage === 'likeR2'}]"
                                       @click="helpPage = 'likeR2'">
                                        <i class="fas fa-heart"/>&nbsp;&nbsp;Like r2modman?
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </aside>
            </div>
            <div class='column is-three-quarters'>
                <div v-show="view === 'online'">
                    <div class='sticky-top sticky-top--search border-at-bottom non-selectable'>
                        <div class='card is-shadowless is-square card--is-compressed'>
                            <div class='card-header-title'>
                                <div class="input-group input-group--flex margin-right">
                                    <label for="thunderstore-search-filter">Search</label>
                                    <input id="thunderstore-search-filter" v-model='thunderstoreSearchFilter' class="input" type="text" placeholder="Search for a mod"/>
                                </div>
                                <div class="input-group">
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
                            </div>
                        </div>
                    </div>
                    <OnlineModList
                        :local-mod-list="localModList"
                        :paged-mod-list="pagedThunderstoreModList"
                        @uninstall-mod="uninstallMod($event)"
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
                    <div class='pagination--invisible smaller-font'>
                        <a v-for='index in getPaginationSize()' :key='"pagination-" + index' class='pagination-link'>
                            {{index}}
                        </a>
                    </div>
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
                <div v-show="view === 'installed'">
                    <template>
                        <div class='fixed-center text-center' v-if="localModList.length === 0">
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
                        <template v-if="localModList.length > 0">
                            <LocalModList
                                ref="localModList"
                                @error="showError($event)"
                                @sort-start="sorting=true"
                                @sort-end="sorting=false"
                            />
                        </template>
                    </template>
                </div>
                <div v-show="view === 'settings'">
                    <template>
                        <settings-view v-on:setting-invoked="handleSettingsCallbacks($event)"/>
                    </template>
                </div>
                <div v-show="view === 'help'">
                    <template>
                        <!-- tips&tricks -->
                        <!-- gameWontStart -->
                        <!-- modsNotWorking -->
                        <!-- likeR2 -->
                        <div v-if="helpPage === 'tips&tricks'">
                            <hero title='Tips and tricks' heroType='is-info'/>
                            <br/>
                            <h5 class='title is-5'>Install with Mod Manager</h5>
                            <p>Thunderstore has a way to install mods without having to search for them in the mod
                                manager.
                            </p>
                            <p>Just go to the Settings tab, and associate r2modman with Thunderstore!</p>
                            <br/>
                            <h5 class='title is-5'>Server? No problem!</h5>
                            <p>You can have multiple installs of r2modman, each one pointing to a different server, and
                                of course, one for your regular modded game.
                            </p>
                            <br/>
                            <h5 class='title is-5'>If only I could create a modpack</h5>
                            <p>If only you could. Oh wait, you can.</p>
                            <p>You can export your profile, and friends can later import the file and download the exact
                                same mods.
                            </p>
                            <p>It makes joining servers easy, as well as removing the annoying clicks you'll all have to
                                do.
                            </p>
                        </div>
                        <div v-else-if="helpPage === 'gameWontStart'">
                            <hero :title="'Game won\'t start'" heroType='is-info'/>
                            <br/>
                            <h5 class='title is-5'>If the BepInEx console appears</h5>
                            <p>It's very likely due to a broken mod.</p>
                            <p>Remove (or disable) all mods except for BepInEx and R2API. See if the problem still
                                occurs.
                            </p>
                            <br/>
                            <h5 class='title is-5'>If it doesn't appear</h5>
                            <p>Locate your Risk of Rain 2 install directory via the Settings page.</p>
                            <p>If you're unsure where to find it, navigate to Steam, right click your game, and go to
                                "Manage > Browse local files"
                            </p>
                            <br/>
                            <h5 class='title is-5'>Symlink errors?</h5>
                            <p>
                                Follow
                                <link-component
                                        :url="'https://github.com/ebkr/r2modmanPlus/wiki/Error:-Failed-to-produce-a-symlink-between-profile-and-RoR2'"
                                        :target="'external'" class='selectable'>
                                    this guide
                                </link-component>
                                for more information.
                            </p>
                        </div>
                        <div v-else-if="helpPage === 'modsNotWorking'">
                            <hero :title="'Mods aren\'t working'" heroType='is-info'/>
                            <br/>
                            <h5 class='title is-5'>Are all dependencies installed?</h5>
                            <p>Did you uninstall a mod's dependency?</p>
                            <p>Almost every mod has something it depends upon.</p>
                            <p>Look for the missing dependency icon (<i class='fas fa-exclamation-circle'></i>) on the
                                "Installed" tab.
                            </p>
                            <p>If there is a missing dependency, you'll be able to resolve it by either reinstalling the
                                mod, or by clicking the "Download dependency" button.
                            </p>
                            <br/>
                            <h5 class='title is-5'>Are all of your mods up-to-date?</h5>
                            <p>Your mods may have a fix to get it working with the latest version of Risk of Rain 2.</p>
                            <p>You can update mods by going to the "Installed" tab, clicking on mods with the update
                                icon, and clicking the update button.
                            </p>
                            <p>Mods with updates have the (<i class='fas fa-cloud-upload-alt'></i>) icon.</p>
                        </div>
                        <div v-else-if="helpPage === 'likeR2'">
                            <hero :title="'Enjoying the manager?'" :subtitle="'I hope so!'" heroType='is-danger'/>
                            <br/>
                            <h5 class='title is-5'>You can help support r2modman in multiple ways!</h5>
                            <div class="content">
                                <ul>
                                    <li>Leave a thumbs-up on
                                        <link-component url='https://thunderstore.io/package/ebkr/r2modman/'
                                                        :target="'external'" class='selectable'>
                                            r2modman's Thunderstore page
                                        </link-component>
                                        .
                                    </li>
                                    <li>Star the project on
                                        <link-component url='https://github.com/ebkr/r2modmanPlus/'
                                                        :target="'external'" class='selectable'>
                                            GitHub
                                        </link-component>
                                        .
                                    </li>
                                    <li>Don't forget to show your friends!</li>
                                </ul>
                            </div>
                            <p>But most importantly, recommend new feature ideas! r2modman needs your help to be the
                                best possible mod manager for Risk of Rain 2!
                            </p>
                        </div>
                        <div v-else>
                            <hero :title="'Help with r2modman'" heroType='is-info'/>
                            <br/>
                            <h5 class='title is-5'>How do I install mods?</h5>
                            <p>Go to the "Online" tab, find a mod, and hit download. It'll also download the
                                dependencies, saving you time.
                            </p>
                            <p>Once you've done that, start the game modded.</p>
                            <br/>
                            <h5 class='title is-5'>Launching the game modded using Steam</h5>
                            <p>If you want to launch the game modded using Steam, you need to launch the game via
                                r2modman at least once (per profile switch).
                            </p>
                            <p>
                                Once you've done that,
                                <link-component
                                        url='https://github.com/risk-of-thunder/R2Wiki/wiki/Running-modded-and-unmodded-game-with-shortcuts'
                                        :target="'external'"
                                        class='selectable'
                                >follow this guide
                                </link-component>
                                ,
                                replacing "BepInEx\core\BepInEx.Preloader.dll" with
                                "r2modman\BepInEx\core\BepInEx.Preloader.dll"
                            </p>
                            <br/>
                            <h5 class='title is-5'>Something isn't working</h5>
                            <p>If you get any issues, look at the other pages that have appeared.</p>
                            <p>Failing that, mention me on the
                                <link-component url='https://discord.gg/5MbXZvd' :target="'external'" class='selectable'>Thunderstore
                                    Discord Server!
                                </link-component>
                                @ Ebkr#3660
                            </p>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import { Watch } from 'vue-property-decorator';
    import { ExpandableCard, Hero, ExternalLink, Modal, Progress } from '../components/all';

    import ThunderstoreMod from '../model/ThunderstoreMod';
    import ThunderstoreCombo from '../model/ThunderstoreCombo';
    import Mod from 'src/model/Mod';
    import BetterThunderstoreDownloader from 'src/r2mm/downloading/BetterThunderstoreDownloader';
    import ThunderstoreVersion from '../model/ThunderstoreVersion';
    import ProfileModList from 'src/r2mm/mods/ProfileModList';
    import ProfileInstaller from 'src/r2mm/installing/ProfileInstaller';
    import GameDirectoryResolver from 'src/r2mm/manager/GameDirectoryResolver';
    import PathResolver from 'src/r2mm/manager/PathResolver';
    import PreloaderFixer from 'src/r2mm/manager/PreloaderFixer';

    import { Logger, LogSeverity } from 'src/r2mm/logging/Logger';

    import Profile from '../model/Profile';
    import VersionNumber from '../model/VersionNumber';
    import StatusEnum from '../model/enums/StatusEnum';
    import SortingStyle from '../model/enums/SortingStyle';
    import SortingDirection from '../model/enums/SortingDirection';
    import DependencyListDisplayType from '../model/enums/DependencyListDisplayType';
    import R2Error from '../model/errors/R2Error';
    import ThunderstorePackages from '../r2mm/data/ThunderstorePackages';
    import ManifestV2 from '../model/ManifestV2';
    import ManagerSettings from '../r2mm/manager/ManagerSettings';
    import ThemeManager from '../r2mm/manager/ThemeManager';
    import GameRunner from '../r2mm/manager/GameRunner';
    import ModLinker from '../r2mm/manager/ModLinker';
    import ManagerInformation from '../_managerinf/ManagerInformation';

    import * as path from 'path';
    import * as fs from 'fs-extra';
    import { isNull, isUndefined } from 'util';
    import { clipboard, ipcRenderer, IpcRendererEvent } from 'electron';
    import { spawn } from 'child_process';
    import LocalModInstaller from '../r2mm/installing/LocalModInstaller';

    import FileDragDrop from '../r2mm/data/FileDragDrop';
    import SettingsView from '../components/settings-components/SettingsView.vue';
    import LocalModList from '../components/views/LocalModList.vue';
    import OnlineModList from '../components/views/OnlineModList.vue';
    import ModBridge from '../r2mm/mods/ModBridge';
    import DownloadModModal from '../components/views/DownloadModModal.vue';

    @Component({
        components: {
            OnlineModList,
            LocalModList,
            SettingsView,
            DownloadModModal,
            'hero': Hero,
            'progress-bar': Progress,
            'ExpandableCard': ExpandableCard,
            'link-component': ExternalLink,
            'modal': Modal,
            'settings-view': SettingsView,
        }
    })
    export default class Manager extends Vue {
        view: string = 'installed';
        sortedThunderstoreModList: ThunderstoreMod[] = [];
        searchableThunderstoreModList: ThunderstoreMod[] = [];
        pagedThunderstoreModList: ThunderstoreMod[] = [];
        thunderstoreSearchFilter: string = '';
        errorMessage: string = '';
        errorStack: string = '';
        errorSolution: string = '';
        gameRunning: boolean = false;
        settings = ManagerSettings.getSingleton();
        // Increment by one each time new modal is shown
        downloadObject: any | null = null;
        downloadingMod: boolean = false;
        helpPage: string = '';
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
        sorting: boolean = false;

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

        get thunderstoreModList() {
            return this.$store.state.thunderstoreModList;
        }

        @Watch("thunderstoreModList")
        thunderstoreModListUpdate() {
            this.sortThunderstoreModList();
        }

        filterThunderstoreModList() {
            this.searchableThunderstoreModList = this.sortedThunderstoreModList.filter((x: Mod) => {
                return x.getFullName().toLowerCase().search(this.thunderstoreSearchFilter.toLowerCase()) >= 0 || this.thunderstoreSearchFilter.trim() === '';
            });
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
            return this.$store.state.localModList;
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

        closeErrorModal() {
            this.errorMessage = '';
            this.errorStack = '';
        }

        closeGameRunningModal() {
            this.gameRunning = false;
        }

        showError(error: R2Error) {
            this.errorMessage = error.name;
            this.errorStack = error.message;
            this.errorSolution = error.solution;
        }

        closePreloaderFixModal() {
            this.fixingPreloader = false;
        }

        fixPreloader() {
            const res = PreloaderFixer.fix();
            if (res instanceof R2Error) {
                this.showError(res);
            } else {
                this.fixingPreloader = true;
            }
        }

        installModAfterDownload(mod: ThunderstoreMod, version: ThunderstoreVersion): R2Error | void {
            const manifestMod: ManifestV2 = new ManifestV2().fromThunderstoreMod(mod, version);
            if (manifestMod.getName().toLowerCase() !== 'bbepis-bepinexpack') {
                ProfileInstaller.uninstallMod(manifestMod);
            }
            const installError: R2Error | null = ProfileInstaller.installMod(manifestMod);
            if (!(installError instanceof R2Error)) {
                const newModList: ManifestV2[] | R2Error = ProfileModList.addMod(manifestMod);
                if (!(newModList instanceof R2Error)) {
                    this.$store.dispatch("updateModList", newModList);
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
            BetterThunderstoreDownloader.download(tsMod, tsVersion, this.thunderstoreModList, (progress: number, modName: string, status: number, err: R2Error | null) => {
                if (status === StatusEnum.FAILURE) {
                    if (!isNull(err)) {
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
                downloadedMods.forEach(combo => {
                    this.installModAfterDownload(combo.getMod(), combo.getVersion());
                });
                this.downloadingMod = false;
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

        prepareLaunch() {
            let dir: string | R2Error;
            if (this.settings.riskOfRain2Directory === null) {
                dir = GameDirectoryResolver.getDirectory();
            } else {
                dir = this.settings.riskOfRain2Directory;
            }
            if (dir instanceof R2Error) {
                // Show folder selection dialog.
                this.showError(dir);
            } else {
                const setInstallDirError: R2Error | void = this.settings.setRiskOfRain2Directory(dir);
                if (setInstallDirError instanceof R2Error) {
                    this.showError(setInstallDirError);
                    return;
                }
            }
        }

        launchModded() {
            this.prepareLaunch();
            if (this.settings.riskOfRain2Directory !== null && fs.existsSync(this.settings.riskOfRain2Directory)) {
                const newLinkedFiles = ModLinker.link();
                if (newLinkedFiles instanceof R2Error) {
                    this.showError(newLinkedFiles);
                    return;
                } else {
                    const saveError = this.settings.setLinkedFiles(newLinkedFiles);
                    if (saveError instanceof R2Error) {
                        this.showError(saveError);
                        return;
                    }
                }
                this.gameRunning = true;
                GameRunner.playModded(this.settings.riskOfRain2Directory, (err: R2Error | null) => {
                    if (!isNull(err)) {
                        this.showError(err);
                    }
                    this.gameRunning = false;
                });
            } else {
                return new R2Error('Failed to start Risk of Rain 2', 'The Risk of Rain 2 directory does not exist',
                    'Set the Risk of Rain 2 directory in the settings-components screen');
            }
        }

        launchVanilla() {
            this.prepareLaunch();
            if (this.settings.riskOfRain2Directory !== null && fs.existsSync(this.settings.riskOfRain2Directory)) {
                this.gameRunning = true;
                GameRunner.playVanilla(this.settings.riskOfRain2Directory, (err: R2Error | null) => {
                    if (!isNull(err)) {
                        this.showError(err);
                    }
                    this.gameRunning = false;
                });
            } else {
                return new R2Error('Failed to start Risk of Rain 2', 'The Risk of Rain 2 directory does not exist',
                    'Set the Risk of Rain 2 directory in the settings-components screen');
            }
        }

        changeRoR2InstallDirectory() {
            const ror2Directory: string = this.settings.riskOfRain2Directory || 'C:/Program Files (x86)/Steam/steamapps/common/Risk of Rain 2';
            ipcRenderer.once('receive-selection', (_sender: any, files: string[] | null) => {
                if (files !== null && files.length === 1) {
                    const containsSteamExecutable = fs.readdirSync(files[0])
                        .find(value => value.toLowerCase() === 'risk of rain 2.exe') !== undefined;
                    if (containsSteamExecutable) {
                        this.settings.setRiskOfRain2Directory(files[0]);
                    } else {
                        this.showRor2IncorrectDirectoryModal = true;
                    }
                }
            });
            ipcRenderer.send('open-dialog', {
                title: 'Locate Risk of Rain 2 Directory',
                defaultPath: ror2Directory,
                properties: ['openDirectory'],
                buttonLabel: 'Select Directory'
            });
        }

        changeSteamDirectory() {
            const ror2Directory: string = this.settings.steamDirectory || 'C:/Program Files (x86)/Steam';
            ipcRenderer.once('receive-selection', (_sender: any, files: string[] | null) => {
                if (files !== null && files.length === 1) {
                    const containsSteamExecutable = fs.readdirSync(files[0])
                        .find(value => value.toLowerCase() === 'steam.exe') !== undefined;
                    if (containsSteamExecutable) {
                        this.settings.setSteamDirectory(files[0]);
                    } else {
                        this.showSteamIncorrectDirectoryModal = true;
                    }
                }
            });
            ipcRenderer.send('open-dialog', {
                title: 'Locate Steam Directory',
                defaultPath: ror2Directory,
                properties: ['openDirectory'],
                buttonLabel: 'Select Directory'
            });
        }

        setFunkyMode(value: boolean) {
            this.settings.setFunkyMode(value);
        }

        exportProfile() {
            const exportErr = ProfileModList.exportModList();
            if (exportErr instanceof R2Error) {
                this.showError(exportErr);
            }
        }

        exportProfileAsCode() {
            const exportErr = ProfileModList.exportModListAsCode((code: string, err: R2Error | null) => {
                if (!isNull(err)) {
                    this.showError(err);
                } else {
                    this.exportCode = code;
                    clipboard.writeText(code, 'clipboard');
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
            spawn('powershell.exe', ['explorer', `${PathResolver.ROOT}`]);
        }

        browseProfileFolder() {
            spawn('powershell.exe', ['explorer', `${Profile.getActiveProfile().getPathOfProfile()}`]);
        }

        toggleIconDisplayMode(allIconDisplayMode: boolean) {
            if (allIconDisplayMode) {
                this.settings.setIconDisplayModeAll();
            } else {
                this.settings.setIconDisplayModeReduced();
            }
        }

        toggleLegacyInstallMode(expanded: boolean) {
            const result: R2Error | void = this.settings.setLegacyInstallMode(expanded);
            if (result instanceof R2Error) {
                this.showError(result);
            }
        }

        toggleDarkTheme() {
            const result: R2Error | void = this.settings.toggleDarkTheme();
            if (result instanceof R2Error) {
                this.showError(result);
            }
            ThemeManager.apply();
        }

        openConfigEditor() {
            this.$router.push('/config-editor');
        }

        isManagerUpdateAvailable() {
            if (!ManagerInformation.IS_PORTABLE) {
                return;
            }
            fetch('https://api.github.com/repos/ebkr/r2modmanPlus/releases')
                .then(response => response.json())
                .then((parsed: any) => {
                    parsed.sort((a: any, b: any) => {
                        if (!isNull(b)) {
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
            return 80;
        }

        showLaunchParameters() {
            this.launchParametersModel = this.settings.launchParameters;
            this.showLaunchParameterModal = true;
        }

        updateLaunchParameters() {
            this.settings.setLaunchParameters(this.launchParametersModel);
            this.showLaunchParameterModal = false;
        }

        toggleIgnoreCache() {
            this.settings.setIgnoreCache(!this.settings.ignoreCache);
        }

        copyLogToClipboard() {
            const logOutputPath = path.join(Profile.getActiveProfile().getPathOfProfile(), "BepInEx", "LogOutput.log");
            if (this.logFileExists()) {
                const text = fs.readFileSync(logOutputPath).toString();
                if (text.length >= 1992) {
                    clipboard.writeText(text, 'clipboard');
                } else {
                    clipboard.writeText("```\n" + text + "\n```", 'clipboard');
                }
            }
        }

        logFileExists() {
            const logOutputPath = path.join(Profile.getActiveProfile().getPathOfProfile(), "BepInEx", "LogOutput.log");
            return fs.existsSync(logOutputPath);
        }
        
        uninstallMod(mod: ThunderstoreMod) {
            const localModList = this.$refs.localModList as LocalModList;
            if (!localModList.uninstallModRequireConfirmation(mod)) {
                this.view = 'installed';
                localModList.uninstallModRequireConfirmation(mod);
            }
        }

        installLocalMod() {
            ipcRenderer.once(
                'receive-selection',
                (_sender: any, files: string[] | null) => {
                    if (files !== null && files.length > 0) {
                        this.installLocalModAfterFileSelection(files[0]);
                    }
                }
            );
            ipcRenderer.send('open-dialog', {
                title: 'Import mod',
                properties: ['openFile'],
                filters: ['.zip'],
                buttonLabel: 'Import'
            });
        }

        installLocalModAfterFileSelection(file: string) {
            const convertError = LocalModInstaller.extractToCache(file, ((success, error) => {
                if (!success && error !== null) {
                    this.showError(error);
                    return;
                }
                const updatedModListResult = ProfileModList.getModList(Profile.getActiveProfile());
                if (updatedModListResult instanceof R2Error) {
                    this.showError(updatedModListResult);
                    return;
                }
                this.$store.dispatch("updateModList", updatedModListResult);
                this.sortThunderstoreModList();
            }));
            if (convertError instanceof R2Error) {
                this.showError(convertError);
                return;
            }
            this.view = 'installed';
        }

        setAllModsEnabled(enabled: boolean) {
            this.localModList.forEach((mod: ManifestV2) => {
                let profileErr: R2Error | void;
                if (enabled) {
                    profileErr = ProfileInstaller.enableMod(mod);
                } else {
                    profileErr = ProfileInstaller.disableMod(mod);
                }
                if (profileErr instanceof R2Error) {
                    this.showError(profileErr);
                    return;
                }
                const update: ManifestV2[] | R2Error = ProfileModList.updateMod(mod, (updatingMod: ManifestV2) => {
                    if (enabled) {
                        updatingMod.enable();
                    } else {
                        updatingMod.disable();
                    }
                });
                if (update instanceof R2Error) {
                    this.showError(update);
                    return;
                }
                this.$store.dispatch("updateModList", update);
            });
            this.view = 'installed';
        }

        changeDataFolder() {
            const dir: string = PathResolver.ROOT;
            ipcRenderer.once('receive-selection', (_sender: any, files: string[] | null) => {
                if (files !== null && files.length === 1) {
                    const filesInDirectory = fs.readdirSync(files[0]);
                    if (filesInDirectory.length > 0 && files[0] !== PathResolver.APPDATA_DIR) {
                        this.showError(new R2Error("Selected directory is not empty", `Directory is not empty: ${files[0]}. Contains ${filesInDirectory.length} files.`, "Select an empty directory or create a new one."));
                        return;
                    } else {
                        ManagerSettings.getSingleton().setDataDirectory(files[0]);
                        ipcRenderer.send('restart');
                    }
                }
            });
            ipcRenderer.send('open-dialog', {
                title: 'Select a new folder to store r2modman data',
                defaultPath: dir,
                properties: ['openDirectory'],
                buttonLabel: 'Select Data Folder'
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
                    this.changeRoR2InstallDirectory();
                    break;
                case "ChangeSteamDirectory":
                    this.changeSteamDirectory();
                    break;
                case "CopyLogToClipboard":
                    this.copyLogToClipboard();
                    break;
                case "SwitchModInstallMode":
                    this.toggleLegacyInstallMode(!this.settings.legacyInstallMode);
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
                    this.setFunkyMode(!this.settings.funkyModeEnabled);
                    break;
                case "SwitchTheme":
                    this.toggleDarkTheme();
                    break;
                case "SwitchCard":
                    this.toggleIconDisplayMode(!this.settings.allIconDisplayMode);
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
            }
        }

        created() {
            this.launchParametersModel = this.settings.launchParameters;
            const newModList: ManifestV2[] | R2Error = ProfileModList.getModList(Profile.getActiveProfile());
            if (!(newModList instanceof R2Error)) {
                this.$store.dispatch("updateModList", newModList);
                // this.localModList = newModList;
            } else {
                Logger.Log(LogSeverity.ACTION_STOPPED, `Failed to retrieve local mod list\n-> ${newModList.message}`);
            }
            this.sortThunderstoreModList();
            ipcRenderer.on('install-from-thunderstore-string', (_sender: any, data: string) => {
                const combo: ThunderstoreCombo | R2Error = ThunderstoreCombo.fromProtocol(data, this.thunderstoreModList);
                if (combo instanceof R2Error) {
                    this.showError(combo);
                    Logger.Log(LogSeverity.ACTION_STOPPED, `${combo.name}\n-> ${combo.message}`);
                    return;
                }
                this.downloadHandler(combo.getMod(), combo.getVersion());

            });
            this.isManagerUpdateAvailable();

            // Bind drag and drop listeners
            const defaultDragText = 'Drag and drop file here to install mod';

            document.ondragover = (ev) => {
                if (this.sorting) {
                    return;
                }
                
                this.dragAndDropText = defaultDragText;
                this.showDragAndDropModal = true;
                ev.preventDefault();
            }

            document.ondragleave = (ev) => {
                if (this.sorting) {
                    return;
                }
                
                if (ev.relatedTarget === null) {
                    this.showDragAndDropModal = false;
                }
                ev.preventDefault();
            }

            document.body.ondrop = (ev) => {
                if (this.sorting) {
                    return;
                }
                
                if (FileDragDrop.areMultipleFilesDragged(ev)) {
                    this.dragAndDropText = 'Only a single mod can be installed at a time';
                    return;
                } else if (!FileDragDrop.areAllFileExtensionsIn(ev, [".zip"])) {
                    this.dragAndDropText = 'Mod must be a .zip file';
                    return;
                } else {
                    this.errorMessage = '';
                    this.installLocalModAfterFileSelection(FileDragDrop.getFiles(ev)[0].path);
                }
                this.showDragAndDropModal = false;
                ev.preventDefault()
            }

            document.onclick = () => {
                this.showDragAndDropModal = false;
            }
        }
    }

</script>
