<template>
    <div class="full-height">
        <aside class="menu">
            <div id="menu__top">
                <p class="menu-label">{{ activeGame.displayName }}</p>
                <div class="launch-control">
                    <div class="launch-split">
                        <button class="launch-split__start" @click="launchGame(selectedMode)">
                            <i class="fas fa-play fa-fw" />
                            <span>
                                Start {{ selectedMode === LaunchMode.MODDED ? 'modded' : 'vanilla' }}
                            </span>
                        </button>
                        <ActivityDropdown trigger="click" placement="bottom-end">
                            <template #default="{ shown }">
                                <button class="launch-split__mode">
                                    <p>
                                        <i :class="['fas', shown ? 'fa-caret-up' : 'fa-caret-down']" />
                                    </p>
                                </button>
                            </template>
                            <template #popper>
                                <ul class="menu-list">
                                    <li v-if="selectedMode === LaunchMode.VANILLA">
                                        <a v-close-popper @click="selectedMode = LaunchMode.MODDED">
                                            <i class="fas fa-play fa-fw" />
                                            Start modded
                                        </a>
                                    </li>
                                    <li v-else>
                                        <a v-close-popper @click="selectedMode = LaunchMode.VANILLA">
                                            <i class="fas fa-play fa-fw" />
                                            Start vanilla
                                        </a>
                                    </li>
                                </ul>
                            </template>
                        </ActivityDropdown>
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
                                         :class="['tagged-link', {'is-active': router.currentRoute.value.name === 'downloads'}]">
                                <i class="fas fa-globe tagged-link__icon icon--margin-right" />
                                <span class="tagged-link__content">Online</span>

                                <router-link :to="{name: 'downloads'}" class="margin-right--half-width">
                                    <i class="tag fas fa-download is-primary" />
                                </router-link>
                                <span :class="getTagLinkClasses(['manager.online', 'downloads'])">{{filteredModCount}}</span>
                            </router-link>
                        </li>
                    </ul>
                </div>
                <hr/>
                <p class='menu-label'>Other</p>
                <ul class='menu-list'>
                    <li>
                        <router-link :to="{name: 'config-editor.selection'}">
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
import { ref, computed } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import { useRouter } from 'vue-router';
import ActivityDropdown from '../v2/ActivityDropdown.vue';
import { useModFilters } from '../composables/ModFiltersComposable';

const store = getStore<State>();
const router = useRouter();
const { filteredModCount } = useModFilters();

const selectedMode = ref<LaunchMode>(LaunchMode.MODDED);

const activeGame = computed<Game>(() => store.state.activeGame);
const profile = computed<Profile>(() => store.getters['profile/activeProfile']);
const localModCount = computed<number>(() => store.state.profile.modList.length);

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
    padding: 0.25rem 0 0;
}

.launch-split {
    display: flex;
    border-radius: 6px;
    overflow: hidden;
    width: 100%;
}

.launch-split__start {
    flex: 1;
    background-color: var(--scheme-primary, #3273dc);
    color: white;
    border: none;
    padding: 0.55em 1em;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: filter 0.15s ease;
    display: flex;
    text-align: left;
    place-items: center;

    &:hover { filter: brightness(1.12); }
    &:active { filter: brightness(0.9); }

    & > * {
        flex: 1;
    }

    & > i {
        flex: 0;
        margin-right: 0.5rem;
    }
}

.launch-split__mode {
    background-color: var(--scheme-primary, #3273dc);
    color: white;
    border: none;
    padding: 0.55em 0.75em;
    font-size: 0.95rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.4em;
    white-space: nowrap;
    transition: filter 0.15s ease;
    margin-left: 2px;

    &:hover { filter: brightness(1.12); }
    &:active { filter: brightness(0.9); }
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
