<script lang="ts" setup>
import { computed } from 'vue';
import ModalCard from '../../components/ModalCard.vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';

const store = getStore<State>();

const isOpen = computed(() => store.state.modals.isSteamInstallationValidationModalOpen);
const activeGame = computed(() => store.state.activeGame);

function close() {
    store.commit('closeSteamInstallationValidationModal');
}
</script>

<template>
    <ModalCard id="steam-installation-validation-modal" v-show="isOpen" :is-active="isOpen" @close-modal="close">
        <template v-slot:header>
            <h2 class="modal-title">Clearing the {{ activeGame.displayName }} installation directory</h2>
        </template>
        <template v-slot:body>
            <div class="notification is-warning">
                <p>
                    You will not be able to launch the game until
                    Steam has verified the integrity of the game files.
                </p>
            </div>
            <p>
                Steam will be started and will attempt to verify the
                integrity of {{ activeGame.displayName }}.
            </p>
            <br/>
            <p>
                Please check the Steam window for validation progress.
                If the window has not yet appeared, please be patient.
            </p>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="close">
                I understand
            </button>
        </template>
    </ModalCard>
</template>
