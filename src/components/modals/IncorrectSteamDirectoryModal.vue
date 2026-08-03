<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import ModalCard from '../../components/ModalCard.vue';
import { computed } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';

const { t } = useI18n();

const store = getStore<State>();

const isOpen = computed(() => store.state.modals.isIncorrectSteamDirectoryModalOpen);

function close() {
    store.commit("closeIncorrectSteamDirectoryModal");
}
</script>

<template>
    <ModalCard id="incorrect-steam-directory-modal" v-show="isOpen" :is-active="isOpen" @close-modal="close">
        <template v-slot:header>
            <h2 class="modal-title">{{ t('translations.pages.manager.modals.failedToSetSteamFolder.title') }}</h2>
        </template>
        <template v-slot:body>
            <p>{{ t('translations.pages.manager.modals.failedToSetSteamFolder.steamExecutableNotSelected') }}</p>
            <p>{{ t('translations.pages.manager.modals.failedToSetSteamFolder.solution') }}</p>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="close">
                {{ t('translations.pages.manager.modals.clearingGameDirectory.confirmation') }}
            </button>
        </template>
    </ModalCard>
</template>
