<script lang="ts">
import { Component } from 'vue-property-decorator';
import { ModalCard } from "../all";
import R2Error from "../../model/errors/R2Error";
import ProfilesMixin from "../../components/mixins/ProfilesMixin.vue";

@Component({
    components: {ModalCard}
})
export default class DeleteProfileModal extends ProfilesMixin {
    private deletingInProgress: boolean = false;

    get isOpen(): boolean {
        return this.$store.state.modals.isDeleteProfileModalOpen;
    }

    closeDeleteProfileModal() {
        this.deletingInProgress = false;
        this.$store.commit('closeDeleteProfileModal');
    }

    async removeProfile() {
        if (this.deletingInProgress) {
            return;
        }
        try {
            this.deletingInProgress = true;
            await this.$store.dispatch('profiles/removeSelectedProfile');
        } catch (e) {
            const err = R2Error.fromThrownValue(e, 'Error whilst deleting profile');
            this.$store.commit('error/handleError', err);
        }
        this.closeDeleteProfileModal();
    }
}

</script>
<template>
    <ModalCard v-if="isOpen" :is-active="isOpen" @close-modal="closeDeleteProfileModal">

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
