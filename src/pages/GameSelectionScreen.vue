<template>
    <div id="game-selection-screen">
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
                        <nav class="level mb-2" v-if="viewMode === 'List'">
                            <div class="level-item">
                                <div class="card-header-title">
                                    <div class="input-group input-group--flex margin-right">
                                        <input
                                            v-model="filterText"
                                            id="game-selection-list-search"
                                            class="input margin-right"
                                            type="text"
                                            placeholder="Search for a game"
                                            autocomplete="off"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="margin-right">
                                <button class="button is-info"
                                   :disabled="!isAnyGameSelected() && !runningMigration" @click="selectGame(selectedGame)">Select {{ activeTab.toLowerCase() }}</button>
                            </div>
                            <div class="margin-right">
                                <button class="button"
                                   :disabled="!isAnyGameSelected() && !runningMigration" @click="selectDefaultGame(selectedGame)">Set as default</button>
                            </div>
                            <div>
                                <i class="button fas fa-th-large" @click="toggleViewMode"></i>
                            </div>
                        </nav>
                        <nav class="level mb-0" v-else>
                            <div class="level-item">
                                <div class="card-header-title">
                                    <div class="input-group input-group--flex margin-right">
                                        <input
                                            v-model="filterText"
                                            id="game-selection-cards-search"
                                            class="input margin-right"
                                            type="text"
                                            placeholder="Search for a game"
                                            autocomplete="off"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <i class="button fas fa-list" @click="toggleViewMode"></i>
                            </div>
                        </nav>
                        <div class="level mb-2">
                            <div class="level-left" style="padding-left: 1rem">
                                <div class="level-item">
                                    <button
                                        :class="['button is-small', {'is-success': showOnlyInstalled}]"
                                        :disabled="isScanning"
                                        @click="showOnlyInstalled = !showOnlyInstalled"
                                    >
                                        <span v-if="isScanning">Scanning...</span>
                                        <span v-else>Installed only</span>
                                    </button>
                                </div>
                                <div class="level-item" v-if="!isScanning && installedAppIds.size > 0">
                                    <span class="is-size-7 has-text-grey">{{ installedAppIds.size }} app{{ installedAppIds.size !== 1 ? 's' : '' }} detected</span>
                                </div>
                                <div class="level-item" v-if="scanError">
                                    <span class="is-size-7 has-text-danger">{{ scanError }}</span>
                                </div>
                            </div>
                            <div class="level-right">
                                <div class="level-item">
                                    <button :class="['button is-small', {'is-warning': usingCustomPath}]" @click="showCustomPathInput = !showCustomPathInput">
                                        Steam Library Path
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="level mb-2" v-if="showCustomPathInput">
                            <div class="level-left" style="padding-left: 1rem; flex: 1; min-width: 0">
                                <div class="level-item" style="width: 100%">
                                    <div class="input-group input-group--flex" style="width: 100%">
                                        <input
                                            v-model="customScanPath"
                                            class="input"
                                            type="text"
                                            placeholder="Path to Steam folder"
                                            autocomplete="off"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="level-right" style="margin-left: 0.25rem">
                                <div class="level-item">
                                    <div style="display: flex; gap: 0.25rem">
                                        <button class="button is-info" :disabled="isScanning" @click="rescan(customScanPath)">Scan</button>
                                        <button class="button" :disabled="isScanning" @click="rescan()">Reset to default</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level">
                            <div class="level-item">
                                <div class="tabs">
                                    <ul class="text-center">
                                        <li v-for="(value) in GameInstanceType" :key="`tab-${value}`"
                                            :class="[{'is-active': activeTab === value}]">
                                            <a @click="changeTab(value)">{{capitalize(value)}}</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <article class="media">
                        <div class="media-content">
                            <div class="content" v-if="viewMode === 'List'">
                                <div v-for="(game, index) of filteredGameList" :key="`${index}-${game.displayName}-${isGameSelected(game)}-${isFavourited(game)}`">
                                    <a @click="markAsSelectedGame(game)">
                                        <div class="border-at-bottom cursor-pointer">
                                            <div class="card is-shadowless">
                                                <p
                                                    :class="['card-header-title', {'has-text-info':isGameSelected(game)}]"
                                                >
                                                    <a :id="`${game.settingsIdentifier}-star`" href="#" class="margin-right" @click.prevent="toggleFavourite(game)">
                                                        <i class="fas fa-star text-warning" v-if="favourites.includes(game.settingsIdentifier)"></i>
                                                        <i class="far fa-star" v-else></i>
                                                    </a>
                                                    {{ game.displayName }}
                                                    <span v-if="isInstalledInSteam(game)" class="tag is-success is-small margin-left">Installed</span>
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div class="content pad--sides" v-else>
                                <div class="game-cards-container">
                                    <div v-for="(game, index) of filteredGameList" :key="`${index}-${game.displayName}-${isGameSelected(game)}-${isFavourited(game)}`" class="inline-block margin-right margin-bottom">

                                        <div class="inline">
                                            <div class='card is-shadowless'>
                                                <div class='cursor-pointer'>
                                                    <header class='card-header is-shadowless is-relative has-background-black'>
                                                        <div class="absolute-full z-fab flex">
                                                            <div class="card-action-overlay rounded">
                                                                <div class="absolute-top card-header-title">
                                                                    <p class="text-left title is-5 has-text-white">{{ game.displayName }}</p>
                                                                </div>
                                                                <div v-if="isInstalledInSteam(game)" style="position: absolute; bottom: 0.75rem; right: 0.75rem">
                                                                    <span class="tag is-success is-small">Installed</span>
                                                                </div>
                                                                <div class="absolute-top-right card-header-title">
                                                                    <p class="text-left title is-5">
                                                                        <a :id="`${game.settingsIdentifier}-star`" href="#" @click.prevent="toggleFavourite(game)">
                                                                            <i class="fas fa-star text-warning" v-if="favourites.includes(game.settingsIdentifier)"></i>
                                                                            <i class="far fa-star" v-else></i>
                                                                        </a>
                                                                    </p>
                                                                </div>
                                                                <div class="absolute-center text-center">
                                                                    <button class="button is-info" @click="selectGame(game)" :class="[{'is-disabled': selectedGame === null}]">Select
                                                                        {{ activeTab.toLowerCase() }}</button>
                                                                    <br/><br/>
                                                                    <button class="button" @click="selectDefaultGame(game)">Set as default</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="image is-fullwidth border border--border-box rounded" :class="[{'border--warning warning-shadow': isFavourited(game)}]">
                                                            <template v-if="activeTab === GameInstanceType.GAME">
                                                                <img :src='getImageHref(`/images/game_selection/${game.gameImage}`)' alt='Mod Logo' class="rounded game-thumbnail"/>
                                                            </template>
                                                            <template v-else>
                                                                <h2 style="height: 250px; width: 188px" class="text-center pad pad--sides">{{ game.displayName }}</h2>
                                                            </template>
                                                        </div>
                                                    </header>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </article>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Game from '../model/game/Game';
