<template>
    <div id="content">
        <div class="nav-column non-selectable">
            <NavigationMenu />
        </div>
        <div class="content-column">
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

<style>
.content-column {
    display: flex;
    flex: 1;
    padding: 0;
    margin-left: 0.75rem;
    overflow: hidden;
    overflow-y: auto;
    width: 100%;
}

#content {
    padding: 0;
    max-width: 100vw;
    display: flex;
}
</style>
