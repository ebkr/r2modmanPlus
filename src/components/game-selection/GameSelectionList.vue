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
                </div>
            </template>

            <template v-else>
                <div class="content pad--sides pad--top-none">
                    <template v-if="filterText.length === 0">
                        <template v-if="favouriteGameList.length > 0">
                            <GameSelectionSection title="Favourites" :count="favouriteGameList.length" :default-open="true">
                                <div class="game-cards-container">
                                    <div v-for="game of favouriteGameList" :key="game.settingsIdentifier" class="inline-block margin-right">
                                        <GameSelectionCard
                                            :game="game"
                                            :is-favourited="true"
                                            :active-tab="activeTab"
                                            @select="emit('select-game', $event)"
                                            @set-default="emit('set-default-game', $event)"
                                            @toggle-favourite="toggleFavourite($event)"
                                        />
                                    </div>
                                </div>
                            </GameSelectionSection>
                            <hr/>
                        </template>

                        <GameSelectionSection
                            :title="`${capitalize(activeTab)}s`"
                            :count="nonFavouriteGameList.length"
                            :default-open="true"
                        >
                            <div class="game-cards-container">
                                <div v-for="game of nonFavouriteGameList" :key="game.settingsIdentifier" class="inline-block margin-right margin-bottom">
                                    <GameSelectionCard
                                        :game="game"
                                        :is-favourited="false"
                                        :active-tab="activeTab"
                                        @select="emit('select-game', $event)"
                                        @set-default="emit('set-default-game', $event)"
                                        @toggle-favourite="toggleFavourite($event)"
                                    />
                                </div>
                            </div>
                        </GameSelectionSection>
                    </template>
                    <template v-else>
                        <GameSelectionSection
                            title="Search results"
                            :count="mergedGameList.length"
                            :default-open="true"
                        >
                            <div class="game-cards-container">
                                <div v-for="game of mergedGameList" :key="game.settingsIdentifier" class="inline-block margin-right margin-bottom">
                                    <GameSelectionCard
                                        :game="game"
                                        :is-favourited="isFavourited(game)"
                                        :active-tab="activeTab"
                                        :highlight-favourite="true"
                                        @select="emit('select-game', $event)"
                                        @set-default="emit('set-default-game', $event)"
                                        @toggle-favourite="toggleFavourite($event)"
                                    />
                                </div>
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
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.card-header-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
</style>
