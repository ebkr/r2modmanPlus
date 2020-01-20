<template>
    <div>
        <div id='downloadProgressModal' :class="['modal', {'is-active':downloadingMod}]" v-if="downloadProgress.length > 0">
            <div class="modal-background" @click="closeDownloadProgressModal()"></div>
            <div class='modal-content'>
                <div class='notification is-info'>
                    <h3 class='title'>Downloading</h3>
                    <p>{{currentDownloadProgress}}% complete</p>
                    <progress-bar 
                        :max='100'
                        :value='currentDownloadProgress'
                        :className="['is-dark']" />
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeDownloadProgressModal()"></button>
        </div>
        <div id="downloadModal" class="modal">
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-content">
                <div class='card'>
                    <header class="card-header">
                        <p class='card-header-title' v-if="selectedThunderstoreMod !== null">Select a version of {{selectedThunderstoreMod.getName()}} to download</p>
                    </header>
                    <div class='card-content'>
                        <p>It's recommended to select the latest version of all mods.</p>
                        <p>Using outdated versions may cause problems.</p>
                        <br/>
                        <select class='select' v-model='selectedVersion'>
                            <option v-for='(value, index) in versionNumbers' :key='index' v-bind:value='value'>
                                {{value}}
                            </option>
                        </select>
                        <br/><br/>
                        <span class="tag is-dark" v-if='selectedVersion === null'>You need to select a version</span>
                        <span class="tag is-success" v-else-if='versionNumbers[0] === selectedVersion'>{{selectedVersion}} is the latest version</span>
                        <span class="tag is-danger" v-else-if='versionNumbers[0] !== selectedVersion'>{{selectedVersion}} is an outdated version</span>
                    </div>
                    <div class='card-footer'>
                        <button class="button is-info" @click="downloadWithDependencies()">Download mod + dependencies</button>
                    </div>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeModal()"></button>
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
        <div id='errorModal' :class="['modal', {'is-active':(errorMessage !== '')}]">
            <div class="modal-background" @click="closeErrorModal()"></div>
            <div class='modal-content'>
                <div class='notification is-danger'>
                    <h3 class='title'>Error</h3>
                    <h5 class="title is-5">{{errorMessage}}</h5>
                    <p>{{errorStack}}</p>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeErrorModal()"></button>
        </div>
        <div class='columns' id='content'>
            <div class="column is-one-quarter">
                <aside class="menu">
                    <p class="menu-label">Risk of Rain 2</p>
                    <ul class="menu-list">
                        <li><a @click="launchModded()">Start modded</a></li>
                        <li><a @click="launchVanilla()">Start vanilla</a></li>
                    </ul>
                    <p class="menu-label">Mods</p>
                    <ul class="menu-list">
                        <li>
                            <a @click="view = 'installed'; searchFilter = ''" :class="[view === 'installed' ? 'is-active' : '']">Installed</a>
                            <ul v-if="view === 'installed'">
                                <li><input v-model='searchFilter' class="input" type="text" placeholder="Search mods"/></li>
                            </ul>
                        </li>
                        <li>
                            <a @click="view = 'online'; searchFilter = ''" :class="[view === 'online' ? 'is-active' : '']">Online</a>
                            <ul v-if="view === 'online'">
                                <li><input v-model='searchFilter' class='input' type='text' placeholder='Search mods'/></li>
                            </ul>
                        </li>
                    </ul>
                    <p class='menu-label'>Other</p>
                    <ul class='menu-list'>
                        <!-- <li><a @click="view = 'config_editor'" :class="[view === 'config_editor' ? 'is-active' : '']">Config Editor</a></li> -->
                        <li><a @click="view = 'settings'" :class="[view === 'settings' ? 'is-active' : '']">Settings</a></li>
                        <li>
                            <a @click="view = 'help'; helpPage = ''" :class="[view === 'help' ? 'is-active' : '']">Help</a>
                            <ul v-if="view === 'help'">
                                <li><a href='#' :class="[{'is-active': helpPage === 'tips&tricks'}]" @click="helpPage = 'tips&tricks'">Tips and tricks</a></li>
                                <li><a href='#' :class="[{'is-active': helpPage === 'gameWontStart'}]" @click="helpPage = 'gameWontStart'">Game won't start</a></li>
                                <li><a href='#' :class="[{'is-active': helpPage === 'modsNotWorking'}]" @click="helpPage = 'modsNotWorking'">Mods aren't working</a></li>
                            </ul>
                        </li>
                    </ul>
                </aside>
            </div>
            <div class='column is-three-quarters'>
                <template v-if="view === 'online'">
                    <div v-for='(key, index) in searchableThunderstoreModList' :key="'online-' + index">
                        <expandable-card
                            :image="key.versions[0].icon"
                            :id="index"
                            :description="key.versions[0].description"
                            :funkyMode="settings.funkyModeEnabled"
                            :visible="false">
                                <template v-slot:title>
                                    <span class='has-tooltip-left' data-tooltip='Essential mod' v-if="key.pinned">
                                        <i class='fas fa-star'>&nbsp;</i>
                                    </span>
                                    <span v-html='getTitle(key)'></span>
                                </template>
                                <template v-slot:other-icons>
                                    <span class='card-header-icon has-tooltip-left' data-tooltip='Mod already installed' v-if="isThunderstoreModInstalled(key)">
                                        <i class='fas fa-check'></i>
                                    </span>
                                </template>
                                <a class='card-footer-item' @click='openModal(key)'>Download</a>
                                <div class='card-footer-item'>
                                    <link-component :url="key.packageUrl" :target="'external'">View on Thunderstore</link-component>
                                </div>
                                <div class='card-footer-item'>
                                    <span><i class='fas fa-download'/> {{key.totalDownloads}}</span>
                                </div>
                                <div class='card-footer-item'>
                                    <span><i class='fas fa-thumbs-up'/> {{key.rating}}</span>
                                </div>
                            </expandable-card>
                    </div>
                </template>
                <template v-if="view === 'installed'">
                    <div class='fixed-center text-center' v-if="localModList.length === 0">
                        <div>
                            <i class="fas fa-exclamation fa-5x"></i>
                        </div>
                        <br/>
                        <h3 class='title is-4'>Looks like you don't have any mods installed</h3>
                        <h4 class='subtitle is-5'>Click the Online tab on the left, or click <a @click="view = 'online'">here</a>.</h4>
                    </div>
                    <template v-if="localModList.length > 0">
                        <div v-for='(key, index) in searchableLocalModList' :key="'local-' + key.name">
                            <expandable-card
                                :image="key.icon"
                                :id="index"
                                :description="key.description"
                                :funkyMode="settings.funkyModeEnabled"
                                :visible="false">
                                    <template v-slot:title>
                                        <span v-if="key.enabled">
                                            {{key.displayName}}
                                        </span>
                                        <span v-else>
                                            <strike>{{key.displayName}}</strike>
                                        </span>
                                    </template>
                                    <template v-slot:other-icons>
                                        <!-- Show update and missing dependency icons -->
                                        <span class='card-header-icon has-tooltip-left' data-tooltip='An update is available' v-if="!isLatest(key)">
                                            <i class='fas fa-cloud-upload-alt'></i>
                                        </span>
                                        <span class='card-header-icon has-tooltip-left' :data-tooltip="`Missing ${getMissingDependencies(key).length} dependencies`" v-if="getMissingDependencies(key).length > 0">
                                            <i class='fas fa-exclamation-circle'></i>
                                        </span>
                                    </template>
                                    <a class='card-footer-item' @click="uninstallMod(key)">Uninstall</a>
                                    <template>
                                        <a class='card-footer-item' @click="disableMod(key)" v-if="key.enabled">Disable</a>
                                        <a class='card-footer-item' @click="enableMod(key)" v-else>Enable</a>
                                    </template>
                                    <a class='card-footer-item' v-if="!isLatest(key)" @click="updateMod(key)">Update</a>
                                    <a class='card-footer-item' v-if="getMissingDependencies(key).length > 0" @click="downloadDependency(getMissingDependencies(key)[0])">Download dependency</a>
                                </expandable-card>
                        </div>
                    </template>
                </template>
                <template v-if="view === 'settings'">
                    <a @click="changeProfile()">
                        <div class='container'>
                            <div class='border-at-bottom'>
                                <div class='card is-shadowless'>
                                    <p class='card-header-title'>Change profile</p>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a @click="setAllModsEnabled(false)">
                        <div class='container'>
                            <div class='border-at-bottom'>
                                <div class='card is-shadowless'>
                                    <p class='card-header-title'>Disable all mods</p>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a @click="setAllModsEnabled(true)">
                        <div class='container'>
                            <div class='border-at-bottom'>
                                <div class='card is-shadowless'>
                                    <p class='card-header-title'>Enable all mods</p>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a @click="changeRoR2InstallDirectory()">
                        <div class='container'>
                            <div class='border-at-bottom'>
                                <div class='card is-shadowless'>
                                    <p class='card-header-title'>Locate Risk of Rain 2 directory</p>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a @click="changeSteamDirectory()">
                        <div class='container'>
                            <div class='border-at-bottom'>
                                <div class='card is-shadowless'>
                                    <p class='card-header-title'>Locate Steam directory</p>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a @click="setFunkyMode(!settings.funkyModeEnabled)">
                        <div class='container'>
                            <div class='border-at-bottom'>
                                <div class='card is-shadowless'>
                                    <p class='card-header-title' v-if="settings.funkyModeEnabled">Disable funky mode</p>
                                    <p class='card-header-title' v-else>Enable funky mode</p>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a @click="exportProfile()">
                        <div class='container'>
                            <div class='border-at-bottom'>
                                <div class='card is-shadowless'>
                                    <p class='card-header-title'>Export profile</p>
                                </div>
                            </div>
                        </div>
                    </a>
                </template>
                <template v-if="view === 'help'">
                    <!-- tips&tricks -->
                    <!-- gameWontStart -->
                    <!-- modsNotWorking -->
                    <div v-if="helpPage === 'tips&tricks'">
                        <hero title='Tips and tricks' heroType='is-info' />
                        <br/>
                        <h5 class='title is-5'>Install with Mod Manager</h5>
                        <p>Thunderstore has a way to install mods without having to search for them in the mod manager.</p>
                        <p>Just go to the Settings tab, and associate r2modman with Thunderstore!</p>
                        <br/>
                        <h5 class='title is-5'>Server? No problem!</h5>
                        <p>You can have multiple installs of r2modman, each one pointing to a different server, and of course, one for your regular modded game.</p>
                        <br/>
                        <h5 class='title is-5'>If only I could create a modpack</h5>
                        <p>If only you could. Oh wait, you can.</p>
                        <p>You can export your profile, and friends can later import the file and download the exact same mods.</p>
                        <p>It makes joining servers easy, as well as removing the annoying clicks you'll all have to do.</p>
                    </div>
                    <div v-else-if="helpPage === 'gameWontStart'">
                        <hero :title="'Game won\'t start'" heroType='is-info' />
                        <br/>
                        <h5 class='title is-5'>If the BepInEx console appears</h5>
                        <p>It's very likely due to a broken mod.</p>
                        <p>Remove (or disable) all mods except for BepInEx and R2API. See if the problem still occurs.</p>
                        <br/>
                        <h5 class='title is-5'>If it doesn't appear</h5>
                        <p>Locate your Risk of Rain 2 install directory via the Settings page.</p>
                        <p>If you're unsure where to find it, navigate to Steam, right click your game, and go to "Manage > Browse local files"</p>
                    </div>
                    <div v-else-if="helpPage === 'modsNotWorking'">
                        <hero :title="'Mods aren\'t working'" heroType='is-info' />
                        <br/>
                        <h5 class='title is-5'>Are all dependencies installed?</h5>
                        <p>Did you uninstall a mod's dependency?</p>
                        <p>Almost every mod has something it depends upon.</p>
                        <p>Look for the missing dependency icon (<i class='fas fa-exclamation-circle'></i>) on the "Installed" tab.</p>
                        <p>If there is a missing dependency, you'll be able to resolve it by either reinstalling the mod, or by clicking the "Download dependency" button.</p>
                        <br/>
                        <h5 class='title is-5'>Are all of your mods up-to-date?</h5>
                        <p>Your mods may have a fix to get it working with the latest version of Risk of Rain 2.</p>
                        <p>You can update mods by going to the "Installed" tab, clicking on mods with the update icon, and clicking the update button.</p>
                        <p>Mods with updates have the (<i class='fas fa-cloud-upload-alt'></i>) icon.</p>
                    </div>
                    <div v-else>
                        <hero :title="'Help with r2modman'" heroType='is-info' />
                        <br/>
                        <h5 class='title is-5'>How do I install mods?</h5>
                        <p>Go to the "Online" tab, find a mod, and hit download. It'll also download the dependencies, saving you time.</p>
                        <p>Once you've done that, start the game modded.</p>
                        <br/>
                        <h5 class='title is-5'>Launching the game with Steam</h5>
                        <p>If you want to launch the game through Steam, you need to launch the game via r2modman at least once (per profile switch).</p>
                        <p>
                            Once you've done that, <link-component url='https://github.com/risk-of-thunder/R2Wiki/wiki/Running-modded-and-unmodded-game-with-shortcuts' :target="'external'">follow this guide</link-component>,
                            replacing "BepInEx\core\BepInEx.Preloader.dll" with "r2modman\BepInEx\core\BepInEx.Preloader.dll"
                        </p>
                        <br/>
                        <h5 class='title is-5'>Something isn't working</h5>
                        <p>If you get any issues, look at the other pages that have appeared.</p>
                        <p>Failing that, mention me on the <link-component url='https://discord.gg/5MbXZvd' :target="'external'">Thunderstore Discord Server!</link-component> @ Ebkr#3660</p>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { Hero, Progress, ExpandableCard, Link } from '../components/all';

