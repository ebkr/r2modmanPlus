<template>
    <div>
        <hero
            title="Game selection"
            subtitle="Which game are you managing your mods for?"
            heroType="is-info"
        />
        <div class="notification is-warning is-square" v-if="runningMigration">
            <div class="container">
                <p>An update to the manager has occurred and needs to do background work.</p>
                <p>The option to select a game will appear once the work has completed.</p>
            </div>
        </div>
        <div class="columns">
            <div class="column is-full">
                <br/>

                <div class="sticky-top is-shadowless background-bg z-max">
                    <div class="container" v-if="viewMode === 'Card'">
                        <nav class="level">
                            <div class="level-item">
                                <div class="card-header-title">
                                    <div class="input-group input-group--flex margin-right">
                                        <label for="local-search" class="non-selectable">Search</label>
                                        <input id="local-search" v-model='filterText' class="input margin-right" type="text" placeholder="Search for a game"/>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <br/>
                                <i class="button fas fa-list" @click="toggleViewMode"></i>
                            </div>
                        </nav>
                    </div>
                    <div class="container" v-else-if="viewMode === 'List'">
                        <nav class="level">
                            <div class="level-item">
                                <div class="card-header-title">
                                    <div class="input-group input-group--flex margin-right">
                                        <label for="local-search" class="non-selectable">Search</label>
                                        <input id="local-search" v-model='filterText' class="input margin-right" type="text" placeholder="Search for a game"/>
                                    </div>
                                </div>
                            </div>
                            <div class="margin-right">
                                <br/>
                                <a class="button is-info"
                                   :disabled="selectedGame === null && !this.runningMigration" @click="selectGame(selectedGame)">Select
                                    game</a>
                            </div>
                            <div class="margin-right">
                                <br/>
                                <a class="button"
                                   :disabled="selectedGame === null && !this.runningMigration" @click="selectDefaultGame(selectedGame)">Set as default</a>
                            </div>
                            <div>
                                <br/>
                                <i class="button fas fa-th-large" @click="toggleViewMode"></i>
                            </div>
                        </nav>
                    </div>
                </div>
                <div class="container">
                    <article class="media">
                        <div class="media-content">
                            <div class="content pad--sides" v-if="viewMode === 'Card'">
                                <br/>

                                <div>
                                    <div v-for="(game, index) of filteredGameList" :key="`${index}-${game.displayName}-${selectedGame === game}-${isFavourited(game)}`" class="inline-block margin-right margin-bottom">

                                        <div class="inline">
                                            <div class='card is-shadowless'>
                                                <div class='cursor-pointer'>
                                                    <header class='card-header is-shadowless is-relative'>
                                                        <div class="absolute-full z-top flex">
                                                            <div class="card-action-overlay rounded">
                                                                <div class="absolute-top card-header-title">
                                                                    <p class="text-left title is-5">{{ game.displayName }}</p>
                                                                </div>
                                                                <div class="absolute-top-right card-header-title">
                                                                    <p class="text-left title is-5">
                                                                        <a :id="`${game.internalFolderName}-star`" href="#" @click.prevent="toggleFavourite(game)">
                                                                            <i class="fas fa-star text-warning" v-if="favourites.includes(game.internalFolderName)"></i>
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
                                                            <img :src='`/images/game_selection/${game.gameImage}`' alt='Mod Logo' class="rounded"/>
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
                                                    <a :id="`${game.internalFolderName}-star`" href="#" class="margin-right" @click.prevent="toggleFavourite(game)">
                                                        <i class="fas fa-star text-warning" v-if="favourites.includes(game.internalFolderName)"></i>
                                                        <i class="far fa-star" v-else></i>
                                                    </a>
                                                    {{ game.displayName }}
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <br/>
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
import FolderMigration from '../migrations/FolderMigration';
import PathResolver from '../r2mm/manager/PathResolver';
import * as path from 'path';
import FileUtils from '../utils/FileUtils';
import ManagerSettings from '../r2mm/manager/ManagerSettings';
import { StorePlatform } from '../model/game/StorePlatform';
import { GameSelectionDisplayMode } from '../model/game/GameSelectionDisplayMode';
import { GameSelectionViewMode } from '../model/enums/GameSelectionViewMode';

@Component({
    components: {
        Hero
    }
})
export default class GameSelectionScreen extends Vue {

    private runningMigration = false;
    private selectedGame: Game | null = null;
    private filterText: string = "";
    private showPlatformModal: boolean = false;
    private selectedPlatform: StorePlatform | undefined;
    private favourites: string[] = [];
    private settings: ManagerSettings | undefined;
    private isSettingDefaultPlatform: boolean = false;
    private viewMode = GameSelectionViewMode.LIST;

