<template>
    <ModalCard :is-active="isOpen" :can-close="true" v-if="thunderstoreMod === null" @close-modal="closeModal()">
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
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";

import ModalCard from "../ModalCard.vue";
import DownloadMixin from "../mixins/DownloadMixin.vue";
import DownloadModVersionSelectModal from "../views/DownloadModVersionSelectModal.vue";
import ThunderstoreCombo from "../../model/ThunderstoreCombo";
import StatusEnum from "../../model/enums/StatusEnum";
import R2Error from "../../model/errors/R2Error";
import ThunderstoreDownloaderProvider from "../../providers/ror2/downloading/ThunderstoreDownloaderProvider";

@Component({
    components: {DownloadModVersionSelectModal, ModalCard}
})
export default class UpdateAllInstalledModsModal extends mixins(DownloadMixin)  {


    async updateAllToLatestVersion() {
        this.closeModal();
        const modsWithUpdates: ThunderstoreCombo[] = await this.$store.dispatch('profile/getCombosWithUpdates');

        const assignId = await this.$store.dispatch(
            'download/addDownload',
            modsWithUpdates.map(value => `${value.getMod().getName()} (${value.getVersion().getVersionNumber().toString()})`)
        );

        this.setIsModProgressModalOpen(true);
        ThunderstoreDownloaderProvider.instance.downloadLatestOfAll(modsWithUpdates, this.ignoreCache, (progress: number, modName: string, status: number, err: R2Error | null) => {
            try {
                if (status === StatusEnum.FAILURE) {
                    this.setIsModProgressModalOpen(false);
                    this.$store.commit('download/updateDownload', {assignId, failed: true});
                    if (err !== null) {
                        DownloadMixin.addSolutionsToError(err);
                        throw err;
                    }
                } else if (status === StatusEnum.PENDING) {
                    this.$store.commit('download/updateDownload', {assignId, progress, modName});
                }
            } catch (e) {
                this.$store.commit('error/handleError', R2Error.fromThrownValue(e));
            }
        }, async (downloadedMods) => {
            await this.downloadCompletedCallback(downloadedMods, assignId);
            this.setIsModProgressModalOpen(false);
        });
    }
}
</script>
