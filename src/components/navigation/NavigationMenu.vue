<template>
    <div class="full-height">
        <div id='gameRunningModal' :class="['modal', {'is-active':(gameRunning !== false)}]">
            <div class="modal-background" @click="closeGameRunningModal()"></div>
            <div class='modal-content'>
                <div class='notification is-info' v-if="activeGame !== undefined">
                    <h3 class='title' v-if="activeGame.activePlatform.storePlatform === 'Steam'">{{ activeGame.displayName }} is launching via Steam</h3>
                    <h3 class='title' v-else>{{ activeGame.displayName }} is starting</h3>
                    <h5 class="title is-5">Close this message to continue modding.</h5>
                    <div v-if="activeGame.activePlatform.storePlatform === 'Steam'">
                        <p>If this is taking a while, it's likely due to Steam starting.</p>
                        <p>Please be patient, and have fun!</p>
                    </div>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeGameRunningModal()"></button>
        </div>
        <div class="sticky-top sticky-top--no-shadow sticky-top--no-padding">
            <aside class="menu">
                <p class="menu-label">{{ activeGame.displayName }}</p>
                <ul class="menu-list">
                    <li v-if="canShowServerList">
                        <a href="#" data-ref="serverlist" @click="emitClick($event.target)"
                           class="tagged-link" :class="[view === 'serverlist' ? 'is-active' : '']">
                            <i class="fas fa-server tagged-link__icon icon--margin-right" data-ref="serverlist" @click.prevent.stop="emitClick($event.target)"/>
                            <span class="tagged-link__content margin-right margin-right--half-width" data-ref="serverlist" @click.prevent.stop="emitClick($event.target)">Server List</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" @click="launch(true)"><i class="fas fa-play-circle icon--margin-right"/>Start modded</a>
                    </li>
                    <li>
                        <a href="#" @click="launch(false)"><i class="far fa-play-circle icon--margin-right"/>Start vanilla</a>
                    </li>
                </ul>
                <p class="menu-label">Mods</p>
                <ul class="menu-list">
                    <li>
                        <!-- Strange bug seemingly caused by CSS Grid display. Children @click is not being passed up to parent. -->
                        <!-- Due to this, the click event must be applied to all children. Parent container also binds click to account for margins. -->
                        <a href="#" data-ref="installed" @click="emitClick($event.target)"
                           class="tagged-link" :class="[view === 'installed' ? 'is-active' : '']">
                            <i class="fas fa-folder tagged-link__icon icon--margin-right" data-ref="installed" @click.prevent.stop="emitClick($event.target)"/>
                            <span class="tagged-link__content margin-right margin-right--half-width" data-ref="installed" @click.prevent.stop="emitClick($event.target)">Installed</span>
                            <span class="tag tagged-link__tag" :class="[{'is-link': view !== 'installed'}]"
                            data-ref="installed" @click.prevent.stop="emitClick($event.target)">{{localModList.length}}</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" data-ref="online" @click="emitClick($event.target)"
                           class="tagged-link" :class="[view === 'online' ? 'is-active' : '']">
                            <i class="fas fa-globe tagged-link__icon icon--margin-right" data-ref="online" @click.prevent.stop="emitClick($event.target)"/>
                            <span class="tagged-link__content margin-right margin-right--half-width" data-ref="online" @click.prevent.stop="emitClick($event.target)">Online</span>
                            <i data-ref="downloads" class="tag tagged-link__tag fas fa-download is-primary margin-right margin-right--half-width" @click.prevent.stop="emitClick($event.target)"></i>
                            <span class="tag tagged-link__tag" :class="[{'is-link': view !== 'online'}]"
                            data-ref="online" @click.prevent.stop="emitClick($event.target)">{{thunderstoreModList.length}}</span>
                        </a>
                    </li>
                </ul>
                <p class='menu-label'>Other</p>
                <ul class='menu-list'>
                    <li>
                        <a href="#" :class="[view === 'config-editor' ? 'is-active' : '']" data-ref="config-editor" @click="emitClick($event.target)">
                            <i class="fas fa-edit icon--margin-right"/>Config editor
                        </a>
                    </li>
                    <li>
                        <a href="#" :class="[view === 'settings' ? 'is-active' : '']"
                           data-ref="settings" @click="emitClick($event.target)">
                            <i class="fas fa-cog icon--margin-right"/>Settings
                        </a>
                    </li>
                    <li>
                        <a href="#" :class="[view === 'help' ? 'is-active' : '']"
                           data-ref="help" @click="emitClick($event.target)">
                            <i class="fas fa-question-circle icon--margin-right"/>Help</a>
                    </li>
                </ul>
                <slot></slot>
            </aside>
        </div>
    </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';
import R2Error from '../../model/errors/R2Error';
import ManagerSettings from '../../r2mm/manager/ManagerSettings';
import ManifestV2 from '../../model/ManifestV2';
import ManagerInformation from '../../_managerinf/ManagerInformation';
import Game from '../../model/game/Game';
import GameManager from '../../model/game/GameManager';
import Profile from '../../model/Profile';
import { PackageLoader } from '../../model/installing/PackageLoader';
import {
    launch,
    linkProfileFiles,
    setGameDirIfUnset,
    throwIfNoGameDir
 } from '../../utils/LaunchUtils';

@Component
    export default class NavigationMenu extends Vue {

        private activeGame!: Game;
        private contextProfile: Profile | null = null;

        @Prop({default: ""})
        private view!: string;

        private gameRunning: boolean = false;

        get settings() {
            return ManagerSettings.getSingleton(this.activeGame);
        }

        get thunderstoreModList() {
            return this.$store.state.thunderstoreModList || [];
        }

        get localModList(): ManifestV2[] {
            return this.$store.state.localModList || [];
        }

        get appName(): string {
            return ManagerInformation.APP_NAME;
        }

        get canShowConfigEditor() {
            return this.activeGame.packageLoader === PackageLoader.BEPINEX;
        }

        get canShowServerList(): boolean {
            return GameManager.activeGame.settingsIdentifier === "VRising";
        }

        emitClick(element: any) {
            this.$emit("clicked-" + element.getAttribute("data-ref"));
        }

        async launch(useMods: boolean) {
            try {
                await setGameDirIfUnset(this.activeGame);
                await throwIfNoGameDir(this.activeGame);

                if (useMods) {
                    await linkProfileFiles(this.activeGame, this.contextProfile!);
                }

                this.gameRunning = true;
                await launch(this.activeGame, this.contextProfile!, useMods);
            } catch (error) {
                if (error instanceof R2Error) {
                    this.gameRunning = false;
                    this.$emit("error", error);
                } else {
                    throw error;
                }
            }

        }

        closeGameRunningModal() {
            this.gameRunning = false;
        }

        created() {
            this.activeGame = GameManager.activeGame;
            this.contextProfile = Profile.getActiveProfile();
        }
    }

</script>
