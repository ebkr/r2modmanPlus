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
                <div class="container">
                    <article class="media">
                        <div class="media-content">
                            <div class="content">
                                <br/>

                                <div class="sticky-top is-shadowless background-bg z-max">
                                    <div>
                                        <div class="card-header-title">
                                            <div class="input-group input-group--flex margin-right">
                                                <label for="local-search" class="non-selectable">Search</label>
                                                <input id="local-search" v-model='filterText' class="input margin-right" type="text" placeholder="Search for a game"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br/>

                                <div>
                                    <div v-for="(game, index) of filteredGameList" :key="`${index}-${game.displayName}-${selectedGame === game}`" class="inline-block margin-right margin-bottom">

                                        <div class="inline">
                                            <div class='card is-shadowless'>
                                                <div class='cursor-pointer'>
                                                    <header class='card-header is-shadowless is-relative'>
                                                        <div class="absolute-full z-top flex">
                                                            <a href="#" class="card-action-overlay rounded">
                                                                <div class="absolute-top-right card-header-title">
                                                                    <p class="text-left title is-5">
                                                                        <i class="fas fa-star text-warning" v-if="favourites.includes(game.internalFolderName)"></i>
                                                                        <i class="far fa-star" v-else></i>
                                                                    </p>
                                                                </div>
                                                                <div class="absolute-top card-header-title">
                                                                    <p class="text-left title is-5">{{ game.displayName }}</p>
                                                                </div>
                                                                <div class="absolute-center">
                                                                    <button class="button is-info" @click="selectGame(game)">Select game</button>
                                                                    <br/><br/>
                                                                    <button class="button">Set as default</button>
                                                                </div>
                                                            </a>
                                                        </div>
                                                        <div class="image is-fullwidth border border--top border--border-box rounded" :class="[{'border--warning': favourites.includes(game.internalFolderName)}]">
                                                            <img :src='`/images/game_selection/${game.gameImage}`' alt='Mod Logo' class="rounded"/>
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
import { StorePlatform } from 'src/model/game/StorePlatform';

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
    private favourites: string[] = ["RiskOfRain2"];

    get filteredGameList() {
        return this.gameList.filter(value => value.displayName.toLowerCase().indexOf(this.filterText.toLowerCase()) >= 0 || this.filterText.trim().length === 0);
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
        if (game.storePlatformMetadata.length > 1) {
            this.showPlatformModal = true;
        } else {
            this.showPlatformModal = false;
            this.proceed();
        }
    }

    private async proceed() {
        if (this.selectedGame !== null && !this.runningMigration) {
            GameManager.activeGame = this.selectedGame;
            PathResolver.MOD_ROOT = path.join(PathResolver.ROOT, this.selectedGame.internalFolderName);
            await FileUtils.ensureDirectory(PathResolver.MOD_ROOT);
            const settings = await ManagerSettings.getSingleton(this.selectedGame);
            await settings.setLastSelectedGame(this.selectedGame);
            await this.$router.replace('/splash');
        }
    }

    created() {
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
        ManagerSettings.getSingleton(GameManager.activeGame).then(settings => {
            const lastSelectedGame = settings.getContext().global.lastSelectedGame;
            if (lastSelectedGame !== null) {
                const game = GameManager.gameList.find(value => value.internalFolderName === lastSelectedGame);
                if (game !== undefined) {
                    this.selectedGame = game;
                }
            }
        });
    }

}
</script>
