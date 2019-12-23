<template>
    <div>
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
                        <span class="tag is-success" v-else-if='versionNumbers[0] === selectedVersion'>This is the latest version</span>
                        <span class="tag is-danger" v-else-if='versionNumbers[0] !== selectedVersion'>This is an outdated version</span>
                    </div>
                    <div class='card-footer'>
                        <button class="button is-info" @click="downloadMod()">Download</button>
                    </div>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeModal()"></button>
        </div>
        <div class="columns">
            <div class="column is-one-quarter">
                <aside class="menu">
                    <p class="menu-label">Risk of Rain 2</p>
                    <ul class="menu-list">
                        <li><a>Start modded</a></li>
                        <li><a>Start vanilla</a></li>
                    </ul>
                    <p class="menu-label">Mods</p>
                    <ul class="menu-list">
                        <li>
                            <a @click="view = 'installed'; searchFilter = ''" :class="[view === 'installed' ? 'is-active' : '']">Installed</a>
                            <ul v-if="view === 'installed'">
                                <li><input v-model='searchFilter' class="input" type="text" placeholder="Search installed mods"/></li>
                            </ul>
                        </li>
                        <li>
                            <a @click="view = 'online'; searchFilter = ''" :class="[view === 'online' ? 'is-active' : '']">Online</a>
                            <ul v-if="view === 'online'">
                                <li><input v-model='searchFilter' class='input' type='text' placeholder='Search available mods'/></li>
                            </ul>
                        </li>
                    </ul>
                    <p class='menu-label'>Other</p>
                    <ul class='menu-list'>
                        <li><a @click="view = 'config_editor'" :class="[view === 'config_editor' ? 'is-active' : '']">Config Editor</a></li>
                        <li><a @click="view = 'settings'" :class="[view === 'settings' ? 'is-active' : '']">Settings</a></li>
                        <li>
                            <a @click="view = 'help'" :class="[view === 'help' ? 'is-active' : '']">Help</a>
                            <ul v-if="view === 'help'">
                                <li><a href='#'>Tips and tricks</a></li>
                                <li><a href='#'>Game won't start</a></li>
                                <li><a href='#'>Mods aren't working</a></li>
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
                                <a class='card-footer-item'>View on Thunderstore</a>
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
                        <div v-for='(key, index) in searchableLocalModList' :key="'local-' + index">
                            <expandable-card
                                :image="key.icon"
                                :id="index"
                                :description="key.description"
                                :visible="false">
                                    <template v-slot:title>
                                        <span>{{key.name}}</span>
                                    </template>
                                    <template v-slot:other-icons>
                                        <!-- Show update and missing dependency icons -->
                                    </template>
                                    <a class='card-footer-item'>Uninstall</a>
                                    <a class='card-footer-item'>Disable/Enable</a>
                                    <a class='card-footer-item'>Update</a>
                                    <a class='card-footer-item'>View on Thunderstore</a>
                                </expandable-card>
                        </div>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { Hero, Progress, ExpandableCard } from '../components/all';

import ThunderstoreMod from '../model/ThunderstoreMod';
import Mod from 'src/model/Mod';
import ThunderstoreDownloader from 'src/r2mm/downloading/ThunderstoreDownloader';
import VersionNumber from '../model/VersionNumber';
import DownloadError from '../model/errors/DownloadError';
import ThunderstoreVersion from '../model/ThunderstoreVersion';
import ProfileModList from 'src/r2mm/mods/ProfileModList'

import { ipcRenderer } from 'electron';
import Profile from '../model/Profile';
import StatusEnum from '../model/enums/StatusEnum';
import R2Error from '../model/errors/R2Error';
import ModFromManifest from '../r2mm/mods/ModFromManifest';
import ThunderstorePackages from '../r2mm/data/ThunderstorePackages';

@Component({
    components: {
        'hero': Hero,
        'progress-bar': Progress,
        'expandable-card': ExpandableCard,
    }
})
export default class Manager extends Vue {
    view: string = 'installed';

    thunderstoreModList: ThunderstoreMod[] = [];
    searchableThunderstoreModList: ThunderstoreMod[] = [];
    
    localModList: Mod[] = [];
    searchableLocalModList: Mod[] = [];

    versionNumbers: string[] = [];
    selectedMod: Mod | null = null;
    selectedThunderstoreMod: ThunderstoreMod | null = null;

    selectedVersion: string | null = null;

    searchFilter: string = '';

    @Watch('searchFilter')
    filterModLists() {
        this.generateModlist();
        this.searchableLocalModList = this.localModList.filter((x: Mod) => {
            return x.getName().toLowerCase().search(this.searchFilter.toLowerCase()) >= 0 ||  this.searchFilter.trim() === ''
        });
        this.searchableThunderstoreModList = this.thunderstoreModList.filter((x: Mod) => {
            return x.getName().toLowerCase().search(this.searchFilter.toLowerCase()) >= 0 ||  this.searchFilter.trim() === ''
        });
    }

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

    private generateModlist() {
        this.searchableThunderstoreModList = this.thunderstoreModList;
        this.searchableLocalModList = this.localModList;
    }

    downloadMod() {
        const refSelectedThunderstoreMod: ThunderstoreMod | null = this.selectedThunderstoreMod;
        const refSelectedVersion: string | null = this.selectedVersion;
        if (refSelectedThunderstoreMod === null || refSelectedVersion === null) {
            // Shouldn't happen, but shouldn't cause an error.
            return;
        }
        const version = refSelectedThunderstoreMod.getVersions()
            .find((modVersion: ThunderstoreVersion) => modVersion.getVersionNumber().toString() === refSelectedVersion);
        if (version === undefined) {
            return;
        }
        const downloader: ThunderstoreDownloader = new ThunderstoreDownloader(refSelectedThunderstoreMod, Profile.getActiveProfile());
        downloader.download((progress: number, status: number, error_: DownloadError)=>{
            if (status === StatusEnum.SUCCESS) {
                const modFromManifest: Mod | R2Error = ModFromManifest.get(refSelectedThunderstoreMod.getFullName(), version.getVersionNumber());
                if (!(modFromManifest instanceof R2Error)) {
                    const newModList: Mod[] | R2Error = ProfileModList.addMod(modFromManifest);
                    if (!(newModList instanceof R2Error)) {
                        this.localModList = newModList;
                    }
                } else {
                    // Show that mod has failed to register for profile
                }
                if (this.selectedThunderstoreMod === refSelectedThunderstoreMod) {
                    // Close modal if no other modal has been opened.
                    this.closeModal();
                }
            }
        }, version.getVersionNumber());

    }

    getTitle(key: any) {
        if (key.deprecated) {
            return key.name.strike();
        }
        return key.name;
    }

    isThunderstoreModInstalled(vueMod: ThunderstoreMod) {
        const mod: ThunderstoreMod = new ThunderstoreMod().fromReactive(vueMod);
        return this.localModList.find((local: Mod) => local.getFullName() === mod.getFullName()) != undefined;
    }

    created() {
        const newModList: Mod[] | R2Error = ProfileModList.getModList(Profile.getActiveProfile());
        if (!(newModList instanceof R2Error)) {
            this.localModList = newModList;
        }
        this.thunderstoreModList = ThunderstorePackages.PACKAGES;

        this.generateModlist();
    }
}

</script>
