<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import ModalCard from '../../components/ModalCard.vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';

const { t } = useI18n();

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
            <h2 class="modal-title">{{ t('translations.pages.manager.modals.clearingGameDirectory.title', { gameName: activeGame.displayName }) }}</h2>
        </template>
        <template v-slot:body>
            <div class="notification is-warning">
                <p>
                    {{ t('translations.pages.manager.modals.clearingGameDirectory.waitToLaunchGame') }}
                </p>
            </div>
            <p>
                {{ t('translations.pages.manager.modals.clearingGameDirectory.steamWillBeStarted', { gameName: activeGame.displayName }) }}
            </p>
            <br/>
            <p>
                {{ t('translations.pages.manager.modals.clearingGameDirectory.checkSteamForProgress') }}
            </p>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="close">
                {{ t('translations.pages.manager.modals.clearingGameDirectory.confirmation') }}
            </button>
        </template>
    </ModalCard>
</template>
