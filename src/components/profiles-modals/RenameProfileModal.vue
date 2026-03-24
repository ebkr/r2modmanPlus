<script lang="ts" setup>
import { ModalCard } from "../all";
import R2Error from "../../model/errors/R2Error";
import { useProfilesComposable } from '../composables/ProfilesComposable';
import { computed, nextTick, ref, watchEffect } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';

const store = getStore<State>();

const {
    doesProfileExist,
    makeProfileNameSafe,
} = useProfilesComposable();

const nameInput = ref<HTMLInputElement>();
const newProfileName = ref<string>('');
const renamingInProgress = ref<boolean>(false);

const isOpen = computed(() => store.state.modals.isRenameProfileModalOpen);

watchEffect(() => {
    newProfileName.value = store.getters['profile/activeProfileName'];
})

watchEffect(() => {
    const openValue = store.state.modals.isRenameProfileModalOpen;
    if (openValue) {
        nextTick(() => {
            nameInput.value!.focus()
        })
    }
});

function closeModal() {
    renamingInProgress.value = false;
    newProfileName.value = store.state.profile.activeProfile.getProfileName();
    store.commit('closeRenameProfileModal');
}

async function performRename() {
    if (renamingInProgress.value) {
        return;
    }
    const safeName = makeProfileNameSafe(newProfileName.value);
    if (safeName !== '') {
        try {
            renamingInProgress.value = true;
            await store.dispatch('profiles/renameProfile', { newName: safeName });
        } catch (e) {
            const err = R2Error.fromThrownValue(e, 'Error whilst renaming profile');
            store.commit('error/handleError', err);
        }
        closeModal();
    }
}

</script>
<template>
    <ModalCard id="rename-profile-modal" v-if="isOpen" :is-active="isOpen" @close-modal="closeModal">

        <template v-slot:header>
            <h2 class="modal-title">{{ $t('RenameProfileModal.rename_a_profile') }}</h2>
        </template>
        <template v-slot:body>
            <p>{{ $t('RenameProfileModal.this_profile_will_store_its_ow') }}</p>

            <input
                v-model="newProfileName"
                @keyup.enter="!doesProfileExist(newProfileName) && performRename()"
                id="rename-profile-modal-new-profile-name"
                class="input"
                ref="nameInput"
                autocomplete="off"
            />

            <span class="tag is-dark" v-if="newProfileName === '' || makeProfileNameSafe(newProfileName) === ''"> {{ $t('RenameProfileModal.profile_name_required') }} </span>
            <span class="tag is-success" v-else-if="!doesProfileExist(newProfileName)">
                "{{makeProfileNameSafe(newProfileName)}}{{ $t('RenameProfileModal.is_available') }} </span>
            <span class="tag is-danger" v-else-if="doesProfileExist(newProfileName)">
                "{{makeProfileNameSafe(newProfileName)}}{{ $t('RenameProfileModal.is_either_already_in_use_or_c') }} </span>
        </template>
        <template v-slot:footer>
            <button class="button is-danger" v-if="doesProfileExist(newProfileName)" disabled>{{ $t('RenameProfileModal.rename') }}</button>
            <button class="button is-info" @click="performRename()" :disabled="renamingInProgress" v-else>{{ $t('RenameProfileModal.rename') }}</button>
        </template>

    </ModalCard>
</template>

<style lang="scss" scoped>
#rename-profile-modal-new-profile-name {
    display: block;
    margin-bottom: 1rem;
}
</style>
