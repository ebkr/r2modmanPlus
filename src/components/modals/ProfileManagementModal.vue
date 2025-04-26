<script lang="ts" setup>
import ModalCard from '../ModalCard.vue';
import { computed, getCurrentInstance, onMounted } from 'vue';
import useStore from '../../store';
import SettingsItem from 'components/settings-components/SettingsItem.vue';

import VueRouter from 'vue-router';

const store = useStore();
let router!: VueRouter;

onMounted(() => {
    router = getCurrentInstance()!.proxy.$router;
})

const isOpen = computed(() => store.state.modals.isProfileManagementModalOpen);

function closeModal() {
    store.commit('closeProfileManagementModal');
}

function changeProfile() {
    router.push({name: 'profiles'});
}
</script>

<template>
    <ModalCard :can-close="true" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:header>
            <h2 class='modal-title non-selectable'>Profile</h2>
        </template>
        <template v-slot:body>
            <SettingsItem
                action="Change profile"
                description="Return to the profile selection screen"
                icon="fa-file-import"
                :value="() => undefined"
                @click="changeProfile" />
            <!-- TODO - Catch event emits, move to store?? -->
            <SettingsItem
                action="Export profile as a file"
                description="Export your mod list and configs as a file"
                icon="fa-file-alt"
                :value="() => undefined"
                @click="() => $emit('ExportFile')"
            />
            <!-- TODO - Catch event emits, move to store?? -->
            <SettingsItem
                action="Export profile as a code"
                description="Export your mod list and configs as a code"
                icon="fa-cloud-upload-alt"
                :value="() => $emit('ExportCode')" />
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="closeModal">Close</button>
        </template>
    </ModalCard>
</template>
