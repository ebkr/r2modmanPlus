<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { ModalCard } from "../all";
import sanitize from 'sanitize-filename';
import R2Error from "../../model/errors/R2Error";
import Profile from "../../model/Profile";

@Component({
    components: {ModalCard}
})
export default class RenameProfileModal extends Vue {
    private newProfileName: string = '';

    @Watch('$store.state.profile.activeProfile')
    activeProfileChanged(newProfile: Profile, oldProfile: Profile|null) {
        if (oldProfile === null || oldProfile.getProfileName() === this.newProfileName) {
            this.newProfileName = newProfile.getProfileName();
        }
    }

    get isOpen(): boolean {
        return this.$store.state.modals.isRenameProfileModalOpen;
    }

    get profileList(): string[] {
        return this.$store.state.profiles.profileList;
    }

    closeModal() {
        this.newProfileName = this.$store.state.profile.activeProfile.getProfileName();
        this.$store.commit('closeRenameProfileModal');
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

            <input class="input" autofocus v-model="newProfileName" />

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
            <button class="button is-danger" v-if="doesProfileExist(newProfileName)">Rename</button>
            <button class="button is-info" @click="performRename(newProfileName)" v-else>Rename</button>
        </template>

    </ModalCard>
</template>
