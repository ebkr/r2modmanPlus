<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import Game from "../../model/game/Game";
import { Platform } from "../../model/schema/ThunderstoreSchema";
import { computed } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';

const { t } = useI18n();

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
                <h3 class="title" v-if="isSteamGame">{{ t('translations.pages.manager.modals.gameRunning.launchingViaSteam', { gameName: activeGame.displayName }) }}</h3>
                <h3 class="title" v-else>{{ t('translations.pages.manager.modals.gameRunning.starting', { gameName: activeGame.displayName }) }}</h3>
                <h5 class="title is-5">{{ t('translations.pages.manager.modals.gameRunning.closeToContinue') }}</h5>
                <div v-if="isSteamGame">
                    <p>{{ t('translations.pages.manager.modals.gameRunning.takingAWhile') }}</p>
                    <p>{{ t('translations.pages.manager.modals.gameRunning.bePatient') }}</p>
                </div>
            </div>
        </div>
        <button class="modal-close is-large" :aria-label="t('translations.pages.manager.modals.gameRunning.close')" @click="close"></button>
    </div>
</template>