import ThunderstoreMod from '../model/ThunderstoreMod';
import ThunderstoreCombo from '../model/ThunderstoreCombo';
import Mod from 'src/model/Mod';
import ThunderstoreDownloader from 'src/r2mm/downloading/ThunderstoreDownloader';
import ThunderstoreVersion from '../model/ThunderstoreVersion';
import ProfileModList from 'src/r2mm/mods/ProfileModList';
import ProfileInstaller from 'src/r2mm/installing/ProfileInstaller';
import GameDirectoryResolver from 'src/r2mm/manager/GameDirectoryResolver';

import Profile from '../model/Profile';
import StatusEnum from '../model/enums/StatusEnum';
import R2Error from '../model/errors/R2Error';
import ThunderstorePackages from '../r2mm/data/ThunderstorePackages';
import ManifestV2 from '../model/ManifestV2';
import ManagerSettings from '../r2mm/manager/ManagerSettings';
import GameRunner from '../r2mm/manager/GameRunner';
import ModLinker from '../r2mm/manager/ModLinker';
import ModBridge from '../r2mm/mods/ModBridge';

import * as fs from 'fs-extra';
import { isUndefined, isNull } from 'util';
import { ipcRenderer, app } from 'electron';

@Component({
    components: {
        'hero': Hero,
        'progress-bar': Progress,
        'expandable-card': ExpandableCard,
        'link-component': Link,
    }
})
export default class Manager extends Vue {
    view: string = 'installed';

