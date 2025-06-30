<template>
    <div id="content">
        <div class="nav-column non-selectable">
            <NavigationMenu />
        </div>
        <div class="content-column">
            <router-view />
        </div>
        <GameRunningModal :activeGame="store.state.activeGame" />
        <ProfileManagementModal />
    </div>
</template>

<script lang="ts" setup>

import NavigationMenu from './NavigationMenu.vue';
import GameRunningModal from '../modals/GameRunningModal.vue';
import ProfileManagementModal from '../modals/ProfileManagementModal.vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';

const store = getStore<State>();

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
