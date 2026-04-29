<template>
    <article class="media">
        <div class="media-content">

            <template v-if="viewMode === GameSelectionViewMode.LIST">
                <div class="content">
                    <GameSelectionListItem
                        v-for="game of favouriteGameList"
                        :key="game.settingsIdentifier"
                        :game="game"
                        :is-selected="isGameSelected(game)"
                        :is-favourited="true"
                        @click="markAsSelectedGame(game)"
                        @toggle-favourite="toggleFavourite(game)"
                    />
                    <GameSelectionListItem
                        v-for="game of nonFavouriteGameList"
                        :key="game.settingsIdentifier"
                        :game="game"
                        :is-selected="isGameSelected(game)"
                        :is-favourited="false"
                        @click="markAsSelectedGame(game)"
                        @toggle-favourite="toggleFavourite(game)"
                    />
                    <GameSelectionListItem
                        v-for="game of hiddenGameList"
                        :key="game.settingsIdentifier"
                        :game="game"
                        :is-selected="isGameSelected(game)"
                        :is-favourited="isFavourited(game)"
                        :mark-hidden="true"
                        @click="markAsSelectedGame(game)"
                        @toggle-favourite="toggleFavourite(game)"
                    />
                </div>
            </template>

            <template v-else>
                <div class="content pad--sides pad--top-none">
                    <template v-if="filterText.length === 0">
                        <template v-if="favouriteGameList.length > 0">
                            <GameSelectionSection title="Favourites" :count="favouriteGameList.length" :default-open="true">
                                <div class="game-cards-container">
                                    <GameSelectionCard
                                        v-for="game of favouriteGameList"
                                        :key="game.settingsIdentifier"
                                        :game="game"
                                        :is-favourited="true"
                                        :active-tab="activeTab"
                                        @select="emit('select-game', $event)"
                                        @set-default="emit('set-default-game', $event)"
                                        @toggle-favourite="toggleFavourite($event)"
                                    />
                                </div>
                            </GameSelectionSection>
                        </template>


                        <template v-if="nonFavouriteGameList.length > 0">
                            <hr v-if="favouriteGameList.length > 0"/>
                            <GameSelectionSection
                                :title="`${capitalize(activeTab)}s`"
                                :count="nonFavouriteGameList.length"
                                :default-open="true"
                            >
                                <div class="game-cards-container">
                                    <GameSelectionCard
                                        v-for="game of nonFavouriteGameList"
                                        :key="game.settingsIdentifier"
                                        :game="game"
                                        :is-selected="isGameSelected(game)"
                                        :is-favourited="false"
                                        :active-tab="activeTab"
                                        @select="emit('select-game', $event)"
                                        @set-default="emit('set-default-game', $event)"
                                        @toggle-favourite="toggleFavourite($event)"
                                    />
                                </div>
                            </GameSelectionSection>
                        </template>
                    </template>
                    <template v-else>
                        <GameSelectionSection
                            title="Search results"
                            :count="mergedGameList.length"
                            :default-open="true"
                            v-if="mergedGameList.length > 0"
                        >
                            <div class="game-cards-container">
                                <GameSelectionCard
                                    v-for="game of mergedGameList"
                                    :key="game.settingsIdentifier"
                                    :game="game"
                                    :is-favourited="isFavourited(game)"
                                    :active-tab="activeTab"
                                    @select="emit('select-game', $event)"
                                    @set-default="emit('set-default-game', $event)"
                                    @toggle-favourite="toggleFavourite($event)"
                                />
                            </div>
                        </GameSelectionSection>
                    </template>

                    <template v-if="hiddenGameList.length > 0">
                        <hr v-if="favouriteGameList.length > 0 || nonFavouriteGameList.length > 0" />
                        <GameSelectionSection
                            title="Hidden games"
                            :count="hiddenGameList.length"
                        >
                            <div class="notification is-warning">
                                These games are no longer supported.
                            </div>
                            <div class="game-cards-container">
                                <GameSelectionCard
                                    v-for="game of hiddenGameList"
                                    :key="game.settingsIdentifier"
                                    :game="game"
                                    :is-selected="isGameSelected(game)"
                                    :is-favourited="isFavourited(game)"
                                    :active-tab="activeTab"
                                    :highlight-favourite="true"
                                    @select="emit('select-game', $event)"
                                    @set-default="emit('set-default-game', $event)"
                                    @toggle-favourite="toggleFavourite($event)"
                                />
                            </div>
                        </GameSelectionSection>
                    </template>
                </div>
            </template>

        </div>
    </article>
</template>

<script lang="ts" setup>
import { inject, computed } from 'vue';
import { GameSelectionViewMode } from '../../model/enums/GameSelectionViewMode';
import { gameSelectionKey } from '../composables/GameSelectionComposable';
import GameSelectionCard from './GameSelectionCard.vue';
import GameSelectionListItem from './GameSelectionListItem.vue';
import GameSelectionSection from './GameSelectionSection.vue';
import Game from '../../model/game/Game';
import { capitalize } from '../../utils/StringUtils';

const emit = defineEmits<{
    'select-game': [game: Game];
    'set-default-game': [game: Game];
}>();

const mergedGameList = computed(() => {
    const favourites = favouriteGameList.value;
    const others = nonFavouriteGameList.value;
    return [...favourites, ...others];
})

const {
    hiddenGameList,
    favouriteGameList,
    nonFavouriteGameList,
    activeTab,
    viewMode,
    isGameSelected,
    markAsSelectedGame,
    toggleFavourite,
    filterText,
    isFavourited,
} = inject(gameSelectionKey)!;
</script>

<style lang="scss" scoped>
.game-cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(188px, 1fr));
    gap: 1rem;
}

.card-header-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

h3 {
    margin-bottom: 0 !important;
}
</style>