    thunderstoreModList: ThunderstoreMod[] = [];
    searchableThunderstoreModList: ThunderstoreMod[] = [];
    
    localModList: ManifestV2[] = [];
    searchableLocalModList: ManifestV2[] = [];

    versionNumbers: string[] = [];
    selectedThunderstoreMod: ThunderstoreMod | null = null;

    selectedVersion: string | null = null;

    searchFilter: string = '';

    errorMessage: string = '';
    errorStack: string = '';

    gameRunning: boolean = false;

    settings = new ManagerSettings();

    // Increment by one each time new modal is shown
    downloadProgress: number[] = [];
    downloadingMod: boolean = false;
    currentDownloadProgress: number = 0;

    helpPage: string = '';


    @Watch('searchFilter')
    filterModLists() {
        this.generateModlist();
        this.searchableLocalModList = this.localModList.filter((x: ManifestV2) => {
            return x.getName().toLowerCase().search(this.searchFilter.toLowerCase()) >= 0 ||  this.searchFilter.trim() === ''
        });
        this.searchableThunderstoreModList = this.thunderstoreModList.filter((x: Mod) => {
            return x.getName().toLowerCase().search(this.searchFilter.toLowerCase()) >= 0 ||  this.searchFilter.trim() === ''
        });
    }

    // eslint-disable-next-line
    openModal(vueMod: any) {
        if (this.view === 'online') {
            const mod = new ThunderstoreMod().fromReactive(vueMod);
            this.selectedThunderstoreMod = mod;
            this.selectedVersion = mod.getVersions()[0].getVersionNumber().toString();
            this.versionNumbers = mod.getVersions()
                .map((version: ThunderstoreVersion) => version.getVersionNumber().toString());
            const modal: Element | null = document.getElementById('downloadModal');
            if (modal !== null) {
                modal.className = 'modal is-active';
            }
        }
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
    }

