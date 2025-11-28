<script lang="ts" setup>
import ModalCard from '../ModalCard.vue';
import { computed } from 'vue';
import SettingsItem from '../settings-components/SettingsItem.vue';
import { useRouter } from 'vue-router';
import R2Error from '../../model/errors/R2Error';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import { useI18n } from 'vue-i18n';

const store = getStore<State>();
const router = useRouter();
const { t } = useI18n();

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
            <h2 class='modal-title non-selectable'>{{ t('translations.pages.manager.navigation.profileSwitcher.label') }}</h2>
        </template>
        <template v-slot:body>
            <SettingsItem
                :action="t('translations.pages.settings.profile.changeProfile.title')"
                :description="t('translations.pages.settings.profile.changeProfile.description')"
                icon="fa-file-import"
                :value="async () => undefined"
                @click="changeProfile" />
            <SettingsItem
                :action="t('translations.pages.settings.profile.exportProfileAsFile.title')"
                :description="t('translations.pages.settings.profile.exportProfileAsFile.description')"
                icon="fa-file-alt"
                :value="async () => undefined"
                @click="exportProfileAsFile"
            />
            <SettingsItem
                :action="t('translations.pages.settings.profile.exportProfileAsCode.title')"
                :description="t('translations.pages.settings.profile.exportProfileAsCode.description')"
                icon="fa-cloud-upload-alt"
                :value="async () => undefined"
                @click="exportProfileAsCode"
            />
            <SettingsItem
                :action="t('translations.pages.settings.profile.importLocalMod.title')"
                :description="t('translations.pages.settings.profile.importLocalMod.description')"
                icon="fa-file-import"
                :value="async () => t('translations.pages.settings.profile.importLocalMod.value')"
                @click="importLocalMod"
            />
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="closeModal">
                {{ t('translations.pages.manager.navigation.profileSwitcher.close') }}
            </button>
        </template>
    </ModalCard>
</template>
