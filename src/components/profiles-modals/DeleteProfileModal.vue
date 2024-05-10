<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { ModalCard } from "../all";
import FileUtils from "../../utils/FileUtils";
import R2Error from "../../model/errors/R2Error";
import Profile from "../../model/Profile";
import FsProvider from "../../providers/generic/file/FsProvider";


let fs: FsProvider;

@Component({
    components: {ModalCard}
})
export default class DeleteProfileModal extends Vue {

    async created() {
        fs = FsProvider.instance;
    }

    get activeProfile(): Profile {
        return this.$store.getters['profile/activeProfile'];
    }

    get isOpen(): boolean {
        return this.$store.state.modals.isDeleteProfileModalOpen;
    }

    get profileList(): string[] {
        return this.$store.state.profiles.profileList;
    }

    closeDeleteProfileModal() {
        this.$store.commit('closeDeleteProfileModal');
    }

    async removeProfileAfterConfirmation() {
        try {
            await FileUtils.emptyDirectory(this.activeProfile.getPathOfProfile());
            await fs.rmdir(this.activeProfile.getPathOfProfile());
        } catch (e) {
            const err = R2Error.fromThrownValue(e, 'Error whilst deleting profile');
            this.$store.commit('error/handleError', err);
        }
        if (
            this.activeProfile
                .getProfileName()
                .toLowerCase() !== 'default'
        ) {
            for (let profileIteration = 0; profileIteration < this.profileList.length; profileIteration++) {
                if (this.profileList[profileIteration] === this.activeProfile.getProfileName()) {
                    this.$store.commit('profiles/spliceProfileList', profileIteration);
                    break;
                }
            }
        }
        await this.$store.dispatch('profile/updateActiveProfile', 'Default');
        this.closeDeleteProfileModal();
    }
}

</script>
<template>
    <ModalCard v-if="isOpen" :is-active="isOpen" @close-modal="closeDeleteProfileModal">

        <template v-slot:header>
            <p class="modal-card-title">Delete profile</p>
        </template>
        <template v-slot:body>
            <p>This will remove all mods, and their config files, installed within this profile.</p>
            <p>If this was an accident, click either the darkened area, or the cross inside located in the top right.</p>
            <p>Are you sure you'd like to delete this profile?</p>
        </template>
        <template v-slot:footer>
            <button
                class="button is-danger"
                @click="removeProfileAfterConfirmation()"
            >Delete profile</button>
        </template>

    </ModalCard>
</template>