import GameManager from '../model/game/GameManager';
import { Hero } from '../components/all';
import * as ManagerUtils from '../utils/ManagerUtils';
import ManagerSettings from '../r2mm/manager/ManagerSettings';
import { GameSelectionViewMode } from '../model/enums/GameSelectionViewMode';
import R2Error from '../model/errors/R2Error';
import { GameInstanceType, GameSelectionDisplayMode, Platform } from '../model/schema/ThunderstoreSchema';
import ProviderUtils from '../providers/generic/ProviderUtils';
import ModalCard from '../components/ModalCard.vue';
import { computed, onMounted, reactive, ref } from 'vue';
import { getStore } from '../providers/generic/store/StoreProvider';
import { State } from '../store';
import { useRouter } from 'vue-router';
import ProtocolProvider from '../providers/generic/protocol/ProtocolProvider';
import { getDefaultSteamPath, getInstalledSteamAppIds } from '../utils/SteamLibraryScanner';

const store = getStore<State>();
const router = useRouter();

const runningMigration = ref<boolean>(false);
const selectedGame = ref<Game | null>(null);
const filterText = ref<string>("");
const showPlatformModal = ref<boolean>(false);
const selectedPlatform = ref<Platform | null>(null);
const favourites = ref<string[]>([]);
const settings = ref<ManagerSettings | undefined>(undefined);
const isSettingDefaultPlatform = ref<boolean>(false);
const viewMode = ref<GameSelectionViewMode>(GameSelectionViewMode.LIST);
const activeTab = ref<GameInstanceType>(GameInstanceType.GAME);
const gameImages = reactive({});

