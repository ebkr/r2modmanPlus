<template>
    <div id="content" class="columns">
        <div class="column non-selectable is-one-quarter">
            <NavigationMenu />
        </div>
        <div class="column">
            <router-view />
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
