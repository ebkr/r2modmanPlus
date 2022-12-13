<template>
    <div class="full-height">
        <div class="sticky-top sticky-top--no-shadow sticky-top--no-padding">
            <aside class="menu">
                <p class="menu-label">{{ activeGame.displayName }}</p>
                <ul class="menu-list">
                    <li>
                        <a href="#" @click="launch(LaunchMode.MODDED)"><i class="fas fa-play-circle icon--margin-right"/>Start modded</a>
                    </li>
                    <li>
                        <a href="#" @click="launch(LaunchMode.VANILLA)"><i class="far fa-play-circle icon--margin-right"/>Start vanilla</a>
                    </li>
                </ul>
                <p class="menu-label">Mods</p>
                <ul class="menu-list">
                    <li>
                        <router-link :to="{name: 'manager.installed'}" class="tagged-link">
                            <i class="fas fa-folder tagged-link__icon icon--margin-right" />
                            <span class="tagged-link__content">Installed</span>
                            <span :class="getTagLinkClasses(['manager.installed'])">{{localModList.length}}</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{name: 'manager.online'}"
                                     :class="['tagged-link', {'is-active': $route.name === 'downloads'}]">
                            <i class="fas fa-globe tagged-link__icon icon--margin-right" />
                            <span class="tagged-link__content">Online</span>

                            <router-link :to="{name: 'downloads'}" class="margin-right--half-width">
                                <i class="tag fas fa-download is-primary" />
                            </router-link>
                            <span :class="getTagLinkClasses(['manager.online', 'downloads'])">{{thunderstoreModList.length}}</span>
                        </router-link>
                    </li>
                </ul>
                <p class='menu-label'>Other</p>
                <ul class='menu-list'>
                    <li>
                        <router-link :to="{name: 'config-editor'}">
                            <i class="fas fa-edit icon--margin-right" />
                            Config editor
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{name: 'manager.settings'}">
                            <i class="fas fa-cog icon--margin-right" />
                            Settings
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{name: 'help'}">
                            <i class="fas fa-question-circle icon--margin-right" />
                            Help
                        </router-link>
                    </li>
                </ul>
                <slot></slot>
            </aside>
        </div>
    </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import R2Error from '../../model/errors/R2Error';
import ManifestV2 from '../../model/ManifestV2';
import Game from '../../model/game/Game';
import GameManager from '../../model/game/GameManager';
import Profile from '../../model/Profile';
import {
    LaunchMode,
    launch,
    linkProfileFiles,
    setGameDirIfUnset,
    throwIfNoGameDir
 } from '../../utils/LaunchUtils';

@Component
export default class NavigationMenu extends Vue {
    private activeGame!: Game;
    private contextProfile: Profile | null = null;
    private LaunchMode = LaunchMode;

    get thunderstoreModList() {
        return this.$store.state.thunderstoreModList || [];
    }

    get localModList(): ManifestV2[] {
        return this.$store.state.localModList || [];
    }

    getTagLinkClasses(routeNames: string[]) {
        const base = ["tag", "tagged-link__tag"];
        return routeNames.includes(this.$route.name || "") ? base : [...base, "is-link"];
    }

    async launch(mode: LaunchMode) {
        try {
            await setGameDirIfUnset(this.activeGame);
            await throwIfNoGameDir(this.activeGame);

            if (mode === LaunchMode.MODDED) {
                await linkProfileFiles(this.activeGame, this.contextProfile!);
            }

            this.$store.commit("openGameRunningModal");
            await launch(this.activeGame, this.contextProfile!, mode);
        } catch (error) {
            if (error instanceof R2Error) {
                this.$store.commit("closeGameRunningModal");
                this.$emit("error", error);
            } else {
                throw error;
            }
        }

    }

    created() {
        this.activeGame = GameManager.activeGame;
        this.contextProfile = Profile.getActiveProfile();
    }
}

</script>

<style lang="scss" scoped>

.menu-list::v-deep a a {
    padding: 0;
}

</style>
