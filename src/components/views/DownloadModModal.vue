<script lang="ts" setup>
import { Progress } from '../all';
import DownloadModVersionSelectModal from '../../components/views/DownloadModVersionSelectModal.vue';
import UpdateAllInstalledModsModal from '../../components/views/UpdateAllInstalledModsModal.vue';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import ThunderstoreVersion from '../../model/ThunderstoreVersion';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import { useDownloadComposable } from '../composables/DownloadComposable';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import { InstallMode } from "../../utils/DependencyUtils";

const store = getStore<State>();

const {
    closeModal,
    setIsModProgressModalOpen,
} = useDownloadComposable();

async function downloadHandler(tsMod: ThunderstoreMod, tsVersion: ThunderstoreVersion) {
    closeModal();

    const combos = [new ThunderstoreCombo()];
    combos[0].setMod(tsMod);
    combos[0].setVersion(tsVersion);

    await store.dispatch('download/downloadAndInstallCombos', {
        combos,
        profile: store.getters['profile/activeProfile'].asImmutableProfile(),
        game: store.state.activeGame,
        installMode: InstallMode.INSTALL_SPECIFIC
    });
}

</script>

<template>
    <div>
        <div
            id='downloadProgressModal'
            :class="['modal', {'is-active':store.state.download.isModProgressModalOpen}]"
            v-if="store.getters['download/currentDownload'] !== null"
        >
            <div class="modal-background" @click="setIsModProgressModalOpen(false);"></div>
            <div class='modal-content'>
                <div class='notification is-info'>

                    <h3 v-if="store.getters['download/currentDownload'].downloadProgress < 100" class='title'>
                        Downloading {{store.getters['download/currentDownload'].modName}}
                    </h3>
                    <h3 v-else class='title'>
                        Installing {{store.getters['download/currentDownload'].modName}}
                    </h3>

                    <p>Downloading: {{store.getters['download/currentDownload'].downloadProgress}}% complete</p>

                    <Progress
                        :max='100'
                        :value="store.getters['download/currentDownload'].downloadProgress"
                        :className="['is-dark']"
                    />

                    <p v-if="store.getters['download/currentDownload'].installProgress">
                        Installing: {{store.getters['download/currentDownload'].installProgress}}% complete
                    </p>
                    <p v-else>Installing: waiting for download to finish</p>

                    <Progress
                        :max='100'
                        :value="store.getters['download/currentDownload'].installProgress"
                        :className="['is-dark']"
                    />
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="setIsModProgressModalOpen(false);"></button>
        </div>
        <DownloadModVersionSelectModal @download-mod="downloadHandler" />
        <UpdateAllInstalledModsModal />
    </div>
</template>
