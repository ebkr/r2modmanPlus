<template>
    <div>
        <div id="downloadModal" class="modal">
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-content">
                <div class='card'>
                    <header class="card-header" :id='id'>
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
                    <p class="menu-label">Game</p>
                    <ul class="menu-list">
                        <li><a>Play Risk of Rain 2</a></li>
                    </ul>
                    <p class="menu-label">Mods</p>
                    <ul class="menu-list">
                        <li>
                            <a @click="view = 'installed'" :class="[view === 'installed' ? 'is-active' : '']">Installed</a>
                            <ul v-if="view === 'installed'">
                                <li><input v-model='searchFilter' class="input" type="text" placeholder="Search installed mods"/></li>
                            </ul>
                        </li>
                        <li>
                            <a @click="view = 'online'" :class="[view === 'online' ? 'is-active' : '']">Online</a>
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
                    <div v-for='(key, index) in thunderstoreModList' :key='index'>
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
                </template>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch, Model } from 'vue-property-decorator';
import { Hero, Progress, ExpandableCard } from '../components/all';

import ThunderstoreMod from '../model/ThunderstoreMod';
import Mod from 'src/model/Mod';
import ThunderstoreDownloader from 'src/r2mm/downloading/ThunderstoreDownloader';
import VersionNumber from '../model/VersionNumber';
import DownloadError from '../model/errors/DownloadError';
import ThunderstoreVersion from '../model/ThunderstoreVersion';

import { ipcRenderer } from 'electron';

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
    versionNumbers: string[] = [];
    localModList: Mod[] = [];
    selectedMod: Mod | null = null;
    selectedThunderstoreMod: ThunderstoreMod | null = null;

    selectedVersion: string | null = null;

    @Watch('selectedVersion')
    onSelectedVersionChange(newValue: VersionNumber) {
    }

    searchFilter: string = '';


    @Watch("searchFilter")
    filterThunderstoreModList() {
        this.generateModlist();
        this.thunderstoreModList = this.thunderstoreModList.filter((x: ThunderstoreMod) => {
            return x.getName().toLowerCase().search(this.searchFilter.toLowerCase()) >= 0 ||  this.searchFilter.trim() === ''
        });
    }

    @Watch("searchFilter")
    filterLocalModList() {
        this.localModList = this.localModList.filter((x: Mod) => {
            x.getName()
                .toLowerCase()
                .search(this.searchFilter.toLowerCase()) >= 0
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
        let tsModStringUnsafe = localStorage.getItem('ThunderstoreMods');
        let tsModStringSafe: string = tsModStringUnsafe ? tsModStringUnsafe : '[]';
        this.thunderstoreModList = JSON.parse(tsModStringSafe)
            .map((mod: ThunderstoreMod) => new ThunderstoreMod().fromReactive(mod));
    }

    downloadMod() {
        if (this.selectedThunderstoreMod === null || this.selectedVersion === null) {
            // Shouldn't happen, but shouldn't cause an error.
            return;
        }
        const version = this.selectedThunderstoreMod.getVersions()
            .find((modVersion: ThunderstoreVersion) => modVersion.getVersionNumber().toString() === this.selectedVersion);
        if (version !== undefined) {
            const downloader: ThunderstoreDownloader = new ThunderstoreDownloader(this.selectedThunderstoreMod);
            downloader.download((progress: number, status: number, error: DownloadError)=>{
                
            }, version.getVersionNumber());
        }
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
        ipcRenderer.on('receiveThunderstoreModList', (_: any, data: ThunderstoreMod[]) => {
            this.thunderstoreModList = data.map((mod: ThunderstoreMod) => new ThunderstoreMod().fromReactive(mod));
        });
        ipcRenderer.send('getThunderstoreModList');
    }
}

</script>
