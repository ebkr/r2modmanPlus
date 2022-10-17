<template>
    <div>
        <modal v-show="showPlatformModal === true" :open="showPlatformModal" @close-modal="() => {showPlatformModal = false;}" class="z-max z-top">
            <template v-slot:title>
                <p class='card-header-title'>Which store manages your game?</p>
            </template>
            <template v-slot:body>
                <p>Select a platform:</p>
                <div v-if="selectedGame !== null">
                    <div v-for="(platform, index) of selectedGame.storePlatformMetadata" :key="`${index}-${platform.storePlatform.toString()}`">
                        <input type="radio" :id="`${index}-${platform.storePlatform.toString()}`" :value="platform.storePlatform" v-model="selectedPlatform"/>
                        <label :for="`${index}-${platform.storePlatform.toString()}`"><span class="margin-right margin-right--half-width"/>{{ platform.storePlatform }}</label>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <button class='button is-info' @click='selectPlatform'>
                    Select platform
                </button>
            </template>
        </modal>
        <hero
            title="Game selection"
            subtitle="Which game are you managing your mods for?"
            heroType="is-info"
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
                        <nav class="level mb-2" v-if="viewMode === 'Card'">
                            <div class="level-item">
                                <div class="card-header-title">
                                    <div class="input-group input-group--flex margin-right">
                                        <input id="local-search" v-model='filterText' class="input margin-right" type="text" placeholder="Search for a game"/>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <i class="button fas fa-list" @click="toggleViewMode"></i>
                            </div>
                        </nav>
                        <nav class="level mb-2" v-else-if="viewMode === 'List'">
                            <div class="level-item">
                                <div class="card-header-title">
                                    <div class="input-group input-group--flex margin-right">
                                        <input id="local-search" v-model='filterText' class="input margin-right" type="text" placeholder="Search for a game"/>
                                    </div>
                                </div>
                            </div>
                            <div class="margin-right">
                                <a class="button is-info"
                                   :disabled="selectedGame === null && !this.runningMigration" @click="selectGame(selectedGame)">Select
                                    game</a>
                            </div>
                            <div class="margin-right">
                                <a class="button"
                                   :disabled="selectedGame === null && !this.runningMigration" @click="selectDefaultGame(selectedGame)">Set as default</a>
                            </div>
                            <div>
                                <i class="button fas fa-th-large" @click="toggleViewMode"></i>
                            </div>
                        </nav>
                        <div class="level">
                            <div class="level-item">
                                <div class="tabs">
                                    <ul class="text-center">
                                        <li v-for="(key, index) in gameInstanceTypes" :key="`tab-${key}`"
                                            :class="[{'is-active': activeTab === key}]">
                                            <a @click="changeTab(key)">{{key}}</a>
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
                            <div class="content pad--sides" v-if="viewMode === 'Card'">
                                <div class="game-cards-container">
                                    <div v-for="(game, index) of filteredGameList" :key="`${index}-${game.displayName}-${selectedGame === game}-${isFavourited(game)}`" class="inline-block margin-right margin-bottom">

                                        <div class="inline">
                                            <div class='card is-shadowless'>
                                                <div class='cursor-pointer'>
                                                    <header class='card-header is-shadowless is-relative'>
                                                        <div class="absolute-full z-fab flex">
                                                            <div class="card-action-overlay rounded">
                                                                <div class="absolute-top card-header-title">
                                                                    <p class="text-left title is-5 has-text-white">{{ game.displayName }}</p>
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
                                                                    <button class="button is-info" @click="selectGame(game)" :class="[{'is-disabled': selectedGame === null}]">Select game</button>
                                                                    <br/><br/>
                                                                    <button class="button" @click="selectDefaultGame(game)">Set as default</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="image is-fullwidth border border--border-box rounded" :class="[{'border--warning warning-shadow': isFavourited(game)}]">
                                                            <img :src='getImage(game.gameImage)' alt='Mod Logo' class="rounded"/>
                                                        </div>
                                                    </header>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div class="content" v-if="viewMode === 'List'">
                                <div v-for="(game, index) of filteredGameList" :key="`${index}-${game.displayName}-${selectedGame === game}-${isFavourited(game)}`">
                                    <a @click="selectedGame = game">
                                        <div class="border-at-bottom cursor-pointer">
                                            <div class="card is-shadowless">
                                                <p
                                                    :class="['card-header-title', {'has-text-info':selectedGame === game}]"
                                                >
                                                    <a :id="`${game.settingsIdentifier}-star`" href="#" class="margin-right" @click.prevent="toggleFavourite(game)">
                                                        <i class="fas fa-star text-warning" v-if="favourites.includes(game.settingsIdentifier)"></i>
                                                        <i class="far fa-star" v-else></i>
                                                    </a>
                                                    {{ game.displayName }}
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Game from '../model/game/Game';
import GameManager from '../model/game/GameManager';
import Hero from '../components/Hero.vue';
import PathResolver from '../r2mm/manager/PathResolver';
import * as path from 'path';
import FileUtils from '../utils/FileUtils';
import * as ManagerUtils from '../utils/ManagerUtils';
import ManagerSettings from '../r2mm/manager/ManagerSettings';
import { StorePlatform } from '../model/game/StorePlatform';
import { GameSelectionDisplayMode } from '../model/game/GameSelectionDisplayMode';
import { GameSelectionViewMode } from '../model/enums/GameSelectionViewMode';
import PlatformInterceptorProvider from '../providers/generic/game/platform_interceptor/PlatformInterceptorProvider';
import GameRunnerProvider from '../providers/generic/game/GameRunnerProvider';
import GameDirectoryResolverProvider from '../providers/ror2/game/GameDirectoryResolverProvider';
import R2Error from '../model/errors/R2Error';
import Modal from '../components/Modal.vue';
import { GameInstanceType } from '../model/game/GameInstanceType';
import ConflictManagementProvider from '../providers/generic/installing/ConflictManagementProvider';
import ConflictManagementProviderImpl from '../r2mm/installing/ConflictManagementProviderImpl';
import { PackageLoader } from '../model/installing/PackageLoader';

