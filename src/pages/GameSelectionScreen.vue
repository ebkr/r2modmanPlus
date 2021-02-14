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
                <div>
                    <article class="media">
                        <div class="media-content">
                            <div class="content">
                                <div v-for="(game) of gameList" :key="`${game.displayName}-${selectedGame === game}`">
                                    <a @click="selectGame(game)">
                                        <div class="container">
                                            <div class="border-at-bottom">
                                                <div class="card is-shadowless">
                                                    <p
                                                        :class="['card-header-title', {'has-text-info':selectedGame === game}]"
                                                    >
                                                        {{ game.displayName }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div class="container">
                                <nav class="level">
                                    <div class="level-item">
                                        <a class="button is-info"
                                           :disabled="selectedGame === null && !this.runningMigration" @click="proceed">Select
                                            game</a>
                                    </div>
                                </nav>
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
import Hero from 'components/Hero.vue';
import FolderMigration from 'src/migrations/FolderMigration';
import PathResolver from 'src/r2mm/manager/PathResolver';
import * as path from 'path';
import FileUtils from 'src/utils/FileUtils';

@Component({
    components: {
        Hero
    }
})
export default class GameSelectionScreen extends Vue {

    private runningMigration = false;
    private selectedGame: Game | null = null;

    get gameList(): Game[] {
        return GameManager.gameList;
    }

    private selectGame(game: Game) {
        this.selectedGame = game;
    }

    private proceed() {
        if (this.selectedGame !== null && !this.runningMigration) {
            GameManager.activeGame = this.selectedGame;
            PathResolver.MOD_ROOT = path.join(PathResolver.ROOT, this.selectedGame.displayName);
            FileUtils.ensureDirectory(PathResolver.MOD_ROOT);
            this.$router.replace('/splash');
        }
    }

    created() {
        this.runningMigration = true;
        FolderMigration.needsMigration()
            .then(isMigrationRequired => {
                console.log("Is migration required:", isMigrationRequired);
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
    }

}
</script>
