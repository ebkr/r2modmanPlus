
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

<script lang="ts">
import { Component } from 'vue-property-decorator';

import ModalCard from "../ModalCard.vue";
import * as DownloadUtils from "../../utils/DownloadUtils";
import DownloadModVersionSelectModal from "../views/DownloadModVersionSelectModal.vue";
import ThunderstoreCombo from "../../model/ThunderstoreCombo";
import StatusEnum from "../../model/enums/StatusEnum";
import R2Error from "../../model/errors/R2Error";
import ThunderstoreDownloaderProvider from "../../providers/ror2/downloading/ThunderstoreDownloaderProvider";
import { useDownloadComposable } from '../composables/DownloadComposable';
import Vue from 'vue';

@Component({
    components: {DownloadModVersionSelectModal, ModalCard}
})
export default class UpdateAllInstalledModsModal extends Vue {

    get isOpen(): boolean {
        const { isOpen } = useDownloadComposable();
        return isOpen.value;
    }

     get closeModal() {
        const { closeModal } = useDownloadComposable();
        return closeModal;
    }

    get setIsModProgressModalOpen() {
         const { setIsModProgressModalOpen } = useDownloadComposable();
         return setIsModProgressModalOpen;
    }

    get downloadCompletedCallback() {
         const { downloadCompletedCallback } = useDownloadComposable();
         return downloadCompletedCallback;
    }

    get thunderstoreMod() {
        const { thunderstoreMod } = useDownloadComposable();
        return thunderstoreMod.value;
    }

    async updateAllToLatestVersion() {
        this.closeModal();
        const modsWithUpdates: ThunderstoreCombo[] = await this.$store.dispatch('profile/getCombosWithUpdates');

        const downloadId = await this.$store.dispatch(
            'download/addDownload',
            modsWithUpdates.map(value => `${value.getMod().getName()} (${value.getVersion().getVersionNumber().toString()})`)
        );

        const ignoreCache = this.$store.state.download.ignoreCache;
        this.setIsModProgressModalOpen(true);
        ThunderstoreDownloaderProvider.instance.downloadLatestOfAll(modsWithUpdates, ignoreCache, (downloadProgress: number, modName: string, status: number, err: R2Error | null) => {
            try {
                if (status === StatusEnum.FAILURE) {
                    this.setIsModProgressModalOpen(false);
                    this.$store.commit('download/setFailed', downloadId);
                    if (err !== null) {
                        DownloadUtils.addSolutionsToError(err);
                        throw err;
                    }
                } else if (status === StatusEnum.PENDING) {
                    this.$store.commit('download/updateDownload', {downloadId, modName, downloadProgress});
                }
            } catch (e) {
                this.$store.commit('error/handleError', R2Error.fromThrownValue(e));
            }
        }, async (downloadedMods) => {
            await this.downloadCompletedCallback(downloadedMods, downloadId);
            this.setIsModProgressModalOpen(false);
        });
    }
}
</script>
