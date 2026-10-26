<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed, ref, watch } from 'vue';
import ModalCard from '../../components/ModalCard.vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import { SteamInstallationValidator } from '../../r2mm/manager/SteamInstallationValidator';
import R2Error from '../../model/errors/R2Error';

const { t } = useI18n();

const store = getStore<State>();

const isOpen = computed(() => store.state.modals.isSteamInstallationValidationModalOpen);
const activeGame = computed(() => store.state.activeGame);

const isValidating = ref<boolean>(false);

watch(isOpen, () => {
    isValidating.value = false;
})

function close() {
    store.commit('closeSteamInstallationValidationModal');
}

async function proceed() {
    isValidating.value = true;
    const res = await SteamInstallationValidator.validateInstallation(activeGame.value);
    if (res instanceof R2Error) {
        store.commit('error/handleError', res);
    }
    close();
}
</script>

<template>
    <ModalCard id="steam-installation-validation-modal" v-show="isOpen" :is-active="isOpen" @close-modal="close">
        <template v-slot:header>
            <h2 class="modal-title">{{ t('translations.modals.clearingGameDirectory.title', { gameName: activeGame.displayName }) }}</h2>
        </template>
        <template v-slot:body>
            <div class="notification is-danger">
                <p>
                    {{ t('translations.modals.clearingGameDirectory.warning') }}
                </p>
            </div>
            <p>
                {{ t('translations.modals.clearingGameDirectory.steamWillBeStarted', { gameName: activeGame.displayName }) }}
            </p>
            <br/>
            <p>
                {{ t('translations.modals.clearingGameDirectory.checkSteamForProgress') }}
            </p>
        </template>
        <template v-slot:footer>
            <button
                class="button is-danger"
                @click="proceed"
                :class="{ 'is-loading': isValidating }"
                :disabled="isValidating">
                {{ t('translations.modals.clearingGameDirectory.confirmation') }}
            </button>
        </template>
    </ModalCard>
</template>
