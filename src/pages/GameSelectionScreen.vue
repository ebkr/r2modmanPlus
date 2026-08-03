<template>
    <div id="game-list-loading" v-if="!visible">
        <div class="fa-3x">
            <i class="fas fa-circle-notch fa-spin"></i>
        </div>
        <p>{{ t('translations.pages.gameSelection.loading') }}</p>
    </div>
    <div id="game-selection-screen" v-else>
        <EcosystemUpdateIndicator />
        <ModalCard id="select-platform-modal" v-show="showPlatformModal" :is-active="showPlatformModal" @close-modal="() => {showPlatformModal = false;}" class="z-max z-top">
            <template v-slot:header>
                <h2 class='modal-title'>{{ t('translations.pages.gameSelection.platformModal.header') }}</h2>
            </template>
            <template v-slot:body>
                <div v-if="selectedGame !== null">
                    <div v-for="(platform, index) of selectedGame.storePlatformMetadata" :key="`${index}-${platform.storePlatform}`">
                        <input type="radio" :id="`${index}-${platform.storePlatform}`" :value="platform.storePlatform" v-model="selectedPlatform"/>
                        <label :for="`${index}-${platform.storePlatform}`"><span class="margin-right margin-right--half-width"/>{{ t(`translations.platforms.${getPlatformKey(platform.storePlatform)}`) }}</label>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <button class='button is-info' @click='selectPlatform'>
                    {{ t('translations.pages.gameSelection.platformModal.selectAction') }}
                </button>
            </template>
        </ModalCard>
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
import ModalCard from '../components/ModalCard.vue';
import { onMounted, ref, provide } from 'vue';
import debounce from 'lodash.debounce';
import { useGameSelectionComposable, gameSelectionKey } from '../components/composables/GameSelectionComposable';
import GameSelectionList from '../components/game-selection/GameSelectionList.vue';
import Game from '../model/game/Game';
import EcosystemUpdateIndicator from '../components/navigation/EcosystemUpdateIndicator.vue';
import { getStore } from '../providers/generic/store/StoreProvider';
import { State } from '../store';
import { useI18n } from 'vue-i18n';
import EnumResolver from '../model/enums/_EnumResolver';

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

function getPlatformKey(platform: Platform) {
    return EnumResolver.from(Platform, platform);
}

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
