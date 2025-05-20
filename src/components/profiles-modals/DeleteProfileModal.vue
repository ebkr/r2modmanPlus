<script lang="ts" setup>
import { Component, Vue } from 'vue-property-decorator';
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
            <h2 class="modal-title">Delete profile</h2>
        </template>
        <template v-slot:body>
            <p>This will remove all mods, and their config files, installed within this profile.</p>
            <p>If this was an accident, click either the darkened area, or the cross inside located in the top right.</p>
            <p>Are you sure you'd like to delete this profile?</p>
        </template>
        <template v-slot:footer>
            <button
                :disabled="deletingInProgress"
                class="button is-danger"
                @click="removeProfile()"
            >Delete profile</button>
        </template>

    </ModalCard>
</template>