    private generateModlist() {
        this.searchableThunderstoreModList = this.thunderstoreModList;
        this.searchableLocalModList = this.localModList;
    }

    installModAfterDownload(mod: ThunderstoreMod, version: ThunderstoreVersion): R2Error | void {
        const manifestMod: ManifestV2 = new ManifestV2().fromThunderstoreMod(mod, version);
        const installError: R2Error | null = ProfileInstaller.installMod(manifestMod);
        if (!(installError instanceof R2Error)) {
            const newModList: ManifestV2[] | R2Error = ProfileModList.addMod(manifestMod);
            if (!(newModList instanceof R2Error)) {
                this.localModList = newModList;
                this.filterModLists();
            }
        } else {
            // (mod failed to be placed in /{profile} directory)
            this.showError(installError);
        }
    }

    downloadWithDependencies() {
        const refSelectedThunderstoreMod: ThunderstoreMod | null = this.selectedThunderstoreMod;
        const refSelectedVersion: string | null = this.selectedVersion;
        if (refSelectedThunderstoreMod === null || refSelectedVersion === null) {
            // Shouldn't happen, but shouldn't throw an error.
            return;
        }
        const version = refSelectedThunderstoreMod.getVersions()
            .find((modVersion: ThunderstoreVersion) => modVersion.getVersionNumber().toString() === refSelectedVersion);
        if (version === undefined) {
            return;
        }
        this.performDependencyDownload(refSelectedThunderstoreMod, version);
    }

