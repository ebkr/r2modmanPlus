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
                                <li><input class="input" type="text" placeholder="Search installed mods"/></li>
                            </ul>
                        </li>
                        <li>
                            <a @click="view = 'online'" :class="[view === 'online' ? 'is-active' : '']">Online</a>
                            <ul v-if="view === 'online'">
                                <li><input class="input" type="text" placeholder="Search available mods"/></li>
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
                            :title="key.name"
                            :description="key.versions[0].description"
                            :visible="false">
                                <a href="#" class="card-footer-item">Download</a>
                                <a href="#" class="card-footer-item">View on Thunderstore</a>
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
import { Prop } from 'vue-property-decorator';
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
    expandedOnline: {[key: string]: boolean} = {};

    constructor() {
        super();
        let tsModStringUnsafe = localStorage.getItem('ThunderstoreMods');
        let tsModStringSafe: string = tsModStringUnsafe ? tsModStringUnsafe : '[]';
        this.thunderstoreModList = JSON.parse(tsModStringSafe);
    }

    toggleOnlineExpanded(toExpand: any): void {
        this.expandedOnline[toExpand.name] = !this.expandedOnline[toExpand.name];
        this.expandedOnline = this.expandedOnline;
    }

    isExpanded(key: any, arr: {[key: string]: boolean}): boolean {
        return !!arr[key.name];
    }

    downloadMod(key: ThunderstoreMod, version: VersionNumber) {
        const downloader: ThunderstoreDownloader = new ThunderstoreDownloader(key);
        downloader.download((progress: number, status: number, error: DownloadError)=>{

        }, version);
    }
}

</script>
