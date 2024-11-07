<script lang="ts">
import { Component } from 'vue-property-decorator';
import { ModalCard } from "../all";
import R2Error from "../../model/errors/R2Error";
import ProfilesMixin from "../../components/mixins/ProfilesMixin.vue";

@Component({
    components: {ModalCard}
})
export default class CreateProfileModal extends ProfilesMixin {

    private creatingInProgress: boolean = false;
    private newProfileName = '';

    get isOpen(): boolean {
        return this.$store.state.modals.isCreateProfileModalOpen;
    }

    closeModal() {
        this.newProfileName = '';
        this.creatingInProgress = false;
        this.$store.commit('closeCreateProfileModal');
    }

    // User confirmed creation of a new profile with a name that didn't exist before.
    async createProfile() {
        const safeName = this.makeProfileNameSafe(this.newProfileName);
        if (safeName !== '') {
            try {
                this.creatingInProgress = true;
                await this.$store.dispatch('profiles/addProfile', safeName);
                this.closeModal();
            } catch (e) {
                this.creatingInProgress = false;
                const err = R2Error.fromThrownValue(e, 'Error whilst creating a profile');
                this.$store.commit('error/handleError', err);
            }
        }
    }
}

</script>
<template>
    <ModalCard v-if="isOpen" :is-active="isOpen" @close-modal="closeModal">

        <template v-slot:header>
            <h2 class="modal-title">Create a profile</h2>
        </template>

        <template v-slot:body>
            <p>This profile will store its own mods independently from other profiles.</p>
            <br/>
            <input
                class="input"
                v-model="newProfileName"
                @keyup.enter="!doesProfileExist(newProfileName) && createProfile(newProfileName)"
                id="create-profile-modal-new-profile-name"
                ref="nameInput"
            />
            <br/><br/>
            <span class="tag is-dark" v-if="newProfileName === '' || makeProfileNameSafe(newProfileName) === ''">
                Profile name required
            </span>
            <span class="tag is-success" v-else-if="!doesProfileExist(newProfileName)">
                "{{makeProfileNameSafe(newProfileName)}}" is available
            </span>
            <span class="tag is-danger" v-else-if="doesProfileExist(newProfileName)">
                "{{makeProfileNameSafe(newProfileName)}}" is either already in use, or contains invalid characters
            </span>
        </template>

        <template v-slot:footer>
            <button id="modal-create-profile-invalid" class="button is-danger" v-if="doesProfileExist(newProfileName)" disabled>Create</button>
            <button id="modal-create-profile" class="button is-info" @click="createProfile(newProfileName)" :disabled="creatingInProgress" v-else>Create</button>
        </template>

    </ModalCard>
</template>
