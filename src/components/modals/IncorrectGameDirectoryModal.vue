<script lang="ts" setup>
import ModalCard from '../../components/ModalCard.vue';
import { computed } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import Game from '../../model/game/Game';

const store = getStore<State>();

const activeGame = computed<Game>(() => store.state.activeGame);
const isOpen = computed(() => store.state.modals.isIncorrectGameDirectoryModalOpen);

function close() {
    store.commit("closeIncorrectGameDirectoryModal");
}
</script>

<template>
    <ModalCard id="incorrect-game-directory-modal" v-show="isOpen" :is-active="isOpen" @close-modal="close">
        <template v-slot:header>
            <h2 class="modal-title">Failed to set the {{ activeGame.displayName }} folder</h2>
        </template>
        <template v-slot:body>
            <p>The selected executable must be any of the following:</p>
            <ul class="list">
                <li v-for="exe in activeGame.exeName"><strong>{{ exe }}</strong></li>
            </ul>
            <p class="margin-top">If this error has appeared but the executable is correct, please run as administrator.</p>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="close">
                I understand
            </button>
        </template>
    </ModalCard>
</template>
