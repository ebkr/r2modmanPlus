<template>
    <div>
        <div
            id='downloadProgressModal'
            :class="['modal', {'is-active':$store.state.download.isModProgressModalOpen}]"
            v-if="$store.getters['download/currentDownload'] !== null"
        >
            <div class="modal-background" @click="setIsModProgressModalOpen(false);"></div>
            <div class='modal-content'>
                <div class='notification is-info'>

                    <h3 v-if="$store.getters['download/currentDownload'].downloadProgress < 100" class='title'>
                        Downloading {{$store.getters['download/currentDownload'].modName}}
                    </h3>
                    <h3 v-else class='title'>
                        Installing {{$store.getters['download/currentDownload'].modName}}
                    </h3>

                    <p>Downloading: {{Math.floor($store.getters['download/currentDownload'].downloadProgress)}}% complete</p>

                    <Progress
                        :max='100'
                        :value="$store.getters['download/currentDownload'].downloadProgress"
                        :className="['is-dark']"
                    />

                    <p v-if="$store.getters['download/currentDownload'].installProgress">
                        Installing: {{Math.floor($store.getters['download/currentDownload'].installProgress)}}% complete
                    </p>
                    <p v-else>Installing: waiting for download to finish</p>

                    <Progress
                        :max='100'
                        :value="$store.getters['download/currentDownload'].installProgress"
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

<script lang="ts">

import { mixins } from "vue-class-component";
import { Component } from 'vue-property-decorator';

import { Progress } from '../all';
import ModalCard from '../ModalCard.vue';
import DownloadModVersionSelectModal from "../../components/views/DownloadModVersionSelectModal.vue";
import UpdateAllInstalledModsModal from "../../components/views/UpdateAllInstalledModsModal.vue";
import DownloadMixin from "../mixins/DownloadMixin.vue";
import R2Error from '../../model/errors/R2Error';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import ThunderstoreVersion from '../../model/ThunderstoreVersion';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ThunderstoreDownloaderProvider from '../../providers/ror2/downloading/ThunderstoreDownloaderProvider';

    @Component({
        components: {
            DownloadModVersionSelectModal,
            UpdateAllInstalledModsModal,
            ModalCard,
            Progress
        }
    })
    export default class DownloadModModal extends mixins(DownloadMixin) {

        async downloadHandler(tsMod: ThunderstoreMod, tsVersion: ThunderstoreVersion) {
            this.closeModal();

            const downloadId = await this.$store.dispatch(
                'download/addDownload',
                [`${tsMod.getName()} (${tsVersion.getVersionNumber().toString()})`]
            );

            this.setIsModProgressModalOpen(true);

            const tsCombo = new ThunderstoreCombo();
            tsCombo.setMod(tsMod);
            tsCombo.setVersion(tsVersion);

            setTimeout(async () => {
                let downloadedMods: ThunderstoreCombo[] = [];
                try {
                    downloadedMods = await ThunderstoreDownloaderProvider.instance.download(
                        this.profile.asImmutableProfile(),
                        tsCombo,
                        this.$store.state.download.ignoreCache,
                        (downloadProgress, modName, status, err) => {
                            this.$store.dispatch('download/downloadProgressCallback', { downloadId, downloadProgress, modName, status, err });
                        }
                    );
                } catch (e) {
                    this.setIsModProgressModalOpen(false);
                    this.$store.commit('download/updateDownload', { downloadId, failed: true });
                    this.$store.commit('error/handleError', R2Error.fromThrownValue(e));
                    return;
                }
                await this.downloadCompletedCallback(downloadedMods, downloadId);
                this.setIsModProgressModalOpen(false);
            }, 1);
        }
    }

</script>
