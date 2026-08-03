<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import ModalCard from '../../components/ModalCard.vue';
import { computed } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import Game from '../../model/game/Game';

const { t } = useI18n();

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
            <h2 class="modal-title">{{ t('translations.pages.manager.modals.failedToSetTheGameFolder.title', { gameName: activeGame.displayName }) }}</h2>
        </template>
        <template v-slot:body>
            <p>{{ t('translations.pages.manager.modals.failedToSetTheGameFolder.executableMustBeOneOf') }}</p>
            <ul class="list">
                <li v-for="exe in activeGame.exeName"><strong>{{ exe }}</strong></li>
            </ul>
            <p class="margin-top">{{ t('translations.pages.manager.modals.failedToSetTheGameFolder.solution') }}</p>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="close">
                {{ t('translations.pages.manager.modals.clearingGameDirectory.confirmation') }}
            </button>
        </template>
    </ModalCard>
</template>
