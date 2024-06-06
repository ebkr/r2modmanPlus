<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { ModalCard } from "../all";
import R2Error from "../../model/errors/R2Error";
import sanitize from "sanitize-filename";

@Component({
    components: {ModalCard}
})
export default class CreateProfileModal extends Vue {
    private newProfileName = '';
    get isOpen(): boolean {
        return this.$store.state.modals.isCreateProfileModalOpen;
    }
    closeModal() {
        this.newProfileName = '';
        this.$store.commit('closeCreateProfileModal');
    }

    get profileList(): string[] {
        return this.$store.state.profiles.profileList;
    }

    makeProfileNameSafe(nameToSanitize: string): string {
        return sanitize(nameToSanitize);
    }

    doesProfileExist(nameToCheck: string): boolean {
        if ((nameToCheck.match(new RegExp('^([a-zA-Z0-9])(\\s|[a-zA-Z0-9]|_|-|[.])*$'))) === null) {
            return true;
        }
        const safe: string = this.makeProfileNameSafe(nameToCheck);
        return (this.profileList.some(function (profile: string) {
            return profile.toLowerCase() === safe.toLowerCase()
        }));
    }

    // User confirmed creation of a new profile with a name that didn't exist before.
    async createProfile() {
        const safeName = this.makeProfileNameSafe(this.newProfileName);
        if (safeName !== '') {
            try {
                await this.$store.dispatch('profiles/addProfile', safeName);
                this.closeModal();
            } catch (e) {
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
            <p class="modal-card-title">Create a profile</p>
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
            <button id="modal-create-profile" class="button is-info" @click="createProfile(newProfileName)" v-else>Create</button>
        </template>

    </ModalCard>
</template>
