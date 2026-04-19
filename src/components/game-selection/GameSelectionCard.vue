<template>
    <div class="inline">
        <div class="card is-shadowless">
            <div class="cursor-pointer">
                <header class="card-header is-shadowless is-relative has-background-black">
                    <div class="absolute-full z-fab flex">
                        <div class="card-action-overlay rounded">
                            <div class="absolute-top card-header-title">
                                <p class="text-left title is-5 has-text-white">{{ game.displayName }}</p>
                            </div>
                            <div class="absolute-top-right card-header-title">
                                <p class="text-left title is-5">
                                    <a :id="`${game.settingsIdentifier}-star`" href="#" @click.prevent="emit('toggle-favourite', game)">
                                        <i class="fas fa-star text-warning" v-if="isFavourited"></i>
                                        <i class="far fa-star" v-else></i>
                                    </a>
                                </p>
                            </div>
                            <div class="absolute-center text-center">
                                <button class="button is-info" @click="emit('select', game)">
                                    Select {{ activeTab.toLowerCase() }}
                                </button>
                                <br/><br/>
                                <button class="button" @click="emit('set-default', game)">Set as default</button>
                            </div>
                        </div>
                    </div>
                    <div class="image is-fullwidth border border--border-box rounded" :class="[{'border--warning warning-shadow': props.isFavourited && props.highlightFavourite}]">
                        <template v-if="activeTab === GameInstanceType.GAME">
                            <img :src="getImageHref(`/images/game_selection/${game.gameImage}`)" alt="Game Logo" class="rounded game-thumbnail"/>
                        </template>
                        <template v-else>
                            <h2 style="height: 250px; width: 188px" class="text-center pad pad--sides">{{ game.displayName }}</h2>
                        </template>
                    </div>
                </header>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Game from '../../model/game/Game';
import { GameInstanceType } from '../../model/schema/ThunderstoreSchema';
import ProtocolProvider from '../../providers/generic/protocol/ProtocolProvider';

type Props = {
    game: Game;
    isSelected: boolean;
    isFavourited: boolean;
    activeTab: GameInstanceType;
    highlightFavourite?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    highlightFavourite: false,
});

const emit = defineEmits<{
    select: [game: Game];
    'set-default': [game: Game];
    'toggle-favourite': [game: Game];
}>();

function getImageHref(image: string) {
    return ProtocolProvider.getPublicAssetUrl(image);
}
</script>

<style scoped lang="scss">
.game-thumbnail {
    width: 188px;
    height: 250px;
    object-fit: cover;
}
</style>
