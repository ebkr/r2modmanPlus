<script lang="ts" setup>
import ModalCard from '../ModalCard.vue';
import { computed, getCurrentInstance, onMounted } from 'vue';
import SettingsItem from '../settings-components/SettingsItem.vue';
import VueRouter from 'vue-router';
import R2Error from '../../model/errors/R2Error';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';

const store = getStore<State>();
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
    store.commit("closeProfileManagementModal");
}

async function exportProfileAsCode() {
    try {
        await store.dispatch("profileExport/exportProfileAsCode");
    } catch (e) {
        store.commit('error/handleError', R2Error.fromThrownValue(e));
    }
    store.commit("closeProfileManagementModal");
}

async function importLocalMod() {
    store.commit("openLocalFileImportModal");
    store.commit("closeProfileManagementModal");
}
</script>

<template>
    <ModalCard id="profile-management-modal" :can-close="true" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:header>
            <h2 class='modal-title non-selectable'>{{ $t('ProfileManagementModal.profile') }}</h2>
        </template>
        <template v-slot:body>
            <SettingsItem
                :action="$t('ProfileManagementModal.items.change_profile.action')"
                :description="$t('ProfileManagementModal.items.change_profile.description')"
                icon="fa-file-import"
                :value="async () => undefined"
                @click="changeProfile" />
            <SettingsItem
                :action="$t('ProfileManagementModal.items.export_file.action')"
                :description="$t('ProfileManagementModal.items.export_file.description')"
                icon="fa-file-alt"
                :value="async () => undefined"
                @click="exportProfileAsFile"
            />
            <SettingsItem
                :action="$t('ProfileManagementModal.items.export_code.action')"
                :description="$t('ProfileManagementModal.items.export_code.description')"
                icon="fa-cloud-upload-alt"
                :value="async () => undefined"
                @click="exportProfileAsCode"
            />
            <SettingsItem
                :action="$t('ProfileManagementModal.items.import_local.action')"
                :description="$t('ProfileManagementModal.items.import_local.description')"
                icon="fa-file-import"
                :value="async () => $t('ProfileManagementModal.items.import_local.not_all_installable')"
                @click="importLocalMod"
            />
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="closeModal">{{ $t('ProfileManagementModal.close') }}</button>
        </template>
    </ModalCard>
</template>
