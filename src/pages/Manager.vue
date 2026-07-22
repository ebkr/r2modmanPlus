<template>
    <ManagerActivityBar />
	<div class="manager-main-view">
        <CategoryFilterModal />
        <IncorrectGameDirectoryModal />
        <IncorrectSteamDirectoryModal />
        <LaunchArgumentsModal />
        <DependencyStringsModal />
        <SteamInstallationValidationModal />
        <SortModal />
        <LocalFileImportModal :visible="importingLocalMod" @close-modal="importingLocalMod = false" />
        <ProfileCodeExportModal />
        <DownloadProgressModal />
        <DownloadModVersionSelectModal />
        <UpdateAllInstalledModsModal />
        <VulnerablePackageReviewModal/>
        <LaunchTypeModal v-if="canRenderLaunchTypeModal()" />

        <div class="router-view">
            <router-view name="subview" />
        </div>
    </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue';
import LocalFileImportModal from '../components/importing/LocalFileImportModal.vue';
import CategoryFilterModal from '../components/modals/CategoryFilterModal.vue';
import IncorrectGameDirectoryModal from '../components/modals/IncorrectGameDirectoryModal.vue';
import IncorrectSteamDirectoryModal from '../components/modals/IncorrectSteamDirectoryModal.vue';
import DependencyStringsModal from '../components/modals/DependencyStringsModal.vue';
import SteamInstallationValidationModal from '../components/modals/SteamInstallationValidationModal.vue';
import LaunchArgumentsModal from '../components/modals/LaunchArgumentsModal.vue';
import ProfileCodeExportModal from '../components/modals/ProfileCodeExportModal.vue';
import SortModal from '../components/modals/SortModal.vue';
import DownloadModVersionSelectModal from '../components/views/DownloadModVersionSelectModal.vue';
import DownloadProgressModal from '../components/views/DownloadProgressModal.vue';
import UpdateAllInstalledModsModal from '../components/views/UpdateAllInstalledModsModal.vue';
import { getStore } from '../providers/generic/store/StoreProvider';
import { State } from '../store';
import LaunchTypeModal from "../components/modals/launch-type/LaunchTypeModal.vue";
import appWindow from '../providers/node/app/app_window';
import ManagerActivityBar from '../components/navigation/ManagerActivityBar.vue';
import VulnerablePackageReviewModal from 'components/modals/VulnerablePackageReviewModal.vue';

const store = getStore<State>();

const importingLocalMod = ref<boolean>(false);

function canRenderLaunchTypeModal() {
    return ['linux', 'darwin'].includes(appWindow.getPlatform());
}

store.dispatch('profile/loadOrderingSettings');
store.commit('modFilters/reset');
</script>

<style lang="scss">

.manager-main-view {
    display: flex;
    flex: 1;
    width: 100%;
}

.router-view {
    display: flex;
    flex: 1;
    width: 100%;
}

.game-icon {
    height: 1.125rem;
    border-radius: 2px;
}

.vertical-break {
    height: 1.25rem;
    width: 1px;
    margin: 0 0.25rem;
    background-color: var(--border, #e1e1e1);
    border-radius: 5px;
    align-self: center;
    flex-shrink: 0;
}
</style>
