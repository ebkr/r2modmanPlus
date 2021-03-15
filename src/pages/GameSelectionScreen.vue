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

                                <div class="text-center">
                                    <div v-for="(game, index) of filteredGameList" :key="`${index}-${game.displayName}-${selectedGame === game}`" class="inline-block margin-right margin-bottom">

                                        <div class="border-at-bottom inline" @click="selectGame(game)">
                                            <div class='card is-shadowless'>
                                                <div class='cursor-pointer'>
                                                    <header class='card-header is-shadowless is-relative'>
                                                        <div class="absolute-full z-top flex">
                                                            <div class="card-action-overlay rounded">
                                                                <div class="absolute-top" :class="['card-header-title']">
                                                                    <p class="text-left title is-5">{{ game.displayName }}</p>
                                                                </div>
                                                                <div class="absolute-center" v-if="selectedGame === game && flow === 2">
                                                                    <div v-for="(platformMetadata) of game.storePlatformMetadata"
                                                                         :key="platformMetadata.storePlatform.toString()"
                                                                         class="text-left">
                                                                        <input :id="`${game.internalFolderName}-platform-${platformMetadata.storePlatform.toString()}`"
                                                                               name="platform" class="radio" type="radio"/>
                                                                        <label :for="`${game.internalFolderName}-platform-${platformMetadata.storePlatform.toString()}`">
                                                                            {{ platformMetadata.storePlatform }}
                                                                        </label>
                                                                    </div>
                                                                    <br/>
                                                                    <button class="button is-info">Continue</button>
                                                                    <br/><br/>
                                                                    <button class="button">Go back</button>
                                                                </div>
                                                                <div class="absolute-center" v-else>
                                                                    <button class="button is-info">Select game</button>
                                                                    <br/><br/>
                                                                    <button class="button">Set as default</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="image is-fullwidth">
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

@Component({
    components: {
        Hero
    }
})
export default class GameSelectionScreen extends Vue {

    private runningMigration = false;
    private selectedGame: Game | null = null;
    private filterText: string = "";
    private flow: int = 1;

    get filteredGameList() {
        return this.gameList.filter(value => value.displayName.toLowerCase().indexOf(this.filterText.toLowerCase()) >= 0 || this.filterText.trim().length === 0);
    }

    get gameList(): Game[] {
        return GameManager.gameList;
    }

    private selectGame(game: Game) {
        this.selectedGame = game;
        if (game.storePlatformMetadata.length > 1) {
            this.flow = 2;
        } else {
            this.flow = 1;
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
