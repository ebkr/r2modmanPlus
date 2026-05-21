<template>
    <div id="game-selection-screen">
        <EcosystemUpdateIndicator />
        <ModalCard id="select-platform-modal" v-show="showPlatformModal" :is-active="showPlatformModal" @close-modal="() => {showPlatformModal = false;}" class="z-max z-top">
            <template v-slot:header>
                <h2 class='modal-title'>Which store manages your game?</h2>
            </template>
            <template v-slot:body>
                <div v-if="selectedGame !== null">
                    <div v-for="(platform, index) of selectedGame.storePlatformMetadata" :key="`${index}-${platform.storePlatform}`">
                        <input type="radio" :id="`${index}-${platform.storePlatform}`" :value="platform.storePlatform" v-model="selectedPlatform"/>
                        <label :for="`${index}-${platform.storePlatform}`"><span class="margin-right margin-right--half-width"/>{{ platformLabels[platform.storePlatform] }}</label>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <button class='button is-info' @click='selectPlatform'>
                    Select platform
                </button>
            </template>
        </ModalCard>
        <hero
            :title="`${capitalize(activeTab)} selection`"
            :subtitle="
                activeTab === GameInstanceType.GAME
                    ? 'Which game are you managing your mods for?'
                    : 'Which dedicated server are you managing your mods for?'
            "
            :heroType="activeTab === GameInstanceType.GAME ? 'primary' : 'warning'"
        />
        <div class="notification is-warning is-square" v-if="runningMigration">
            <div class="container">
                <p>An update to the manager has occurred and needs to do background work.</p>
                <p>The options to select a game are disabled until the work has completed.</p>
            </div>
        </div>
        <div class="columns">
            <div class="column is-full">
                <div class="sticky-top is-shadowless background-bg z-top">
                    <div class="container">
                        <nav class="pad--sides pad--top-none flex">
                            <div class="input-group input-group--flex margin-right">
                                <input
                                    :value="filterText"
                                    @input="(e) => debouncedFilter((e.target as HTMLInputElement).value)"
                                    id="game-selection-search"
                                    class="input margin-right"
                                    type="text"
                                    placeholder="Search for a game"
                                    autocomplete="off"
                                />
                            </div>
                            <template v-if="viewMode === GameSelectionViewMode.LIST">
                                <div class="margin-right">
                                    <button class="button is-info"
                                       :disabled="selectedGame === null || runningMigration" @click="selectGame(selectedGame!)">Select {{ activeTab.toLowerCase() }}</button>
                                </div>
                                <div class="margin-right">
                                    <button class="button"
                                       :disabled="selectedGame === null || runningMigration" @click="selectDefaultGame(selectedGame!)">Set as default</button>
                                </div>
                            </template>
                            <div>
                                <i :class="['button', 'fas', viewMode === GameSelectionViewMode.LIST ? 'fa-th-large' : 'fa-list']" @click="toggleViewMode"></i>
                            </div>
                        </nav>
                        <div class="pad--sides pad--top-none">
                            <div class="tabs">
                                <ul>
                                    <li v-for="(value) in GameInstanceType" :key="`tab-${value}`"
                                        :class="[{'is-active': activeTab === value}]">
                                        <a @click="changeTab(value)">{{capitalize(value)}}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <GameSelectionList
                        @select-game="selectGame"
                        @set-default-game="selectDefaultGame"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Hero } from '../components/all';
import { GameInstanceType } from '../model/schema/ThunderstoreSchema';
import { GameSelectionViewMode } from '../model/enums/GameSelectionViewMode';
import ModalCard from '../components/ModalCard.vue';
import { onMounted, ref, provide } from 'vue';
import debounce from 'lodash.debounce';
import { useGameSelectionComposable, gameSelectionKey } from '../components/composables/GameSelectionComposable';
import GameSelectionList from '../components/game-selection/GameSelectionList.vue';
import Game from '../model/game/Game';
import { capitalize } from '../utils/StringUtils';
import { StorePlatform as platformLabels } from '../model/platform/StorePlatform';
import EcosystemUpdateIndicator from '../components/navigation/EcosystemUpdateIndicator.vue';
import { getStore } from '../providers/generic/store/StoreProvider';
import { State } from '../store';

const store = getStore<State>();

const gameSelection = useGameSelectionComposable();
provide(gameSelectionKey, gameSelection);

const {
    selectedGame,
    selectedPlatform,
    filterText,
    activeTab,
    viewMode,
    runningMigration,
    isSettingDefaultPlatform,
    markAsSelectedGame,
    changeTab,
    toggleViewMode,
    proceed,
    proceedDefault,
    selectPlatformForGame,
    initialize,
} = gameSelection;

const showPlatformModal = ref<boolean>(false);
const debouncedFilter = debounce((value: string) => { filterText.value = value; }, 100);

function selectGame(game: Game) {
    markAsSelectedGame(game);
    isSettingDefaultPlatform.value = false;
    if (game.storePlatformMetadata.length > 1) {
        selectPlatformForGame(game);
        showPlatformModal.value = true;
    } else {
        selectedPlatform.value = game.storePlatformMetadata[0]!.storePlatform;
        showPlatformModal.value = false;
        proceed();
    }
}

function selectDefaultGame(game: Game) {
    markAsSelectedGame(game);
    isSettingDefaultPlatform.value = true;
    if (game.storePlatformMetadata.length > 1) {
        showPlatformModal.value = true;
    } else {
        selectedPlatform.value = game.storePlatformMetadata[0]!.storePlatform;
        showPlatformModal.value = false;
        proceedDefault();
    }
}

function selectPlatform() {
    showPlatformModal.value = false;
    if (isSettingDefaultPlatform.value) {
        proceedDefault();
    } else {
        proceed();
    }
}

onMounted(async () => {
    window.app.checkForApplicationUpdates();
    await initialize();
    void store.dispatch('ecosystemUpdate/updateEcosystemSchema');
});
</script>


<style lang="scss" scoped>
.mb-2 {
    margin-bottom: 0.5rem !important;
}

#game-selection-screen {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
}

#game-selection-search {
    min-width: 100px;
}
</style>
