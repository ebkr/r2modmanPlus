<template>
    <ModalCard id="download-mod-version-select-modal" :is-active="isOpen" :can-close="true" v-if="thunderstoreMod !== null" @close-modal="closeModal()">
        <template v-slot:header>
            <h2 class='modal-title' v-if="thunderstoreMod !== null">
                Select a version of {{thunderstoreMod.getName()}} to download
            </h2>
        </template>
        <template v-slot:body>
            <p>It's recommended to select the latest version of all mods.</p>
            <p>Using outdated versions may cause problems.</p>
            <br/>
            <div class="columns is-vcentered">
                <template v-if="currentVersion !== null">
                    <div class="column is-narrow">
                        <select class="select" disabled="true">
                            <option selected>
                                {{currentVersion}}
                            </option>
                        </select>
                    </div>
                    <div class="column is-narrow">
                        <span class="margin-right margin-right--half-width"><span class="margin-right margin-right--half-width"/> <i class='fas fa-long-arrow-alt-right'></i></span>
                    </div>
                </template>
                <div class="column is-narrow">
                    <select class='select' v-model="selectedVersion">
                        <option v-for='(value, index) in versionNumbers' :key='index' :value='value'>
                            {{value}}
                        </option>
                    </select>
                </div>
                <div class="column is-narrow">
                    <span class="tag is-dark" v-if='selectedVersion === null'>
                        You need to select a version
                    </span>
                    <span class="tag is-success" v-else-if='recommendedVersion === selectedVersion'>
                        {{selectedVersion}} is the recommended version
                    </span>
                    <span class="tag is-success" v-else-if='versionNumbers[0] === selectedVersion'>
                        {{selectedVersion}} is the latest version
                    </span>
                    <span class="tag is-danger" v-else-if='versionNumbers[0] !== selectedVersion'>
                        {{selectedVersion}} is an outdated version
                    </span>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="downloadMod">Download with dependencies</button>
        </template>
    </ModalCard>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import ModalCard from "../ModalCard.vue";
import R2Error from "../../model/errors/R2Error";
import ManifestV2 from "../../model/ManifestV2";
import ThunderstoreVersion from "../../model/ThunderstoreVersion";
import { MOD_LOADER_VARIANTS } from "../../r2mm/installing/profile_installers/ModLoaderVariantRecord";
import * as PackageDb from "../../r2mm/manager/PackageDexieStore";
import ProfileModList from "../../r2mm/mods/ProfileModList";
import { useDownloadComposable } from '../composables/DownloadComposable';
import Game from '../../model/game/Game';

@Component({
    components: {
        ModalCard
    },
})
export default class DownloadModVersionSelectModal extends Vue {
    versionNumbers: string[] = [];
    recommendedVersion: string | null = null;
    selectedVersion: string | null = null;
    currentVersion: string | null = null;

    get closeModal() {
        const { closeModal } = useDownloadComposable();
        return closeModal;
    }

    get isOpen(): boolean {
        const { isOpen } = useDownloadComposable();
        return isOpen.value;
    }

    get thunderstoreMod() {
        const { thunderstoreMod } = useDownloadComposable();
        return thunderstoreMod.value;
    }

    @Watch("$store.state.modals.downloadModModalMod")
    async updateModVersionState() {
        this.currentVersion = null;
        if (this.thunderstoreMod !== null) {
            const activeGame: Game = this.$store.state.activeGame;
            this.selectedVersion = this.thunderstoreMod.getLatestVersion();
            this.recommendedVersion = null;

            this.versionNumbers = await PackageDb.getPackageVersionNumbers(
                activeGame.internalFolderName,
                this.thunderstoreMod.getFullName()
            );

            const foundRecommendedVersion = MOD_LOADER_VARIANTS[activeGame.internalFolderName]
                .find(value => value.packageName === this.thunderstoreMod!.getFullName());

            if (foundRecommendedVersion && foundRecommendedVersion.recommendedVersion) {
                this.recommendedVersion = foundRecommendedVersion.recommendedVersion.toString();

                // Auto-select recommended version if it's found.
                const recommendedVersion = this.versionNumbers.find(
                    (ver) => ver === foundRecommendedVersion.recommendedVersion!.toString()
                );
                if (recommendedVersion) {
                    this.selectedVersion = recommendedVersion;
                }
            }

            const modListResult = await ProfileModList.getModList(this.$store.getters['profile/activeProfile'].asImmutableProfile());
            if (!(modListResult instanceof R2Error)) {
                const manifestMod = modListResult.find((local: ManifestV2) => local.getName() === this.thunderstoreMod!.getFullName());
                if (manifestMod !== undefined) {
                    this.currentVersion = manifestMod.getVersionNumber().toString();
                }
            }
        }
    }

    async downloadMod() {
        const mod = this.thunderstoreMod;
        const versionString = this.selectedVersion;
        if (mod === null || versionString === null) {
            // Shouldn't happen, but shouldn't throw an error.
            console.log(`Download initiated with null mod [${mod}] or version [${versionString}]`);
            return;
        }

        let version: ThunderstoreVersion;
        const activeGame: Game = this.$store.state.activeGame;

        try {
            version = await PackageDb.getVersionAsThunderstoreVersion(
                activeGame.internalFolderName,
                mod.getFullName(),
                versionString
            );
        } catch {
            console.log(`Failed to get version [${versionString}] for mod [${mod.getFullName()}]`);
            return;
        }

        this.$emit("download-mod", mod, version);  // Delegate to DownloadModModal.
    }
}

</script>
