<template>
    <div id="content" class="columns">
        <div class="column non-selectable is-one-quarter">
            <NavigationMenu @error="$emit('error', $event)" />
        </div>
        <div class="column">
            <router-view @error="$emit('error', $event)" />
        </div>
        <GameRunningModal :activeGame="activeGame" />
    </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

import NavigationMenu from './NavigationMenu.vue';
import GameRunningModal from '../modals/GameRunningModal.vue';
import GameManager from '../../model/game/GameManager';

@Component({
    components: {GameRunningModal, NavigationMenu}
})
export default class NavigationLayout extends Vue {
    activeGame = GameManager.defaultGame;

    created() {
        this.activeGame = GameManager.activeGame;
    }
}

</script>
