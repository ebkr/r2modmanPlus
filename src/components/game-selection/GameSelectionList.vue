<template>
    <article class="media">
        <div class="media-content">
            <div id="no-content" class="content" v-if="resultCount === 0">
                <div>
                    <div>
                        <i class="fas fa-gamepad fa-4x"></i>
                        <br/>
                        <h3 class="title is-4">{{ t(`translations.pages.gameSelection.noResults.empty.${activeTab}`, { filterText }) }}</h3>
                        <p class="subtitle">{{ t('translations.pages.gameSelection.noResults.suggestion') }}</p>
                        <button class="button margin-top icon-button" @click.prevent.stop="requestNewGame">
                            <span>{{ t(`translations.pages.gameSelection.actions.request.${activeTab}`) }}</span>
                            <i class="margin-left--half-width fas fa-external-link-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
            <template v-if="viewMode === GameSelectionViewMode.LIST">
                <div id="list-content" class="content">
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
                    <div class="request-game margin-bottom" v-if="resultCount > 0">
                        <h3 class="title is-5">{{ t('translations.pages.gameSelection.noResults.title') }}</h3>
                        <button class="button margin-top" @click.prevent.stop="requestNewGame">
                            <span>{{ t(`translations.pages.gameSelection.actions.request.${activeTab}`) }}</span>
                            <i class="margin-left--half-width fas fa-external-link-alt"></i>
                        </button>
                    </div>
                </div>
            </template>

            <template v-else>
                <div class="content pad--sides pad--top-none">
                    <template v-if="filterText.length === 0">
                        <template v-if="favouriteGameList.length > 0">
                            <GameSelectionSection :title="t('translations.pages.gameSelection.cardView.sections.favourites')" :count="favouriteGameList.length" :default-open="true">
                                <div class="game-cards-container">
                                    <GameSelectionCard
                                        v-for="game of favouriteGameList"
                                        :key="game.settingsIdentifier"
                                        :game="game"
                                        :is-favourited="true"
                                        :active-tab="activeTab"
                                        :is-new="newGameSet.has(game)"
                                        @select="emit('select-game', $event)"
                                        @set-default="emit('set-default-game', $event)"
                                        @toggle-favourite="toggleFavourite($event)"
                                    />
                                </div>
                            </GameSelectionSection>
                        </template>

                        <template v-if="newGameSet.size > 0">
                            <hr v-if="favouriteGameList.length > 0"/>
                            <GameSelectionSection
                                :title="t('translations.pages.gameSelection.cardView.sections.newlyAdded.' + activeTab + 's')"
                                :count="newGameSet.size"
                                :default-open="true"
                            >
                                <div class="game-cards-container">
                                    <GameSelectionCard
                                        v-for="game of newGameSet"
                                        :key="game.settingsIdentifier"
                                        :game="game"
                                        :is-selected="isGameSelected(game)"
                                        :is-favourited="false"
                                        :active-tab="activeTab"
                                        :is-new="newGameSet.has(game)"
                                        @select="emit('select-game', $event)"
                                        @set-default="emit('set-default-game', $event)"
                                        @toggle-favourite="toggleFavourite($event)"
                                    />
                                </div>
                            </GameSelectionSection>
                        </template>

                        <template v-if="nonFavouriteGameList.length > 0">
                            <hr v-if="favouriteGameList.length > 0 || newGameSet.size > 0"/>
                            <GameSelectionSection
                                :title="t('translations.pages.gameSelection.cardView.sections.' + activeTab + 's')"
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
                                        :is-new="newGameSet.has(game)"
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
                            :title="t('translations.pages.gameSelection.cardView.sections.searchResults')"
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
                                    :is-new="newGameSet.has(game)"
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
                            :title="t('translations.pages.gameSelection.cardView.sections.hiddenGames')"
                            :count="hiddenGameList.length"
                        >
                            <div class="notification is-warning">
                                {{ t('translations.pages.gameSelection.cardView.sections.hiddenGamesNotice') }}
                            </div>
                            <div class="game-cards-container">
                                <GameSelectionCard
                                    v-for="game of hiddenGameList"
                                    :key="game.settingsIdentifier"
                                    :game="game"
                                    :is-selected="isGameSelected(game)"
                                    :is-favourited="isFavourited(game)"
                                    :active-tab="activeTab"
                                    :is-new="newGameSet.has(game)"
                                    @select="emit('select-game', $event)"
                                    @set-default="emit('set-default-game', $event)"
                                    @toggle-favourite="toggleFavourite($event)"
                                />
                            </div>
                        </GameSelectionSection>
                    </template>
                </div>
                <div class="request-game margin-bottom" v-if="resultCount > 0">
                    <hr/>
                    <h3 class="title is-5">{{ t('translations.pages.gameSelection.noResults.title') }}</h3>
                    <button class="button margin-top" @click.prevent.stop="requestNewGame">
                        <span>{{ t(`translations.pages.gameSelection.actions.request.${activeTab}`) }}</span>
                        <i class="margin-left--half-width fas fa-external-link-alt"></i>
                    </button>
                </div>
            </template>

        </div>
    </article>
</template>

<script lang="ts" setup>
import { inject, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { GameSelectionViewMode } from '../../model/enums/GameSelectionViewMode';
import { gameSelectionKey } from '../composables/GameSelectionComposable';
import GameSelectionCard from './GameSelectionCard.vue';
import GameSelectionListItem from './GameSelectionListItem.vue';
import GameSelectionSection from './GameSelectionSection.vue';
import Game from '../../model/game/Game';
import LinkProvider from '../../providers/components/LinkProvider';

const { t } = useI18n();

const emit = defineEmits<{
    'select-game': [game: Game];
    'set-default-game': [game: Game];
}>();

const mergedGameList = computed(() => {
    const favourites = favouriteGameList.value;
    const others = nonFavouriteGameList.value;
    return [...favourites, ...others];
});

const resultCount = computed(() => mergedGameList.value.length + hiddenGameList.value.length);

const {
    hiddenGameList,
    newGameSet,
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

function requestNewGame() {
    LinkProvider.instance.openLink("https://wiki.thunderstore.io/ecosystem/adding-a-new-game");
}
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

.title, .subtitle {
    color: inherit;
    display: block;
    margin-top: 1.25rem !important;
}

.subtitle {
    font-weight: lighter;
}

#no-content {
    text-align: center;
}

.icon-button {
    display: flex;
    align-self: center;
    flex: 1;
    justify-self: center;
    align-items: center;
}

.request-game {
    margin: 2rem 1rem;
}
</style>
