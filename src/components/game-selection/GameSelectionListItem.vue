<template>
    <a @click="emit('click', game)">
        <div class="border-at-bottom cursor-pointer">
            <div class="card is-shadowless">
                <p :class="['card-header-title', {'has-text-info': isSelected}]">
                    <i v-if="markHidden" class="fas fa-eye-slash margin-right--half-width"></i>
                    <a :id="`${game.settingsIdentifier}-star`" href="#" class="margin-right" @click.prevent="emit('toggle-favourite', game)">
                        <i class="fas fa-star text-warning" v-if="isFavourited"></i>
                        <i class="far fa-star" v-else></i>
                    </a>
                    {{ game.displayName }}
                </p>
            </div>
        </div>
    </a>
</template>

<script lang="ts" setup>
import Game from '../../model/game/Game';

type Props = {
    game: Game;
    isSelected: boolean;
    isFavourited: boolean;
    markHidden?: boolean;
};

withDefaults(defineProps<Props>(), {
    markHidden: false,
});

const emit = defineEmits<{
    click: [game: Game];
    'toggle-favourite': [game: Game];
}>();
</script>

<style scoped lang="scss">
</style>
