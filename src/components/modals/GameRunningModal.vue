<script lang="ts" setup>
import Game from "../../model/game/Game";
import { StorePlatform } from "../../model/game/StorePlatform";
import { computed } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';

const store = getStore<State>()

type GameRunningModalProps = {
    activeGame: Game;
}
const props = defineProps<GameRunningModalProps>();

const isSteamGame = computed(() => props.activeGame.activePlatform.storePlatform === StorePlatform.STEAM);
const isOpen = computed(() => store.state.modals.isGameRunningModalOpen);

function close() {
    store.commit('closeGameRunningModal');
}
</script>


<template>
    <div id="gameRunningModal" :class="['modal', {'is-active': isOpen}]">
        <div class="modal-background" @click="close"></div>
        <div class="modal-content">
            <div class='notification is-info'>
                <h3 class="title" v-if="isSteamGame">{{ activeGame.displayName }} is launching via Steam</h3>
                <h3 class="title" v-else>{{ activeGame.displayName }} is starting</h3>
                <h5 class="title is-5">Close this message to continue modding.</h5>
                <div v-if="isSteamGame">
                    <p>If this is taking a while, it's likely due to Steam starting.</p>
                    <p>Please be patient, and have fun!</p>
                </div>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="close"></button>
    </div>
</template>
