<script lang="ts" setup>
import ModalCard from '../../components/ModalCard.vue';
import { computed } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';

const store = getStore<State>();

const isOpen = computed(() => store.state.modals.isIncorrectSteamDirectoryModalOpen);

function close() {
    store.commit("closeIncorrectSteamDirectoryModal");
}
</script>

<template>
    <ModalCard id="incorrect-steam-directory-modal" v-show="isOpen" :is-active="isOpen" @close-modal="close">
        <template v-slot:header>
            <h2 class="modal-title">Failed to set the Steam folder</h2>
        </template>
        <template v-slot:body>
            <p>The Steam executable was not selected.</p>
            <p>If this error has appeared but the executable is correct, please run as administrator.</p>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="close">
                I understand
            </button>
        </template>
    </ModalCard>
</template>