@Component({
    components: {
        Hero,
        Modal
    }
})
export default class GameSelectionScreen extends Vue {

    private runningMigration = false;
    private selectedGame: Game | null = null;
    private filterText: string = "";
    private showPlatformModal: boolean = false;
    private selectedPlatform: StorePlatform | null = null;
    private favourites: string[] = [];
    private settings: ManagerSettings | undefined;
    private isSettingDefaultPlatform: boolean = false;
    private viewMode = GameSelectionViewMode.LIST;
    private activeTab = GameInstanceType.GAME;

    get gameInstanceTypes(): string[] {
        return Object.values(GameInstanceType);
    }

    get filteredGameList() {
        const displayNameInAdditionalSearch = (game: Game, filterText: string): boolean => {
            return game.additionalSearchStrings.find(value => value.toLowerCase().trim().indexOf(filterText.toLowerCase().trim()) >= 0) !== undefined;
        }
        return this.gameList
            .filter(value => value.displayName.toLowerCase().indexOf(
                this.filterText.toLowerCase()) >= 0
                || this.filterText.trim().length === 0
                || displayNameInAdditionalSearch(value, this.filterText))
            .filter(value => value.displayMode === GameSelectionDisplayMode.VISIBLE)
            .filter(value => value.instanceType === this.activeTab);
    }

