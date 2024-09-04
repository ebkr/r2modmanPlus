<script lang="ts">
import { Component, Ref, Watch } from 'vue-property-decorator';
import { ModalCard } from "../all";
import R2Error from "../../model/errors/R2Error";
import Profile from "../../model/Profile";
import ProfilesMixin from "../../components/mixins/ProfilesMixin.vue";

@Component({
    components: {ModalCard}
})
export default class RenameProfileModal extends ProfilesMixin {
    @Ref() readonly nameInput: HTMLInputElement | undefined;
    private newProfileName: string = '';

    @Watch('$store.state.profile.activeProfile')
    activeProfileChanged(newProfile: Profile, oldProfile: Profile|null) {
        if (
            // Modal was just created and has no value yet, use any available.
            this.newProfileName === "" ||
            // Profile was not previously selected, use the new active profile.
            oldProfile === null ||
            // Avoid losing user's changes when the profile unexpectedly changes.
            oldProfile.getProfileName() === this.newProfileName
        ) {
            this.newProfileName = newProfile.getProfileName();
        }
    }

    get isOpen(): boolean {
        const isOpen_ = this.$store.state.modals.isRenameProfileModalOpen;

        if (isOpen_) {
            this.$nextTick(() => {
                if (this.nameInput) {
                    this.nameInput.focus();
                }
            });
        }

        return isOpen_;
    }

    closeModal() {
        this.newProfileName = this.$store.state.profile.activeProfile.getProfileName();
        this.$store.commit('closeRenameProfileModal');
    }

    async performRename() {
        try {
            await this.$store.dispatch('profiles/renameProfile', {newName: this.newProfileName});
        } catch (e) {
            const err = R2Error.fromThrownValue(e, 'Error whilst renaming profile');
            this.$store.commit('error/handleError', err);
        }
        this.closeModal();
    }
}

</script>
<template>
    <ModalCard v-if="isOpen" :is-active="isOpen" @close-modal="closeModal">

        <template v-slot:header>
            <p class="modal-card-title">Rename a profile</p>
        </template>
        <template v-slot:body>
            <p>This profile will store its own mods independently from other profiles.</p>

            <input
                class="input"
                v-model="newProfileName"
                @keyup.enter="!doesProfileExist(newProfileName) && performRename(newProfileName)"
                ref="nameInput"
            />

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
            <button class="button is-danger" v-if="doesProfileExist(newProfileName)" disabled>Rename</button>
            <button class="button is-info" @click="performRename(newProfileName)" v-else>Rename</button>
        </template>

    </ModalCard>
</template>