const installedAppIds = ref<Set<string>>(new Set());
const isScanning = ref<boolean>(false);
const showOnlyInstalled = ref<boolean>(false);
const customScanPath = ref<string>('');
const scanError = ref<string | null>(null);
const showCustomPathInput = ref<boolean>(false);
const usingCustomPath = ref<boolean>(false);

function isInstalledInSteam(game: Game): boolean {
    return game.storePlatformMetadata
        .filter(m => m.storePlatform === Platform.STEAM || m.storePlatform === Platform.STEAM_DIRECT)
        .some(m => m.storeIdentifier != null && installedAppIds.value.has(m.storeIdentifier));
}

async function rescan(customPath?: string) {
    isScanning.value = true;
    scanError.value = null;
    const isCustom = !!(customPath && customPath.trim().length > 0);
    if (!isCustom) {
        customScanPath.value = (await getDefaultSteamPath()) ?? '';
    }
    try {
        installedAppIds.value = await getInstalledSteamAppIds(isCustom ? customPath : undefined);
        usingCustomPath.value = isCustom;
    } catch {
        scanError.value = 'Could not read Steam library';
    } finally {
        isScanning.value = false;
    }
}

const filteredGameList = computed(() => {
    const displayNameInAdditionalSearch = (game: Game, filterText: string): boolean => {
        return game.additionalSearchStrings.find(value => value.toLowerCase().trim().indexOf(filterText.toLowerCase().trim()) >= 0) !== undefined;
    }
    return gameList.value
        .filter(value => value.displayName.toLowerCase().indexOf(
            filterText.value.toLowerCase()) >= 0
            || filterText.value.trim().length === 0
            || displayNameInAdditionalSearch(value, filterText.value))
        .filter(value => value.displayMode === GameSelectionDisplayMode.VISIBLE)
        .filter(value => value.instanceType === activeTab.value)
        .filter(value => !showOnlyInstalled.value || isInstalledInSteam(value));
});

const gameList = computed<Game[]>(() => {
    return GameManager.gameList.sort((a, b) => {
        const aFav = favourites.value.includes(a.settingsIdentifier);
        const bFav = favourites.value.includes(b.settingsIdentifier);
        if (aFav !== bFav) return aFav ? -1 : 1;

        const aInstalled = isInstalledInSteam(a);
        const bInstalled = isInstalledInSteam(b);
        if (aInstalled !== bInstalled) return aInstalled ? -1 : 1;

        return a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase());
    });
});

function getImageHref(image: string) {
    return ProtocolProvider.getPublicAssetUrl(image);
}

function changeTab(tab: GameInstanceType) {
    activeTab.value = tab;
}

function markAsSelectedGame(game: Game) {
    selectedGame.value = game;
}

function selectGame(game: Game) {
    selectedGame.value = game;
    isSettingDefaultPlatform.value = false;
    if (game.storePlatformMetadata.length > 1) {
        ManagerSettings.getSingleton(game)
            .then(settings => settings.getLastSelectedPlatform())
            .then(platform => {
                if (platform) {
                    selectedPlatform.value = Platform[platform]
                } else {
                    selectedPlatform.value = null;
                }
            });
        showPlatformModal.value = true;
    } else {
        selectedPlatform.value = game.storePlatformMetadata[0]!.storePlatform;
        showPlatformModal.value = false;
        proceed();
    }
}

function selectDefaultGame(game: Game) {
    selectedGame.value = game;
    isSettingDefaultPlatform.value = true;
    if (game.storePlatformMetadata.length > 1) {
        showPlatformModal.value = true;
    } else {
        selectedPlatform.value = game.storePlatformMetadata[0]!.storePlatform;
        showPlatformModal.value = false;
        proceedDefault();
    }
}

