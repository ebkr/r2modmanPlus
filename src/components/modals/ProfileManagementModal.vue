<script lang="ts" setup>
import ModalCard from '../ModalCard.vue';
import { computed, getCurrentInstance, onMounted } from 'vue';
import useStore from '../../store';
import SettingsItem from '../settings-components/SettingsItem.vue';

import VueRouter from 'vue-router';
import R2Error from '../../model/errors/R2Error';

const store = useStore();
let router!: VueRouter;

onMounted(() => {
    router = getCurrentInstance()!.proxy.$router;
})

const isOpen = computed(() => store.state.modals.isProfileManagementModalOpen);

function closeModal() {
    store.commit('closeProfileManagementModal');
}

async function changeProfile() {
    store.commit("closeProfileManagementModal");
    router.push({name: 'profiles'});
}

async function exportProfileAsFile() {
    try {
        await store.dispatch("profileExport/exportProfileAsFile");
    } catch (e) {
        store.commit('error/handleError', R2Error.fromThrownValue(e));
    }
}

async function exportProfileAsCode() {
    try {
        await store.dispatch("profileExport/exportProfileAsCode");
    } catch (e) {
        store.commit('error/handleError', R2Error.fromThrownValue(e));
    }
    store.commit("closeProfileManagementModal");
}
</script>

<template>
    <ModalCard id="profile-management-modal" :can-close="true" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:header>
            <h2 class='modal-title non-selectable'>Profile</h2>
        </template>
        <template v-slot:body>
            <SettingsItem
                action="Change profile"
                description="Return to the profile selection screen"
                icon="fa-file-import"
                :value="async () => undefined"
                @click="changeProfile" />
            <SettingsItem
                action="Export profile as a file"
                description="Export your mod list and configs as a file"
                icon="fa-file-alt"
                :value="async () => undefined"
                @click="exportProfileAsFile"
            />
            <SettingsItem
                action="Export profile as code"
                description="Export your mod list and configs as a code"
                icon="fa-cloud-upload-alt"
                :value="async () => undefined"
                @click="exportProfileAsCode"
            />
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="closeModal">Close</button>
        </template>
    </ModalCard>
</template>
