<template>
    <div class="full-height">
        <div class="sticky-top sticky-top--no-shadow sticky-top--no-padding">
            <aside class="menu">
                <p class="menu-label">{{ activeGame.displayName }}</p>
                <ul class="menu-list">
                    <li>
                        <a href="#" @click="launch(LaunchMode.MODDED)"><i class="fas fa-play-circle icon--margin-right"/>{{ $t('navigation.menu.modded') }}</a>
                    </li>
                    <li>
                        <a href="#" @click="launch(LaunchMode.VANILLA)"><i class="far fa-play-circle icon--margin-right"/>{{ $t('navigation.menu.vanilla') }}</a>
                    </li>
                </ul>
                <p class="menu-label">{{ $t('navigation.menu.mods') }}</p>
                <ul class="menu-list">
                    <li>
                        <router-link :to="{name: 'manager.installed'}" class="tagged-link">
                            <i class="fas fa-folder tagged-link__icon icon--margin-right" />
                            <span class="tagged-link__content">{{ $t('navigation.menu.installed') }}</span>
                            <span :class="getTagLinkClasses(['manager.installed'])">{{localModCount}}</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{name: 'manager.online'}"
                                     :class="['tagged-link', {'is-active': $route.name === 'downloads'}]">
                            <i class="fas fa-globe tagged-link__icon icon--margin-right" />
                            <span class="tagged-link__content">{{ $t('navigation.menu.online') }}</span>

                            <router-link :to="{name: 'downloads'}" class="margin-right--half-width">
                                <i class="tag fas fa-download is-primary" />
                            </router-link>
                            <span :class="getTagLinkClasses(['manager.online', 'downloads'])">{{thunderstoreModCount}}</span>
                        </router-link>
                    </li>
                </ul>
                <p class='menu-label'>{{ $t('navigation.menu.other') }}</p>
                <ul class='menu-list'>
                    <li>
                        <router-link :to="{name: 'config-editor'}">
                            <i class="fas fa-edit icon--margin-right" />
                            {{ $t('navigation.menu.editor') }}
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{name: 'manager.settings'}">
                            <i class="fas fa-cog icon--margin-right" />
                            {{ $t('navigation.menu.settings') }}
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{name: 'help'}">
                            <i class="fas fa-question-circle icon--margin-right" />
                            {{ $t('navigation.menu.help') }}
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
import Game from '../../model/game/Game';
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
    private LaunchMode = LaunchMode;

    get activeGame(): Game {
      return this.$store.state.activeGame;
    }

    get profile(): Profile {
        return this.$store.getters['profile/activeProfile'];
    };

    get thunderstoreModCount() {
        return this.$store.state.modFilters.showDeprecatedPackages
          ? this.$store.state.tsMods.mods.length
          : this.$store.getters['tsMods/undeprecatedModCount'];
    }

    get localModCount(): number {
        return this.$store.state.profile.modList.length;
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
                await linkProfileFiles(this.activeGame, this.profile);
            }

            this.$store.commit("openGameRunningModal");
            await launch(this.activeGame, this.profile, mode);
        } catch (error) {
            this.$store.commit("closeGameRunningModal");
            this.$store.commit("error/handleError", R2Error.fromThrownValue(error));
        }
    }
}

</script>

<style lang="scss" scoped>

.menu-list a a {
    padding: 0;
}

</style>