    performDependencyDownload(thunderstoreMod: ThunderstoreMod, thunderstoreVersion: ThunderstoreVersion) {
        const downloader: ThunderstoreDownloader = new ThunderstoreDownloader(thunderstoreMod);
        const dependencies: ThunderstoreMod[] | R2Error = downloader.buildDependencyList(thunderstoreVersion, this.thunderstoreModList);
        if (dependencies instanceof R2Error) {
            this.showError(dependencies);
            return;
        }
        this.downloadProgress.push(0);
        const progressTrack = this.downloadProgress.length - 1;
        this.currentDownloadProgress = 0;
        this.downloadingMod = true;
        this.closeModal();
        downloader.downloadWithDependencies((progress: number, status: number, error: R2Error | void)=>{
            if (status === StatusEnum.FAILURE) {
                if (error instanceof R2Error) {
                    this.showError(error);
                    this.downloadingMod = false;
                }
            } else if (status === StatusEnum.SUCCESS) {
                dependencies.forEach((mod: ThunderstoreMod) => {
                    const installErr = this.installModAfterDownload(mod, mod.getVersions()[0]);
                    if (installErr instanceof R2Error) {
                        this.showError(installErr);
                        this.downloadingMod = false;
                        return;
                    }
                })
                this.installModAfterDownload(thunderstoreMod, thunderstoreVersion);
                this.downloadingMod = false;
            } else if (status === StatusEnum.PENDING) {
                this.downloadProgress[progressTrack] = progress;
                if (this.downloadProgress.length - 1 === progressTrack && !isNaN(progress)) {
                    this.currentDownloadProgress = progress;
                }
            }
        }, thunderstoreMod, thunderstoreVersion, this.thunderstoreModList);
    }

