<script lang="ts" setup>
import { computed } from 'vue';

import ModalCard from '../ModalCard.vue';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import { InstallMode } from '../../utils/DependencyUtils';

const store = getStore<State>();

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
            <h2 class='modal-title'>{{ $t('UpdateAllInstalledModsModal.no_mods_to_update') }}</h2>
        </template>
        <template v-slot:body>
            <p>{{ $t('UpdateAllInstalledModsModal.either_all_installed_mods_are') }}</p>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="closeModal()">{{ $t('UpdateAllInstalledModsModal.close') }}</button>
        </template>
    </ModalCard>
    <ModalCard id="update-all-installed-mods-modal" :is-active="isOpen" :can-close="true" v-else @close-modal="closeModal()">
        <template v-slot:header>
            <h2 class='modal-title'>{{ $t('UpdateAllInstalledModsModal.update_all_installed_mods') }}</h2>
        </template>
        <template v-slot:body>
            <p>{{ $t('UpdateAllInstalledModsModal.all_installed_mods_will_be_upd') }}</p>
            <p>{{ $t('UpdateAllInstalledModsModal.any_missing_dependencies_will') }}</p>
            <p>{{ $t('UpdateAllInstalledModsModal.the_following_mods_will_be_dow') }}</p>
            <br/>
            <ul class="list">
                <li class="list-item" v-for='(mod, index) in modsWithUpdates'
                    :key='`to-update-${index}-${mod.getFullName()}`'>
                    {{mod.getName()}} {{ $t('UpdateAllInstalledModsModal.will_be_updated_to') }} {{mod.getLatestVersion()}}
                </li>
            </ul>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="updateAllToLatestVersion()">{{ $t('UpdateAllInstalledModsModal.update_all') }}</button>
        </template>
    </ModalCard>
</template>
