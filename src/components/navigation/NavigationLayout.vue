<template>
    <div id="content" class="columns">
        <div class="column non-selectable is-one-quarter">
            <NavigationMenu />
        </div>
        <div class="column">
            <router-view />
        </div>
        <GameRunningModal :activeGame="$store.state.activeGame" />
        <ProfileManagementModal />
    </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

import NavigationMenu from './NavigationMenu.vue';
import GameRunningModal from '../modals/GameRunningModal.vue';
import ProfileManagementModal from '../modals/ProfileManagementModal.vue';

@Component({
    components: { ProfileManagementModal, GameRunningModal, NavigationMenu}
})
export default class NavigationLayout extends Vue {}

</script>