    closeDownloadProgressModal() {
        this.downloadingMod = false;
    }

    // eslint-disable-next-line
    uninstallMod(vueMod: any) {
        let mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
        const uninstallError: R2Error | null = ProfileInstaller.uninstallMod(mod);
        if (uninstallError instanceof R2Error) {
            // Uninstall failed
            this.showError(uninstallError);
            return;
        }
        const modList: ManifestV2[] | R2Error = ProfileModList.removeMod(mod);
        if (modList instanceof R2Error) {
            // Failed to remove mod from local list.
            this.showError(modList);
            return;
        }
        this.localModList = modList;
        this.filterModLists();
    }

    // eslint-disable-next-line
    disableMod(vueMod: any) {
        const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
        const disableErr: R2Error | void = ProfileInstaller.disableMod(mod);
        if (disableErr instanceof R2Error) {
            // Failed to disable
            this.showError(disableErr);
            return;
        }
        const updatedList = ProfileModList.updateMod(mod, (updatingMod: ManifestV2) => {
            updatingMod.disable();
        });
        if (updatedList instanceof R2Error) {
            // Failed to update mod list.
            this.showError(updatedList);
            return;
        }
        this.localModList = updatedList;
        this.filterModLists();
    }

    // eslint-disable-next-line
    enableMod(vueMod: any) {
        const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
        const disableErr: R2Error | void = ProfileInstaller.enableMod(mod);
        if (disableErr instanceof R2Error) {
            // Failed to disable
            this.showError(disableErr);
            return;
        }
        const updatedList = ProfileModList.updateMod(mod, (updatingMod: ManifestV2) => {
            updatingMod.enable();
        });
        if (updatedList instanceof R2Error) {
            // Failed to update mod list.
            this.showError(updatedList);
            return;
        }
        this.localModList = updatedList;
        this.filterModLists();
    }

    // eslint-disable-next-line
    getTitle(key: any) {
        if (key.deprecated) {
            return key.name.strike();
        }
        return key.name;
    }

    // eslint-disable-next-line
    isThunderstoreModInstalled(vueMod: any) {
        const mod: ThunderstoreMod = new ThunderstoreMod().fromReactive(vueMod);
        return this.localModList.find((local: ManifestV2) => local.getName() === mod.getFullName()) != undefined;
    }

