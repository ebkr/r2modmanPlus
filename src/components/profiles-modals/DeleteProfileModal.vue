<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { ModalCard } from "../all";
import R2Error from "../../model/errors/R2Error";

@Component({
    components: {ModalCard}
})
export default class DeleteProfileModal extends Vue {
    get isOpen(): boolean {
        return this.$store.state.modals.isDeleteProfileModalOpen;
    }

    get profileList(): string[] {
        return this.$store.state.profiles.profileList;
    }

    closeDeleteProfileModal() {
        this.$store.commit('closeDeleteProfileModal');
    }

    async removeProfile() {
        try {
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
            <p class="modal-card-title">{{ $t(`modals.profile.delete`) }}</p>
        </template>
        <template v-slot:body>
            <p>{{ $t(`modals.profile.deleteTip1`) }}</p>
            <p>{{ $t(`modals.profile.deleteTip2`) }}</p>
            <p>{{ $t(`modals.profile.deleteTip3`) }}</p>
        </template>
        <template v-slot:footer>
            <button
                class="button is-danger"
                @click="removeProfile()"
            >{{ $t(`modals.profile.delete`) }}</button>
        </template>

    </ModalCard>
</template>
