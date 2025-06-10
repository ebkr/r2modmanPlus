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

<script lang="ts" setup>
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
import { computed, ref, watch } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import ThunderstoreMod from '../../model/ThunderstoreMod';

const store = getStore<State>();

const {
    closeModal,
} = useDownloadComposable();

const emits = defineEmits<{
    (e: 'download-mod', mod: ThunderstoreMod, version: ThunderstoreVersion): void;
}>();

const versionNumbers = ref<string[]>([]);
const recommendedVersion = ref<string | null>(null);
const selectedVersion = ref<string | null>(null);
const currentVersion = ref<string | null>(null);

const isOpen = computed(() => store.state.modals.isDownloadModModalOpen);
const thunderstoreMod = computed(() => store.state.modals.downloadModModalMod);

watch(() => store.state.modals.downloadModModalMod, async () => {
    currentVersion.value = null;
    if (thunderstoreMod.value !== null) {
        const activeGame: Game = store.state.activeGame;
        selectedVersion.value = thunderstoreMod.value.getLatestVersion();
        recommendedVersion.value = null;

        versionNumbers.value = await PackageDb.getPackageVersionNumbers(
            activeGame.internalFolderName,
            thunderstoreMod.value.getFullName()
        );

        const foundRecommendedVersion = MOD_LOADER_VARIANTS[activeGame.internalFolderName]
            .find(value => value.packageName === thunderstoreMod.value!.getFullName());

        if (foundRecommendedVersion && foundRecommendedVersion.recommendedVersion) {
            recommendedVersion.value = foundRecommendedVersion.recommendedVersion.toString();

            // Auto-select recommended version if it's found.
            const recommendedVersionToSelect = versionNumbers.value.find(
                (ver) => ver === foundRecommendedVersion.recommendedVersion!.toString()
            );
            if (recommendedVersionToSelect) {
                selectedVersion.value = recommendedVersionToSelect;
            }
        }

        const modListResult = await ProfileModList.getModList(store.getters['profile/activeProfile'].asImmutableProfile());
        if (!(modListResult instanceof R2Error)) {
            const manifestMod = modListResult.find((local: ManifestV2) => local.getName() === thunderstoreMod.value!.getFullName());
            if (manifestMod !== undefined) {
                currentVersion.value = manifestMod.getVersionNumber().toString();
            }
        }
    }
});

async function downloadMod() {
    const mod = thunderstoreMod.value;
    const versionString = selectedVersion.value;
    if (mod === null || versionString === null) {
        // Shouldn't happen, but shouldn't throw an error.
        console.log(`Download initiated with null mod [${mod}] or version [${versionString}]`);
        return;
    }

    let version: ThunderstoreVersion;
    const activeGame: Game = store.state.activeGame;

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

    emits("download-mod", mod, version); // Delegate to DownloadModModal.
}

</script>
