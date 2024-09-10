<template>
    <div class="full-height-minus-bar sidebar">
        <div class="sticky-top full-height sticky-top--no-shadow sticky-top--no-padding">
            <aside class="menu">
                <button @click="changeGame()" class="active-game">
                    <img :src="getImage(activeGame.gameImage)" />
                    <div class="active-game-text">
                        {{ activeGame.displayName }}
                        <p class="active-game-change">Change game</p>
                    </div>

                </button>
                <ul class="menu-list">
                    <li>
                        <router-link :to="{name: 'manager.installed'}" class="tagged-link">
                            <i class="fas fa-folder tagged-link__icon icon--margin-right" />
                            <span class="tagged-link__content">My mods</span>
                            <span :class="getTagLinkClasses(['manager.installed'])">{{localModCount}}</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{name: 'manager.online'}"
                                     :class="['tagged-link']">
                            <i class="fas fa-globe tagged-link__icon icon--margin-right" />
                            <span class="tagged-link__content">Get Mods</span>
                            <span :class="getTagLinkClasses(['manager.online'])">{{thunderstoreModCount}}</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{name: 'downloads'}" class="tagged-link">
                            <i class="fas fa-download tagged-link__icon icon--margin-right" />
                            <span class="tagged-link__content">Downloads</span>
                            <!-- <span :class="getTagLinkClasses(['downloads'])">0</span> -->
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{name: 'config-editor'}" class="tagged-link">
                            <i class="fas fa-edit tagged-link__icon icon--margin-right" />
                            <span class="tagged-link__content">Config editor</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{name: 'manager.settings'}" class="tagged-link">
                            <i class="fas fa-cog tagged-link__icon icon--margin-right" />
                            <span class="tagged-link__content">Settings</span>
                        </router-link>
                    </li>
                    <li class="menu-help">
                        <router-link :to="{name: 'help'}">
                            <i class="far fa-question-circle icon--margin-right" />
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
import Game from '../../model/game/Game';
import ManagerSettings from '../../r2mm/manager/ManagerSettings';

@Component
export default class NavigationMenu extends Vue {
    readonly ManagerSettings = ManagerSettings

    get activeGame(): Game {
      return this.$store.state.activeGame;
    }

    getImage(image: string) {
        return require("../../assets/images/game_selection/" + image);
    }

    async changeGame() {
        await ManagerSettings.resetDefaults();
        await this.$router.push({name: 'index'});
    }

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
}

</script>

<style lang="scss" scoped>

.menu-list a a {
    padding: 0;
}

</style>
