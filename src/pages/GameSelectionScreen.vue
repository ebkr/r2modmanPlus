<template>
    <div id="game-list-loading" v-if="!visible">
        <div class="fa-3x">
            <i class="fas fa-circle-notch fa-spin"></i>
        </div>
        <p>{{ t('translations.pages.gameSelection.loading') }}</p>
    </div>
    <div id="game-selection-screen" v-else>
        <EcosystemUpdateIndicator />
        <PlatformSelectionModal
            :is-open="showPlatformModal"
            @close="showPlatformModal = false"
            @select-platform="selectPlatform"
        />
        <hero
            :title="t(`translations.pages.gameSelection.pageTitle.title.${activeTab}`)"
            :subtitle="t(`translations.pages.gameSelection.pageTitle.subtitle.${activeTab}`)"
            :heroType="activeTab === GameInstanceType.GAME ? 'primary' : 'warning'"
        />
        <div class="notification is-warning is-square" v-if="runningMigration">
            <div class="container">
                <p>{{ t('translations.pages.gameSelection.migrationNotice.requiresUpdate') }}</p>
                <p>{{ t('translations.pages.gameSelection.migrationNotice.actionsDisabled') }}</p>
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
                                    @input="(e: Event) => debouncedFilter((e.target as HTMLInputElement).value)"
                                    id="game-selection-search"
                                    class="input margin-right"
                                    type="text"
                                    :placeholder="t(`translations.pages.gameSelection.filter.placeholder.${activeTab}`)"
                                    autocomplete="off"
                                />
                            </div>
                            <template v-if="viewMode === GameSelectionViewMode.LIST">
                                <div class="margin-right">
                                    <button class="button is-info"
                                       :disabled="selectedGame === null || runningMigration" @click="selectGame(selectedGame! as Game)">
                                       {{ t(`translations.pages.gameSelection.actions.select.${activeTab}`) }}
                                    </button>
                                </div>
                                <div class="margin-right">
                                    <button class="button"
                                       :disabled="selectedGame === null || runningMigration" @click="selectDefaultGame(selectedGame! as Game)">
                                       {{ t('translations.pages.gameSelection.actions.setAsDefault') }}
                                    </button>
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
                                        <a @click="changeTab(value)">{{ t(`translations.pages.gameSelection.tabs.${value}`) }}</a>
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
            @change-platform="changePlatform"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Hero } from '../components/all';
import { GameInstanceType, Platform } from '../model/schema/ThunderstoreSchema';
import { GameSelectionViewMode } from '../model/enums/GameSelectionViewMode';
import PlatformSelectionModal from '../components/modals/PlatformSelectionModal.vue';
import { onMounted, ref, provide } from 'vue';
import debounce from 'lodash.debounce';
import { useGameSelectionComposable, gameSelectionKey, PlatformSelectionIntent } from '../components/composables/GameSelectionComposable';
import GameSelectionList from '../components/game-selection/GameSelectionList.vue';
import Game from '../model/game/Game';
import EcosystemUpdateIndicator from '../components/navigation/EcosystemUpdateIndicator.vue';
import { getStore } from '../providers/generic/store/StoreProvider';
import { State } from '../store';
import { useI18n } from 'vue-i18n';

const store = getStore<State>();
const { t } = useI18n();

const visible = ref<boolean>(false);

const gameSelection = useGameSelectionComposable();
provide(gameSelectionKey, gameSelection);

const {
    selectedGame,
    selectedPlatform,
    filterText,
    activeTab,
    viewMode,
    runningMigration,
    platformSelectionIntent,
    markAsSelectedGame,
    changeTab,
    toggleViewMode,
    proceed,
    proceedDefault,
    getLastSelectedPlatform,
    changeLastSelectedPlatform,
    selectPlatformForGame,
    initialize,
} = gameSelection;

const showPlatformModal = ref<boolean>(false);
const debouncedFilter = debounce((value: string) => { filterText.value = value; }, 100);

function getSavedPlatform(game: Game): Platform | undefined {
    const platform = getLastSelectedPlatform(game);
    return game.storePlatformMetadata.some(meta => meta.storePlatform === platform) ? platform : undefined;
}

function needsPlatformPrompt(game: Game): boolean {
    if (game.storePlatformMetadata.length <= 1) {
        return false;
    }
    return viewMode.value === GameSelectionViewMode.LIST || getSavedPlatform(game) === undefined;
}

function showPlatformSelectionModal(game: Game, intent: PlatformSelectionIntent) {
    markAsSelectedGame(game);
    platformSelectionIntent.value = intent;
    selectPlatformForGame(game);
    showPlatformModal.value = true;
}

function selectGame(game: Game) {
    if (needsPlatformPrompt(game)) {
        showPlatformSelectionModal(game, 'SELECT');
        return;
    }
    markAsSelectedGame(game);
    selectedPlatform.value = getSavedPlatform(game) ?? game.storePlatformMetadata[0]!.storePlatform;
    proceed();
}

function selectDefaultGame(game: Game) {
    if (needsPlatformPrompt(game)) {
        showPlatformSelectionModal(game, 'SET_DEFAULT');
        return;
    }
    markAsSelectedGame(game);
    selectedPlatform.value = getSavedPlatform(game) ?? game.storePlatformMetadata[0]!.storePlatform;
    proceedDefault();
}

function changePlatform(game: Game) {
    showPlatformSelectionModal(game, 'CHANGE');
}

async function selectPlatform() {
    showPlatformModal.value = false;
    switch (platformSelectionIntent.value) {
        case 'CHANGE':
            if (selectedGame.value !== null && selectedPlatform.value !== null) {
                await changeLastSelectedPlatform(selectedGame.value as Game, selectedPlatform.value);
            }
            break;
        case 'SET_DEFAULT':
            await proceedDefault();
            break;
        case 'SELECT':
            await proceed();
            break;
    }
}

onMounted(async () => {
    window.app.checkForApplicationUpdates();
    try {
        await initialize();
    } finally {
        visible.value = true;
        void store.dispatch('ecosystemUpdate/updateEcosystemSchema');
    }
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

#game-list-loading {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>
