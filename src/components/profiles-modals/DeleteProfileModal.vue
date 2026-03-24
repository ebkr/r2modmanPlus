<script lang="ts" setup>
import { ModalCard } from "../all";
import R2Error from "../../model/errors/R2Error";
import { computed, ref } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';

const store = getStore<State>();

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
            <h2 class="modal-title">{{ $t('DeleteProfileModal.delete_profile') }}</h2>
        </template>
        <template v-slot:body>
            <p>{{ $t('DeleteProfileModal.this_will_remove_all_mods_and') }}</p>
            <p>{{ $t('DeleteProfileModal.if_this_was_an_accident_click') }}</p>
            <p>{{ $t('DeleteProfileModal.are_you_sure_you_d_like_to_del') }}</p>
        </template>
        <template v-slot:footer>
            <button
                :disabled="deletingInProgress"
                class="button is-danger"
                @click="removeProfile()"
            >{{ $t('DeleteProfileModal.delete_profile') }}</button>
        </template>

    </ModalCard>
</template>
