<script lang="ts" setup>
import { ModalCard } from '../all';
import R2Error from '../../model/errors/R2Error';
import { useProfilesComposable } from '../composables/ProfilesComposable';
import { computed, ref } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';

const store = getStore<State>();

const {
    doesProfileExist,
    makeProfileNameSafe,
} = useProfilesComposable();

const creatingInProgress = ref<boolean>(false);
const newProfileName = ref<string>('');

const isOpen = computed(() => store.state.modals.isCreateProfileModalOpen);

function closeModal() {
    newProfileName.value = '';
    creatingInProgress.value = false;
    store.commit('closeCreateProfileModal');
}

// User confirmed creation of a new profile with a name that didn't exist before.
async function createProfile() {
    if (creatingInProgress.value) {
        return;
    }
    const safeName = makeProfileNameSafe(newProfileName.value);
    if (safeName !== '') {
        try {
            creatingInProgress.value = true;
            await store.dispatch('profiles/addProfile', safeName);
            closeModal();
        } catch (e) {
            creatingInProgress.value = false;
            const err = R2Error.fromThrownValue(e, 'Error whilst creating a profile');
            store.commit('error/handleError', err);
        }
    }
}

</script>
<template>
    <ModalCard id="create-profile-modal" v-if="isOpen" :is-active="isOpen" @close-modal="closeModal">

        <template v-slot:header>
            <h2 class="modal-title">Create a profile</h2>
        </template>

        <template v-slot:body>
            <p>This profile will store its own mods independently from other profiles.</p>
            <br/>
            <input
                v-model="newProfileName"
                @keyup.enter="!doesProfileExist(newProfileName) && createProfile()"
                id="create-profile-modal-new-profile-name"
                class="input"
                ref="nameInput"
                autocomplete="off"
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
            <button id="modal-create-profile" class="button is-info" @click="createProfile()" :disabled="creatingInProgress" v-else>Create</button>
        </template>

    </ModalCard>
</template>
