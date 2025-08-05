<script lang="ts" setup>
import { ModalCard } from "../all";
import R2Error from "../../model/errors/R2Error";
import { computed, ref } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import {useI18n} from "vue-i18n";

const store = getStore<State>();
const { t } = useI18n();

const deletingInProgress = ref<boolean>(false);
const isOpen = computed(() => store.state.modals.isDeleteProfileModalOpen);

function closeDeleteProfileModal() {
    deletingInProgress.value = false;
    store.commit('closeDeleteProfileModal');
}

async function removeProfile() {
    if (deletingInProgress.value) {
        return;
    }
    try {
        deletingInProgress.value = true;
        await store.dispatch('profiles/removeSelectedProfile');
    } catch (e) {
        const err = R2Error.fromThrownValue(e, 'Error whilst deleting profile');
        store.commit('error/handleError', err);
    }
    closeDeleteProfileModal();
}

</script>
<template>
    <ModalCard id="delete-profile-modal" v-if="isOpen" :is-active="isOpen" @close-modal="closeDeleteProfileModal">

        <template v-slot:header>
            <h2 class="modal-title">
                {{ t('translations.pages.profileSelection.deleteProfileModal.title') }}
            </h2>
        </template>
        <template v-slot:body>
            <p>
                {{ t('translations.pages.profileSelection.deleteProfileModal.content.resultingAction') }}
            </p>
            <p>
                {{ t('translations.pages.profileSelection.deleteProfileModal.content.preventAction') }}
            </p>
            <p>{{ t('translations.pages.profileSelection.deleteProfileModal.content.confirmation') }}</p>
        </template>
        <template v-slot:footer>
            <button
                :disabled="deletingInProgress"
                class="button is-danger"
                @click="removeProfile()">
                {{ t('translations.pages.profileSelection.deleteProfileModal.actions.delete') }}
            </button>
        </template>

    </ModalCard>
</template>