    get filteredGameList() {
        return this.gameList
            .filter(value => value.displayName.toLowerCase().indexOf(this.filterText.toLowerCase()) >= 0 || this.filterText.trim().length === 0)
            .filter(value => value.displayMode === GameSelectionDisplayMode.VISIBLE);
    }

    get gameList(): Game[] {
        return GameManager.gameList.sort((a, b) => {
            if (this.favourites.includes(a.internalFolderName)) {
                if (this.favourites.includes(b.internalFolderName)) {
                    return a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase());
                } else {
                    return -1;
                }
            } else if (this.favourites.includes(b.internalFolderName)) {
                return 1;
            }
            return a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase());
        });
    }

    private selectGame(game: Game) {
        this.selectedGame = game;
        this.isSettingDefaultPlatform = false;
        if (game.storePlatformMetadata.length > 1) {
            this.selectedPlatform = undefined;
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
        if (this.selectedGame !== null && !this.runningMigration && this.selectedPlatform !== undefined) {
            GameManager.activeGame = this.selectedGame;
            GameManager.activeGame.setActivePlatformByStore(this.selectedPlatform);
            PathResolver.MOD_ROOT = path.join(PathResolver.ROOT, this.selectedGame.internalFolderName);
            await FileUtils.ensureDirectory(PathResolver.MOD_ROOT);
            const settings = await ManagerSettings.getSingleton(this.selectedGame);
            await settings.setLastSelectedGame(this.selectedGame);
            await this.$router.replace('/splash');
        }
    }

    private async proceedDefault() {
        if (this.selectedGame !== null && !this.runningMigration && this.selectedPlatform !== undefined) {
            GameManager.activeGame = this.selectedGame;
            GameManager.activeGame.setActivePlatformByStore(this.selectedPlatform);
            PathResolver.MOD_ROOT = path.join(PathResolver.ROOT, this.selectedGame.internalFolderName);
            await FileUtils.ensureDirectory(PathResolver.MOD_ROOT);
            const settings = await ManagerSettings.getSingleton(this.selectedGame);
            await settings.setLastSelectedGame(this.selectedGame);
            await settings.setDefaultGame(this.selectedGame);
            await settings.setDefaultStorePlatform(this.selectedPlatform);
            await this.$router.replace('/splash');
        }
    }

    private toggleFavourite(game: Game) {
        if (this.favourites.includes(game.internalFolderName)) {
            this.favourites = this.favourites.filter(value => value !== game.internalFolderName)
        } else {
            this.favourites = [...this.favourites, game.internalFolderName];
        }
        if (this.settings !== undefined) {
            this.settings.setFavouriteGames(this.favourites);
        }
    }

    isFavourited(game: Game) {
        if (this.settings !== undefined) {
            return this.favourites.includes(game.internalFolderName);
        }
    }

    created() {
        const self = this;
        this.runningMigration = true;
        FolderMigration.needsMigration()
            .then(isMigrationRequired => {
                if (!isMigrationRequired) {
                    this.runningMigration = false;
                } else {
                    return FolderMigration.runMigration();
                }
            })
            .then(() => {
                this.runningMigration = false;
            })
            .catch((e) => {
                console.log(e);
                this.runningMigration = false;
            })
        .finally(() => {
            ManagerSettings.getSingleton(GameManager.unsetGame()).then(settings => {
                const lastSelectedGame = settings.getContext().global.lastSelectedGame;
                const savedViewMode = settings.getContext().global.gameSelectionViewMode;
                switch (savedViewMode) {
                    case "List": this.viewMode = GameSelectionViewMode.LIST; break;
                    case "Card":
                    case undefined:
                        this.viewMode = GameSelectionViewMode.CARD;
                        break;
                }
                if (lastSelectedGame !== null) {
                    const game = GameManager.gameList.find(value => value.internalFolderName === lastSelectedGame);
                    if (game !== undefined) {
                        this.selectedGame = game;
                    }
                }
            });
            ManagerSettings.getSingleton(GameManager.unsetGame()).then(value => {
                this.settings = value;
                this.favourites = value.getContext().global.favouriteGames || [];
                if (value.getContext().global.defaultGame !== undefined) {
                    if (value.getContext().global.defaultStore !== undefined) {
                        const game = GameManager.gameList
                            .find(value1 => value1.internalFolderName === value.getContext().global.defaultGame)!;

                        const platform = game.storePlatformMetadata.find(value1 => value1.storePlatform === value.getContext().global.defaultStore)!;

                        this.selectedGame = game;
                        this.selectedPlatform = platform.storePlatform;

                        this.proceed();
                        return;
                    }
                }
            });
        })
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

}
</script>
