<script lang="ts">
import { Component, Ref, Vue, Watch } from 'vue-property-decorator';
import { ModalCard } from "../all";
import R2Error from "../../model/errors/R2Error";
import Profile from "../../model/Profile";
import { useProfilesComposable } from '../composables/ProfilesComposable';

@Component({
    components: {ModalCard}
})
export default class RenameProfileModal extends Vue {
    @Ref() readonly nameInput: HTMLInputElement | undefined;
    private newProfileName: string = '';
    private renamingInProgress: boolean = false;

    get doesProfileExist() {
        const { doesProfileExist } = useProfilesComposable();
        return doesProfileExist;
    }

    get makeProfileNameSafe() {
        const { makeProfileNameSafe } = useProfilesComposable();
        return makeProfileNameSafe;
    }

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
        this.renamingInProgress = false;
        this.newProfileName = this.$store.state.profile.activeProfile.getProfileName();
        this.$store.commit('closeRenameProfileModal');
    }

    async performRename() {
        if (this.renamingInProgress) {
            return;
        }
        try {
            this.renamingInProgress = true;
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
    <ModalCard id="rename-profile-modal" v-if="isOpen" :is-active="isOpen" @close-modal="closeModal">

        <template v-slot:header>
            <h2 class="modal-title">Rename a profile</h2>
        </template>
        <template v-slot:body>
            <p>This profile will store its own mods independently from other profiles.</p>

            <input
                v-model="newProfileName"
                @keyup.enter="!doesProfileExist(newProfileName) && performRename()"
                id="rename-profile-modal-new-profile-name"
                class="input"
                ref="nameInput"
                autocomplete="off"
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
            <button class="button is-info" @click="performRename()" :disabled="renamingInProgress" v-else>Rename</button>
        </template>

    </ModalCard>
</template>
