<script lang="ts" setup>
import Game from "../../model/game/Game";
import { Platform } from "../../model/schema/ThunderstoreSchema";
import { computed } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';

const store = getStore<State>()

type GameRunningModalProps = {
    activeGame: Game;
}
const props = defineProps<GameRunningModalProps>();

const isSteamGame = computed(() => props.activeGame.activePlatform.storePlatform === Platform.STEAM);
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
                <h3 class="title" v-if="isSteamGame">{{ activeGame.displayName }} {{ $t('GameRunningModal.is_launching_via_steam') }}</h3>
                <h3 class="title" v-else>{{ activeGame.displayName }} {{ $t('GameRunningModal.is_starting') }}</h3>
                <h5 class="title is-5">{{ $t('GameRunningModal.close_this_message_to_continue') }}</h5>
                <div v-if="isSteamGame">
                    <p>{{ $t('GameRunningModal.if_this_is_taking_a_while_it_s') }}</p>
                    <p>{{ $t('GameRunningModal.please_be_patient_and_have_fun') }}</p>
                </div>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="close"></button>
    </div>
</template>
