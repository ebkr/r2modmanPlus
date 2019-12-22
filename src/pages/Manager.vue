<template>
    <div>
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
                                <li><input v-model='searchFilter' class="input" type="text" placeholder="Search available mods"/></li>
                            </ul>
                        </li>
                    </ul>
                    <p class="menu-label">Other</p>
                    <ul class="menu-list">
                        <li><a @click="view = 'config_editor'" :class="[view === 'config_editor' ? 'is-active' : '']">Config Editor</a></li>
                        <li><a @click="view = 'settings'" :class="[view === 'settings' ? 'is-active' : '']">Settings</a></li>
                        <li>
                            <a @click="view = 'help'" :class="[view === 'help' ? 'is-active' : '']">Help</a>
                            <ul v-if="view === 'help'">
                                <li><a href="#">Tips and tricks</a></li>
                                <li><a href="#">Game won't start</a></li>
                                <li><a href="#">Mods aren't working</a></li>
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
                                    <span v-html='getTitle(key)'></span>
                                </template>
                                <a :href='`#${index}`' class="card-footer-item" @click="downloadMod(key, key.versions[0].versionNumber)">Download</a>
                                <a :href='`#${index}`' class="card-footer-item">View on Thunderstore</a>
                                <div class="card-footer-item">
                                    <span><i class="fas fa-download"/> {{key.totalDownloads}}</span>
                                </div>
                                <div class="card-footer-item">
                                    <span><i class="fas fa-thumbs-up"/> {{key.rating}}</span>
                                </div>
                            </expandable-card>
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
import StatusEnum from '../model/enums/StatusEnum';
import DownloadError from '../model/errors/DownloadError';

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
    localModList: Mod[] = [];

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

    constructor() {
        super();
        let tsModStringUnsafe = localStorage.getItem('ThunderstoreMods');
        let tsModStringSafe: string = tsModStringUnsafe ? tsModStringUnsafe : '[]';
        this.thunderstoreModList = JSON.parse(tsModStringSafe)
            .map((mod: ThunderstoreMod) => new ThunderstoreMod().fromReactive(mod));
    }

    private generateModlist() {
        let tsModStringUnsafe = localStorage.getItem('ThunderstoreMods');
        let tsModStringSafe: string = tsModStringUnsafe ? tsModStringUnsafe : '[]';
        this.thunderstoreModList = JSON.parse(tsModStringSafe)
            .map((mod: ThunderstoreMod) => new ThunderstoreMod().fromReactive(mod));
    }

    downloadMod(vueMod: string, version: VersionNumber) {
        const mod = new ThunderstoreMod().fromReactive(vueMod);
        const downloader: ThunderstoreDownloader = new ThunderstoreDownloader(mod);
        downloader.download((progress: number, status: number, error: DownloadError)=>{

        }, version);
    }

    getTitle(key: any) {
        console.log(key);
        if (key.deprecated) {
            return key.name.strike();
        }
        return key.name;
    }
}

</script>
