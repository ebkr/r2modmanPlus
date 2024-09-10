<template>
    <div id="content" class="dashboard">
        <NavigationMenu />
        <div>
            <div class="top-bar">
                <div
                    class="profile"
                    @click="$router.push({ name: 'profiles' })"
                >
                    {{ activeProfile.profileName }}
                    <p>Change profile</p>
                </div>
                <div class="play-buttons">
                    <button class="vanilla" @click="launch(LaunchMode.VANILLA)">
                        <i class="far fa-play-circle icon--margin-right"/>Vanilla
                    </button>
                    <button class="modded" @click="launch(LaunchMode.MODDED)">
                        <i class="fas fa-play-circle icon--margin-right"/>Modded
                    </button>
                </div>
            </div>
            <div class="router-page">
                <router-view />
            </div>
        </div>
        <GameRunningModal :activeGame="$store.state.activeGame" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import NavigationMenu from './NavigationMenu.vue';
import GameRunningModal from '../modals/GameRunningModal.vue';
import {
    LaunchMode,
    launch,
    linkProfileFiles,
    setGameDirIfUnset,
    throwIfNoGameDir
 } from '../../utils/LaunchUtils';

import R2Error from '../../model/errors/R2Error';
import Game from '../../model/game/Game';
import Profile from '../../model/Profile';
import ManagerSettings from '../../r2mm/manager/ManagerSettings';

@Component({
    components: { GameRunningModal, NavigationMenu },
})
export default class NavigationLayout extends Vue {
    readonly LaunchMode = LaunchMode;

    get activeProfile() {
        return this.$store.state.profile.activeProfile;
    }
    get activeGame(): Game {
      return this.$store.state.activeGame;
    }

    async changeGame() {
        await ManagerSettings.resetDefaults();
        await this.$router.push({name: 'index'});
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
