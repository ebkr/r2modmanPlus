<template>
    <div class="full-height">
        <aside class="menu">
            <div id="menu__top">
                <p class="menu-label">{{ activeGame.displayName }}</p>
                <div class="launch-control">
                    <button class="button is-info" @click="launchGame(selectedMode)">Start</button>
                    <div class="launch-modes">
                        <span class="launch-mode" :class="{'launch-mode--active': selectedMode === LaunchMode.MODDED}" @click="selectedMode = LaunchMode.MODDED">Modded</span>
                        <span class="launch-mode" :class="{'launch-mode--active': selectedMode === LaunchMode.VANILLA}" @click="selectedMode = LaunchMode.VANILLA">Vanilla</span>
                    </div>
                </div>
                <hr/>
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
                <hr/>
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
        </aside>
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
import ProtocolProvider from '../../providers/generic/protocol/ProtocolProvider';

const store = getStore<State>();
const router = useRouter();

const selectedMode = ref<LaunchMode>(LaunchMode.MODDED);

const activeGame = computed<Game>(() => store.state.activeGame);
const profile = computed<Profile>(() => store.getters['profile/activeProfile']);
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

hr {
    background-color: var(--nav-hr-background-color);
    margin: 1rem 0;
}

.launch-control {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    padding: 0.25rem 0 0;
}

.launch-modes {
    display: flex;
    flex-direction: row;
    gap: 0.2rem;
    width: 100%;
}

.launch-mode {
    margin-top: 0.25rem;
    display: block;
    font-size: 0.95rem;
    cursor: pointer;
    color: var(--text);
    opacity: 0.65;
    transition: opacity 0.1s ease, background-color 0.1s ease;
    user-select: none;
    padding: 0.5em 0.5em;
    border-radius: 6px;
    flex: 1;
    text-align: center;

    &--active {
        opacity: 1;
        color: var(--nav-active-text-color);
        background-color: var(--nav-active-secondary-color);
    }

    &:hover:not(&--active) {
        opacity: 0.8;
    }
}

.menu-list a a {
    padding: 0;
}

.menu {
    display: flex;
    flex-direction: column;
    padding-right: 1rem;
    height: 100%;

    & > * {
        flex: 1;
    }

    &__top {
        flex: 1;
    }

    &__bottom {
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

.profile-select {
    padding: 0.2rem 0.1rem;
    width: 100px;
}

</style>
