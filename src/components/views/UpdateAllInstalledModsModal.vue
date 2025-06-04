<script lang="ts" setup>
import { useDownloadComposable } from '../composables/DownloadComposable';
import ModalCard from '../ModalCard.vue';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import { InstallMode } from '../../utils/DependencyUtils';

const store = getStore<State>();

const {
    closeModal,
    isOpen,
    thunderstoreMod,
} = useDownloadComposable();

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
    <ModalCard id="update-all-installed-mods-modal" :is-active="isOpen" :can-close="true" v-if="thunderstoreMod === null" @close-modal="closeModal()">
        <template v-slot:header>
            <h2 class='modal-title'>Update all installed mods</h2>
        </template>
        <template v-slot:body>
            <p>All installed mods will be updated to their latest versions.</p>
            <p>Any missing dependencies will be installed.</p>
            <p>The following mods will be downloaded and installed:</p>
            <br/>
            <ul class="list">
                <li class="list-item" v-for='(mod, index) in $store.getters["profile/modsWithUpdates"]'
                    :key='`to-update-${index}-${mod.getFullName()}`'>
                    {{mod.getName()}} will be updated to: {{mod.getLatestVersion()}}
                </li>
            </ul>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="updateAllToLatestVersion()">Update all</button>
        </template>
    </ModalCard>
</template>