const platformLabels = {
    [Platform.STEAM]: "Steam",
    [Platform.STEAM_DIRECT]: "Steam",
    [Platform.EPIC_GAMES_STORE]: "Epic Games Store",
    [Platform.OCULUS_STORE]: "Oculus Store",
    [Platform.ORIGIN]: "Origin / EA Desktop",
    [Platform.XBOX_GAME_PASS]: "Xbox Game Pass",
    [Platform.OTHER]: "Other"
}

function selectPlatform() {
    if (isSettingDefaultPlatform.value) {
        proceedDefault()
    } else {
        proceed();
    }
}

async function proceed() {
    if (runningMigration.value || selectedGame.value === null || selectedPlatform.value === null) {
        return;
    }

    try {
        ProviderUtils.setupGameProviders(selectedGame.value, selectedPlatform.value);
    } catch (error) {
        if (error instanceof R2Error) {
            store.commit('error/handleError', error);
            return;
        }

        throw error;
    }

    const settings = await ManagerSettings.getSingleton(selectedGame.value);
    await settings.setLastSelectedGame(selectedGame.value);
    await settings.setLastSelectedPlatform(selectedPlatform.value);
    await GameManager.activate(selectedGame.value, selectedPlatform.value);
    await store.dispatch("setActiveGame", selectedGame.value);

    await router.push({name: "splash"});
}

async function proceedDefault() {
    if (runningMigration.value || selectedGame.value === null || selectedPlatform.value === null) {
        return;
    }

    const settings = await ManagerSettings.getSingleton(selectedGame.value);
    await settings.setDefaultGame(selectedGame.value);
    await settings.setDefaultStorePlatform(selectedPlatform.value);

    return proceed();
}

function toggleFavourite(game: Game) {
    if (favourites.value.includes(game.settingsIdentifier)) {
        favourites.value = favourites.value.filter(value => value !== game.settingsIdentifier)
    } else {
        favourites.value = [...favourites.value, game.settingsIdentifier];
    }
    if (settings.value !== undefined) {
        settings.value.setFavouriteGames(favourites.value);
    }
}

function isFavourited(game: Game) {
    if (settings.value !== undefined) {
        return favourites.value.includes(game.settingsIdentifier);
    }
}

function isGameSelected(game: Game) {
    return selectedGame.value !== null && selectedGame.value.internalFolderName === game.internalFolderName;
}

function isAnyGameSelected() {
    return selectedGame.value !== null;
}

onMounted(async () => {

    // Check for updates in the background
    window.app.checkForApplicationUpdates()

    runningMigration.value = true;
    await store.dispatch('checkMigrations');
    runningMigration.value = false;

    await store.dispatch('resetLocalState');

    settings.value = await ManagerSettings.getSingleton(GameManager.defaultGame);
    const globalSettings = settings.value.getContext().global;
    favourites.value = globalSettings.favouriteGames || [];
    selectedGame.value = GameManager.findByFolderName(globalSettings.lastSelectedGame) || null;

    rescan();

    switch(globalSettings.gameSelectionViewMode) {
        case GameSelectionViewMode.LIST:
        case GameSelectionViewMode.CARD:
            viewMode.value = globalSettings.gameSelectionViewMode;
            break;
        default:
            viewMode.value = GameSelectionViewMode.CARD;
    }

    // Skip game selection view if valid default game & platform are set.
    const {defaultGame, defaultPlatform} = ManagerUtils.getDefaults(settings.value);

    if (defaultGame && defaultPlatform) {
        selectedGame.value = defaultGame;
        selectedPlatform.value = defaultPlatform;
        proceed();
    }
})

function toggleViewMode() {
    if (viewMode.value === GameSelectionViewMode.LIST) {
        viewMode.value = GameSelectionViewMode.CARD;
    } else {
        viewMode.value = GameSelectionViewMode.LIST;
    }
    if (settings.value !== undefined) {
        settings.value.setGameSelectionViewMode(viewMode.value);
    }
}

function capitalize(str: string) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
}
</script>


<style lang="scss" scoped>
.game-cards-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
}
.mb-2 {
    margin-bottom: 0.5rem !important;
}
.game-thumbnail {
    width: 188px;
    height: 250px;
    object-fit: cover;
}

#game-selection-screen {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