    prepareLaunch() {
        let dir: string | R2Error = '';
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

    isLatest(vueMod: any): boolean {
        const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
        const latestVersion: ThunderstoreVersion | void = ModBridge.getLatestVersion(mod, this.thunderstoreModList);
        if (latestVersion instanceof ThunderstoreVersion) {
            return mod.getVersionNumber()
                .isNewerThan(latestVersion.getVersionNumber());
        }
        return false;
    }

    updateMod(vueMod: any) {
        const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
        const tsMod = ModBridge.getThunderstoreModFromMod(mod, this.thunderstoreModList);
        if (tsMod instanceof ThunderstoreMod) {
            this.selectedThunderstoreMod = tsMod;
            this.selectedVersion = tsMod.getVersions()[0].getVersionNumber().toString();
            this.versionNumbers = tsMod.getVersions()
                .map((version: ThunderstoreVersion) => version.getVersionNumber().toString());
            const modal: Element | null = document.getElementById('downloadModal');
            if (modal !== null) {
                modal.className = 'modal is-active';
            }
        }
    }

    getMissingDependencies(vueMod: any): string[] {
        const mod: Mod = new Mod().fromReactive(vueMod);
        return mod.getDependencies().filter((dependency: string) => {
            // Include in filter is mod isn't found.
            return isUndefined(this.localModList.find((localMod: ManifestV2) => dependency.toLowerCase().startsWith(localMod.getName().toLowerCase())))
        });
    }

    downloadDependency(missingDependency: string) {
        const mod: ThunderstoreMod | undefined = this.thunderstoreModList.find((tsMod: ThunderstoreMod) => missingDependency.toLowerCase().startsWith(tsMod.getFullName().toLowerCase()));
        if (isUndefined(mod)) {
            return;
        }
        this.selectedThunderstoreMod = mod;
        this.selectedVersion = mod.getVersions()[0].getVersionNumber().toString();
        this.versionNumbers = mod.getVersions()
            .map((version: ThunderstoreVersion) => version.getVersionNumber().toString());
        const modal: Element | null = document.getElementById('downloadModal');
        if (modal !== null) {
            modal.className = 'modal is-active';
        }
    }

    launchModded() {
        this.prepareLaunch();
        if (this.settings.riskOfRain2Directory !== null && fs.existsSync(this.settings.riskOfRain2Directory)) {
            const newLinkedFiles = ModLinker.link(this.settings.riskOfRain2Directory, this.settings.linkedFiles);
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
            GameRunner.playModded(this.settings.riskOfRain2Directory, ()=>{
                this.gameRunning = false;
            }, this.settings);
        }
    }

    launchVanilla() {
        this.prepareLaunch();
        if (this.settings.riskOfRain2Directory !== null && fs.existsSync(this.settings.riskOfRain2Directory)) {
            this.gameRunning = true;
            GameRunner.playVanilla(this.settings.riskOfRain2Directory, ()=>{
                this.gameRunning = false;
            }, this.settings);
        }
    }

    changeRoR2InstallDirectory() {
        const ror2Directory: string = this.settings.riskOfRain2Directory || 'C:/Program Files (x86)/Steam/steamapps/common/Risk of Rain 2';
        ipcRenderer.once('receive-selection', (_sender: any, files: string[] | null) => {
            if (!isNull(files) && files.length === 1) {
                this.settings.setRiskOfRain2Directory(files[0]);
            }
        })
        ipcRenderer.send('open-dialog', {
            title: 'Locate Risk of Rain 2 Directory',
            defaultPath: ror2Directory,
            properties: ['openDirectory'],
            buttonLabel: 'Select Directory',
        });
    }

    changeSteamDirectory() {
        const ror2Directory: string = this.settings.steamDirectory || 'C:/Program Files (x86)/Steam';
        ipcRenderer.once('receive-selection', (_sender: any, files: string[] | null) => {
            if (!isNull(files) && files.length === 1) {
                this.settings.setSteamDirectory(files[0]);
            }
        })
        ipcRenderer.send('open-dialog', {
            title: 'Locate Steam Directory',
            defaultPath: ror2Directory,
            properties: ['openDirectory'],
            buttonLabel: 'Select Directory',
        });
    }

    setAllModsEnabled(enabled: boolean) {
        this.localModList.forEach((mod: ManifestV2) => {
            let profileErr: R2Error | void;
            if (enabled) {
                profileErr = ProfileInstaller.enableMod(mod);
            } else {
                profileErr = ProfileInstaller.enableMod(mod);
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
            })
            if (update instanceof R2Error) {
                this.showError(update);
                return;
            }
            this.localModList = update;
        });
        this.filterModLists();
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

    changeProfile() {
        this.$router.push({path: '/profiles'});
    }


    created() {
        this.settings.load();
        const newModList: ManifestV2[] | R2Error = ProfileModList.getModList(Profile.getActiveProfile());
        if (!(newModList instanceof R2Error)) {
            this.localModList = newModList;
        }
        this.thunderstoreModList = ThunderstorePackages.PACKAGES;
        this.generateModlist();
        ipcRenderer.on('install-from-thunderstore-string', (_sender: any, data: string) => {
            const combo: ThunderstoreCombo | R2Error = ThunderstoreCombo.fromProtocol(data, this.thunderstoreModList);
            if (combo instanceof R2Error) {
                this.showError(combo);
                return;
            }
            this.performDependencyDownload(combo.getMod(), combo.getVersion());
        });
    }
}

</script>