    get gameList(): Game[] {
        return GameManager.gameList.sort((a, b) => {
            if (this.favourites.includes(a.settingsIdentifier)) {
                if (this.favourites.includes(b.settingsIdentifier)) {
                    return a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase());
                } else {
                    return -1;
                }
            } else if (this.favourites.includes(b.settingsIdentifier)) {
                return 1;
            }
            return a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase());
        });
    }

    private changeTab(key: string) {
        for (const objKey of Object.keys(GameInstanceType)) {
            if ((GameInstanceType as any)[objKey] === key) {
                this.activeTab = (GameInstanceType as any)[objKey];
            }
        }
    }

    private selectGame(game: Game) {
        this.selectedGame = game;
        this.isSettingDefaultPlatform = false;
        if (game.storePlatformMetadata.length > 1) {
            this.selectedPlatform = null;
            this.showPlatformModal = true;
        } else {
            this.selectedPlatform = game.storePlatformMetadata[0].storePlatform;
            this.showPlatformModal = false;
            this.proceed();
        }
    }

    private selectDefaultGame(game: Game) {
        this.selectedGame = game;
        this.isSettingDefaultPlatform = true;
        if (game.storePlatformMetadata.length > 1) {
            this.showPlatformModal = true;
        } else {
            this.selectedPlatform = game.storePlatformMetadata[0].storePlatform;
            this.showPlatformModal = false;
            this.proceedDefault();
        }
    }

    private selectPlatform() {
        if (this.isSettingDefaultPlatform) {
            this.proceedDefault()
        } else {
            this.proceed();
        }
    }

    private async proceed() {
        if (this.selectedGame !== null && !this.runningMigration && this.selectedPlatform !== null) {
            GameManager.activeGame = this.selectedGame;
            GameManager.activeGame.setActivePlatformByStore(this.selectedPlatform);
            PathResolver.MOD_ROOT = path.join(PathResolver.ROOT, this.selectedGame.internalFolderName);
            await FileUtils.ensureDirectory(PathResolver.MOD_ROOT);

            const settings = await ManagerSettings.getSingleton(this.selectedGame);
            await settings.setLastSelectedGame(this.selectedGame);

            const gameRunner = PlatformInterceptorProvider.instance.getRunnerForPlatform(this.selectedPlatform, this.selectedGame.packageLoader);
            if (gameRunner === undefined) {
                this.$emit("error", new R2Error("No suitable runner found", "Runner is likely not yet implemented.", null));
                return;
            }
            GameRunnerProvider.provide(() => gameRunner);

            const directoryResolver = PlatformInterceptorProvider.instance.getDirectoryResolverForPlatform(this.selectedPlatform);
            if (directoryResolver === undefined) {
                this.$emit("error", new R2Error("No suitable resolver found", "Resolver is likely not yet implemented.", null));
                return;
            }

            GameDirectoryResolverProvider.provide(() => directoryResolver);

            switch (this.selectedGame.packageLoader) {
                case PackageLoader.BEPINEX:
                    ConflictManagementProvider.provide(() => new ConflictManagementProviderImpl());
                    break;
                case PackageLoader.MELON_LOADER:
                    ConflictManagementProvider.provide(() => new ConflictManagementProviderImpl());
                case PackageLoader.NORTHSTAR:
                    ConflictManagementProvider.provide(() => new ConflictManagementProviderImpl());
            }

            await this.$router.replace('/splash');
        }
    }

    private async proceedDefault() {
        if (this.selectedGame !== null && !this.runningMigration && this.selectedPlatform !== null) {
            GameManager.activeGame = this.selectedGame;
            GameManager.activeGame.setActivePlatformByStore(this.selectedPlatform);
            PathResolver.MOD_ROOT = path.join(PathResolver.ROOT, this.selectedGame.internalFolderName);
            await FileUtils.ensureDirectory(PathResolver.MOD_ROOT);
            const settings = await ManagerSettings.getSingleton(this.selectedGame);
            await settings.setLastSelectedGame(this.selectedGame);
            await settings.setDefaultGame(this.selectedGame);
            await settings.setDefaultStorePlatform(this.selectedPlatform);

            const gameRunner = PlatformInterceptorProvider.instance.getRunnerForPlatform(this.selectedPlatform, this.selectedGame.packageLoader);
            if (gameRunner === undefined) {
                this.$emit("error", new R2Error("No suitable runner found", "Runner is likely not yet implemented.", null));
                return;
            }
            GameRunnerProvider.provide(() => gameRunner);

            const directoryResolver = PlatformInterceptorProvider.instance.getDirectoryResolverForPlatform(this.selectedPlatform);
            if (directoryResolver === undefined) {
                this.$emit("error", new R2Error("No suitable resolver found", "Resolver is likely not yet implemented.", null));
                return;
            }
            GameDirectoryResolverProvider.provide(() => directoryResolver);

            switch (this.selectedGame.packageLoader) {
                case PackageLoader.BEPINEX:
                    ConflictManagementProvider.provide(() => new ConflictManagementProviderImpl());
                    break;
                case PackageLoader.MELON_LOADER:
                    ConflictManagementProvider.provide(() => new ConflictManagementProviderImpl());
                case PackageLoader.NORTHSTAR:
                    ConflictManagementProvider.provide(() => new ConflictManagementProviderImpl());
            }

            await this.$router.replace('/splash');
        }
    }

    private toggleFavourite(game: Game) {
        if (this.favourites.includes(game.settingsIdentifier)) {
            this.favourites = this.favourites.filter(value => value !== game.settingsIdentifier)
        } else {
            this.favourites = [...this.favourites, game.settingsIdentifier];
        }
        if (this.settings !== undefined) {
            this.settings.setFavouriteGames(this.favourites);
        }
    }

    isFavourited(game: Game) {
        if (this.settings !== undefined) {
            return this.favourites.includes(game.settingsIdentifier);
        }
    }

    async created() {
        this.runningMigration = true;
        await this.$store.dispatch('checkMigrations');
        this.runningMigration = false;

        this.settings = await ManagerSettings.getSingleton(GameManager.unsetGame());
        const globalSettings = this.settings.getContext().global;
        this.viewMode = globalSettings.gameSelectionViewMode;
        this.favourites = globalSettings.favouriteGames ?? [];
        this.selectedGame = GameManager.findByFolderName(globalSettings.lastSelectedGame) ?? null;

        // Skip game selection view if valid default game & platform are set.
        const {defaultGame, defaultPlatform} = ManagerUtils.getDefaults(this.settings);

        if (defaultGame && defaultPlatform) {
            this.selectedGame = defaultGame;
            this.selectedPlatform = defaultPlatform;
            this.proceed();
        }
    }

    toggleViewMode() {
        if (this.viewMode === "List") {
            this.viewMode = GameSelectionViewMode.CARD;
        } else {
            this.viewMode = GameSelectionViewMode.LIST;
        }
        if (this.settings !== undefined) {
            this.settings.setGameSelectionViewMode(this.viewMode);
        }
    }

    getImage(image: string) {
        return require("../assets/images/game_selection/" + image);
    }

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
</style>
