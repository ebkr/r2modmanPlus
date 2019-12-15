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
                            <template :v-if="view === 'installed'">
                                <ul>
                                    <li><input class="input" type="text" placeholder="Search installed mods"/></li>
                                </ul>
                            </template>
                        </li>
                        <li><a @click="view = 'online'" :class="[view === 'online' ? 'is-active' : '']">Online</a></li>
                    </ul>
                    <p class="menu-label">Other</p>
                    <ul class="menu-list">
                        <li><a @click="view = 'config_editor'" :class="[view === 'config_editor' ? 'is-active' : '']">Config Editor</a></li>
                        <li><a @click="view = 'settings'" :class="[view === 'settings' ? 'is-active' : '']">Settings</a></li>
                    </ul>
                </aside>
            </div>
            <div class='column is-three-quarters'>
                <div v-for='(key, index) in thunderstoreModList' :key='index'>
                    <expandable-card
                        :image="key.versions[0].icon"
                        :title="key.name"
                        :description="key.versions[0].description"
                        :visible="false" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { Hero, Progress, ExpandableCard } from '../components/all';
import ThunderstoreMod from '../model/ThunderstoreMod';
import Mod from '../model/Mod';
import { Prop } from 'vue-property-decorator';

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
}

</script>
