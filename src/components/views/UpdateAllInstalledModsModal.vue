<script lang="ts" setup>
import { computed } from 'vue';

import ModalCard from '../ModalCard.vue';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import { InstallMode } from '../../utils/DependencyUtils';
import { useI18n } from 'vue-i18n';

const store = getStore<State>();
const { t } = useI18n();

const isOpen = computed(() => store.state.modals.isUpdateAllModsModalOpen);
const modsWithUpdates = computed(() => store.getters['profile/modsWithUpdates']);

function closeModal() {
    store.commit("closeUpdateAllModsModal");
}

async function updateAllToLatestVersion() {
    closeModal();
    const combos: ThunderstoreCombo[] = await store.dispatch('profile/getCombosWithUpdates');

    await store.dispatch('download/downloadAndInstallCombos', {
        combos,
        profile: store.getters['profile/activeProfile'].asImmutableProfile(),
        game: store.state.activeGame,
        installMode: InstallMode.UPDATE_ALL
    });
}
</script>

<template>
    <ModalCard id="update-all-installed-mods-modal" :is-active="isOpen" :can-close="true" v-if="modsWithUpdates.length === 0" @close-modal="closeModal()">
        <template v-slot:header>
            <h2 class='modal-title'>
                {{ t('translations.pages.manager.modals.updateAllInstalledMods.noModsToUpdate.title') }}
            </h2>
        </template>
        <template v-slot:body>
            <p>{{ t('translations.pages.manager.modals.updateAllInstalledMods.noModsToUpdate.content')}}</p>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="closeModal()">
                {{ t('translations.pages.manager.modals.updateAllInstalledMods.noModsToUpdate.close') }}
            </button>
        </template>
    </ModalCard>
    <ModalCard id="update-all-installed-mods-modal" :is-active="isOpen" :can-close="true" v-else @close-modal="closeModal()">
        <template v-slot:header>
            <h2 class='modal-title'>
                {{ t('translations.pages.manager.modals.updateAllInstalledMods.hasModsToUpdate.title') }}
            </h2>
        </template>
        <template v-slot:body>
            <p>{{ t('translations.pages.manager.modals.updateAllInstalledMods.hasModsToUpdate.content.willBeUpdated') }}</p>
            <p>{{ t('translations.pages.manager.modals.updateAllInstalledMods.hasModsToUpdate.content.missingDependenciesInstalled') }}</p>
            <p>{{ t('translations.pages.manager.modals.updateAllInstalledMods.hasModsToUpdate.content.whatWillHappen') }}</p>
            <br/>
            <ul class="list">
                <li class="list-item" v-for='(mod, index) in modsWithUpdates'
                    :key='`to-update-${index}-${mod.getFullName()}`'>
                    {{ t('translations.pages.manager.modals.updateAllInstalledMods.hasModsToUpdate.content.modUpdatedTo', { modName: mod.getName(), version: mod.getLatestVersion() }) }}
                </li>
            </ul>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="updateAllToLatestVersion()">
                {{ t('translations.pages.manager.modals.updateAllInstalledMods.hasModsToUpdate.updateAll') }}
            </button>
        </template>
    </ModalCard>
</template>
