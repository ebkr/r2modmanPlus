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
                        <li><a @click="view = 'installed'" :class="[view === 'installed' ? 'is-active' : '']">Installed</a></li>
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
                <div class='card is-marginless is-radiusless is-shadowless sticky-top is-info'>
                    <div class='card-header is-shadowless is-radiusless'>
                        <input class='input' type='text' placeholder='Search for installed mods'>
                    </div>
                </div>
                <div class='box is-marginless is-radiusless' v-for='(key, index) in thunderstoreModList' :key='index'>
                    <article class="media">
                        <div class="media-left">
                            <figure class="image is-32x32">
                                <img src="https://bulma.io/images/placeholders/128x128.png" alt="Image">
                            </figure>
                        </div>
                        <div class="media-content">
                            <div class="content">
                                <p>{{key.name}}</p>
                            </div>
                        </div>
                        <div class="media-right">
                            <div class="content">
                                <i class="fas fa-download margin-right"/>
                                <!-- <a class="delete"></a> -->
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { Hero, Progress } from '../components/all';
import ThunderstoreMod from '../model/ThunderstoreMod';
import Mod from '../model/Mod';

@Component({
    components: {
        'hero': Hero,
        'progress-bar': Progress,
    }
})
export default class Splash extends Vue {
    view: string = 'installed';
    thunderstoreModList: ThunderstoreMod[] = [];
    localModList: Mod[] = [];

    constructor() {
        super();
        let tsModStringUnsafe = localStorage.getItem("ThunderstoreMods");
        let tsModStringSafe: string = tsModStringUnsafe ? tsModStringUnsafe : '[]';
        this.thunderstoreModList = JSON.parse(tsModStringSafe);
    }
}

</script>
