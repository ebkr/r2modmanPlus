<template>
    <div class="full-height">
        <div class="sticky-top sticky-top--no-shadow sticky-top--no-padding">
            <aside class="menu">
                <div>
                    <p class="menu-label">{{ activeGame.displayName }}</p>
                    <ul class="menu-list">
                        <li>
                            <a href="#" @click="launchGame(LaunchMode.MODDED)"><i class="fas fa-play-circle icon--margin-right"/>Start modded</a>
                        </li>
                        <li>
                            <a href="#" @click="launchGame(LaunchMode.VANILLA)"><i class="far fa-play-circle icon--margin-right"/>Start vanilla</a>
                        </li>
                    </ul>
                    <p class="menu-label">Mods</p>
                    <div>
                        <ul class="menu-list">
                            <li>
                                <router-link :to="{name: 'manager.installed'}" class="tagged-link">
                                    <i class="fas fa-folder tagged-link__icon icon--margin-right" />
                                    <span class="tagged-link__content">Installed</span>
                                    <span :class="getTagLinkClasses(['manager.installed', 'manager'])">{{localModCount}}</span>
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
                                    <span :class="getTagLinkClasses(['manager.online', 'downloads'])">{{thunderstoreModCount}}</span>
                                </router-link>
                            </li>
                        </ul>
                    </div>
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
                </div>
                <div class="menu-bottom">
                    <div id="profile-switcher" @click="openProfileManagementModal">
                        <img :src="`/images/game_selection/${activeGame.gameImage}`" alt="Game icon"/>
                        <div>
                            <p>{{ profile.getProfileName() }}</p>
                            <p class="sub-action">Profile</p>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</template>

<script lang="ts" setup>

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
import FileUtils from '../../utils/FileUtils';
import { ref, computed, onMounted, getCurrentInstance } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import VueRouter, { useRouter } from 'vue-router';
import { MobxProfileInstance } from 'src/store/modules/mobx/MobxProfile';

const store = getStore<State>();
const router = useRouter();

const activeGame = computed<Game>(() => store.state.activeGame);
const profile = computed<Profile>(() => MobxProfileInstance.activeProfile);
const localModCount = computed<number>(() => store.state.profile.modList.length);

const thunderstoreModCount = computed(() =>
    store.state.modFilters.showDeprecatedPackages
        ? store.state.tsMods.mods.length
        : store.getters['tsMods/undeprecatedModCount']
);

function getTagLinkClasses(routeNames: string[]) {
    const base = ["tag", "tagged-link__tag"];
    return router && router.currentRoute.value && routeNames.includes(router.currentRoute.value.name as string || "") ? [...base, "is-link"] : [...base, "is-inactive-link"];
}

function openProfileManagementModal() {
    store.commit("openProfileManagementModal");
}

async function launchGame(mode: LaunchMode) {
    try {
        await setGameDirIfUnset(activeGame.value);
        await throwIfNoGameDir(activeGame.value);

        if (mode === LaunchMode.MODDED) {
            await linkProfileFiles(activeGame.value, profile.value.asImmutableProfile());
        }

        store.commit("openGameRunningModal");
        await launch(activeGame.value, profile.value, mode);
    } catch (error) {
        store.commit("closeGameRunningModal");
        store.commit("error/handleError", R2Error.fromThrownValue(error));
    }
}

</script>

<style lang="scss" scoped>

.menu-list a a {
    padding: 0;
}

.menu {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 1rem);

    & > * {
        flex: 1;
    }

    &-bottom {
        flex: 0;
        padding-top: 1rem;
    }
}

#profile-switcher {
    display: flex;
    padding: 0.5rem;
    gap: 1rem;
    align-items: center;
    cursor: pointer;
    border-radius: 5px;
    margin-bottom: -1rem;

    &:hover {
        background-color: var(--menu-item-hover-background-color, #e9eaed);
    }

    * {
        flex: 1;
    }

    img {
        height: 3rem;
        flex: 0;
    }
}

.sub-action {
    font-size: 0.8rem;
    opacity: 0.8;
}

.tagged-link__content {
    padding-right: 0.75rem;
}

</style>
