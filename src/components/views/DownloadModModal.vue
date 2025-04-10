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
import { Store } from "vuex";

import { Progress } from '../all';
import ModalCard from '../ModalCard.vue';
import DownloadModVersionSelectModal from "../../components/views/DownloadModVersionSelectModal.vue";
import UpdateAllInstalledModsModal from "../../components/views/UpdateAllInstalledModsModal.vue";
import DownloadMixin from "../mixins/DownloadMixin.vue";
import R2Error, { throwForR2Error } from '../../model/errors/R2Error';
import ManifestV2 from "../../model/ManifestV2";
import { ImmutableProfile } from '../../model/Profile';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import ThunderstoreVersion from '../../model/ThunderstoreVersion';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ConflictManagementProvider from '../../providers/generic/installing/ConflictManagementProvider';
import ThunderstoreDownloaderProvider from '../../providers/ror2/downloading/ThunderstoreDownloaderProvider';
import ProfileModList from '../../r2mm/mods/ProfileModList';

    @Component({
        components: {
            DownloadModVersionSelectModal,
            UpdateAllInstalledModsModal,
            ModalCard,
            Progress
        }
    })
    export default class DownloadModModal extends mixins(DownloadMixin) {

        public static async downloadAndInstallSpecific(
            profile: ImmutableProfile,
            combo: ThunderstoreCombo,
            store: Store<any>
        ): Promise<void> {
            const assignId = await store.dispatch(
                'download/addDownload',
                [`${combo.getMod().getName()} (${combo.getVersion().getVersionNumber().toString()})`]
            );

            let downloadedMods: ThunderstoreCombo[] = [];
            try {
                downloadedMods = await ThunderstoreDownloaderProvider.instance.download(
                    profile,
                    combo,
                    store.state.download.ignoreCache,
                    (downloadProgress: number, modName: string, status: number, err: R2Error | null) => {
                        try {
                            DownloadMixin.downloadProgressCallback(store, assignId, downloadProgress, modName, status, err);
                        } catch (e) {
                            throw e;
                        }
                    }
                );
                await this.installSpecific(downloadedMods, assignId, profile, store);
            } catch (e) {
                store.commit('download/updateDownload', { assignId, failed: true });
                throw e;
            }
        }

        static async installSpecific(
            downloadedMods: ThunderstoreCombo[],
            assignId: number,
            profile: ImmutableProfile,
            store: Store<any>
        ): Promise<void> {
            await ProfileModList.requestLock(async () => {
                let currentDownloadIndex = 0;
                for (const combo of downloadedMods) {
                    try {
                        await store.dispatch('download/installModAfterDownload', {profile, combo});
                    } catch (e) {
                        throw R2Error.fromThrownValue(e, `Failed to install mod [${combo.getMod().getFullName()}]`);
                    }
                    store.commit('download/updateDownload', {
                        assignId,
                        modName: combo.getMod().getName(),
                        installProgress: ThunderstoreDownloaderProvider.instance.generateProgressPercentage(100, currentDownloadIndex, downloadedMods.length)
                    });
                    currentDownloadIndex++;
                }

                const modList = await ProfileModList.getModList(profile);
                throwForR2Error(modList);
                throwForR2Error(await ConflictManagementProvider.instance.resolveConflicts((modList as ManifestV2[]), profile));
            });

        }

        async downloadHandler(tsMod: ThunderstoreMod, tsVersion: ThunderstoreVersion) {
            this.closeModal();

            const assignId = await this.$store.dispatch(
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
                            DownloadMixin.downloadProgressCallback(
                                this.$store,
                                assignId,
                                downloadProgress,
                                modName,
                                status,
                                err,
                                () => this.setIsModProgressModalOpen(false)
                            );
                        }
                    );
                } catch (e) {
                    this.setIsModProgressModalOpen(false);
                    this.$store.commit('download/updateDownload', { assignId, failed: true });
                    this.$store.commit('error/handleError', R2Error.fromThrownValue(e));
                    return;
                }
                await this.downloadCompletedCallback(downloadedMods, assignId);
                this.setIsModProgressModalOpen(false);
            }, 1);
        }
    }

</script>
