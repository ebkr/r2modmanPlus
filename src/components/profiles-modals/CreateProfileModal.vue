<script lang="ts" setup>
import { ModalCard } from '../all';
import R2Error from '../../model/errors/R2Error';
import { useProfilesComposable } from '../composables/ProfilesComposable';
import { computed, nextTick, ref, watch } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import {useI18n} from "vue-i18n";

const store = getStore<State>();
const { t } = useI18n();

const {
    doesProfileExist,
    makeProfileNameSafe,
} = useProfilesComposable();

const nameInput = ref<HTMLInputElement>();
const creatingInProgress = ref<boolean>(false);
const newProfileName = ref<string>('');

const isOpen = computed<boolean>(() => store.state.modals.isCreateProfileModalOpen);

watch(isOpen, async (isNowOpen) => {
    if (isNowOpen) {
        await nextTick();
        nameInput.value && nameInput.value.focus();
    }
});

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
            <h2 class="modal-title">{{ t('translations.pages.profileSelection.createProfileModal.title') }}</h2>
        </template>

        <template v-slot:body>
            <p>
                {{ t('translations.pages.profileSelection.createProfileModal.description')}}
            </p>
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
                {{ t('translations.pages.profileSelection.createProfileModal.tagStates.required') }}
            </span>
            <span class="tag is-success" v-else-if="!doesProfileExist(newProfileName)">
                {{ t('translations.pages.profileSelection.createProfileModal.tagStates.valid', { profileName: makeProfileNameSafe(newProfileName) }) }}
            </span>
            <span class="tag is-danger" v-else-if="doesProfileExist(newProfileName)">
                {{ t('translations.pages.profileSelection.createProfileModal.tagStates.error', { profileName: makeProfileNameSafe(newProfileName) }) }}
            </span>
        </template>

        <template v-slot:footer>
            <button id="modal-create-profile-invalid" class="button is-danger" v-if="doesProfileExist(newProfileName)" disabled>
                {{ t('translations.pages.profileSelection.createProfileModal.actions.create') }}
            </button>
            <button id="modal-create-profile" class="button is-info" @click="createProfile()" :disabled="creatingInProgress" v-else>
                {{ t('translations.pages.profileSelection.createProfileModal.actions.create') }}
            </button>
        </template>

    </ModalCard>
</template>
