
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
import { mixins } from 'vue-class-component';
import { Component } from 'vue-property-decorator';

import ModalCard from "../ModalCard.vue";
import DownloadModVersionSelectModal from "../views/DownloadModVersionSelectModal.vue";
import ThunderstoreCombo from "../../model/ThunderstoreCombo";
import DownloadMixin from '../mixins/DownloadMixin.vue';

@Component({
    components: {DownloadModVersionSelectModal, ModalCard}
})
export default class UpdateAllInstalledModsModal extends mixins(DownloadMixin) {

    async updateAllToLatestVersion() {
        this.closeModal();
        const combos: ThunderstoreCombo[] = await this.$store.dispatch('profile/getCombosWithUpdates');
        this.setIsModProgressModalOpen(true);
        await this.$store.dispatch('download/downloadAndInstallCombos', {combos, profile: this.profile.asImmutableProfile(), game: this.activeGame})
    }
}
</script>
