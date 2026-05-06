<template>
    <div class="game-card-wrapper">
        <div class="game-card">
            <div class="game-card__image">
                <template v-if="activeTab === GameInstanceType.GAME">
                    <img :src="imageSrc" alt="Game Logo" class="game-card__thumbnail"/>
                </template>
                <template v-else>
                    <div class="game-card__placeholder">{{ game.displayName }}</div>
                </template>
            </div>
            <div class="game-card__new-badge" v-if="isNew">
                <i class="fas fa-bolt game-card__new-badge-icon"></i> New
            </div>
            <div class="game-card__overlay">
                <div class="game-card__overlay-spacer"></div>
                <div class="game-card__overlay-body">
                    <button class="button is-info" @click="emit('select', game)">
                        Select {{ activeTab.toLowerCase() }}
                    </button>
                    <button class="button" @click="emit('set-default', game)">Set as default</button>
                </div>
                <div class="game-card__overlay-spacer"></div>
            </div>
        </div>
        <div class="game-card-wrapper__footer">
            <p>{{ game.displayName }}</p>
            <a :id="`${game.settingsIdentifier}-star`" href="#" @click.prevent="emit('toggle-favourite', game)">
                <i class="fas fa-star text-warning" v-if="isFavourited"></i>
                <i class="far fa-star" v-else></i>
            </a>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Game from '../../model/game/Game';
import { GameInstanceType } from '../../model/schema/ThunderstoreSchema';
import { useGameImageComposable } from '../composables/GameImageComposable';

type Props = {
    game: Game;
    isFavourited: boolean;
    activeTab: GameInstanceType;
    isNew?: boolean;
};

const props = withDefaults(defineProps<Props>(), { isNew: false });

const emit = defineEmits<{
    select: [game: Game];
    'set-default': [game: Game];
    'toggle-favourite': [game: Game];
}>();

const { imageSrc } = useGameImageComposable(() => props.game.iconUrl);
</script>

<style scoped lang="scss">
.game-card-wrapper {
    width: 100%;
}

.game-card-wrapper__footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 0.4rem;
}

.game-card {
    position: relative;
    display: block;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
}

.game-card__image {
    display: block;
    background-color: black;
}

.game-card__thumbnail {
    display: block;
    width: 100%;
    aspect-ratio: 3 / 4;
    object-fit: cover;
}

.game-card__placeholder {
    aspect-ratio: 3 / 4;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1rem;
    background-color: var(--border-secondary, #c9d3ee);
}

.game-card__new-badge {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.2rem 0.55rem;
    background-color: var(--game-card-new-badge-background);
    border: 1px solid var(--game-card-new-badge-border);
    border-radius: 5px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--v2-inactive-tag-color);
    backdrop-filter: blur(4px);
    pointer-events: none;
}

.game-card__new-badge-icon {
    color: var(--v2-link-text-color);
    font-size: 0.65rem;
}

.game-card__overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.1s linear;

    &:hover,
    &:focus,
    &:focus-within {
        opacity: 1;
    }
}

.game-card__overlay-header {
    display: flex;
    flex: 1;
    justify-content: right;
    align-items: flex-start;
    padding: 0.75rem;

    .title {
        margin: 0;
    }
}

.game-card__overlay-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
}

.game-card__overlay-spacer {
    flex: 1;
}

.button {
    height: min-content;
}
</style>
