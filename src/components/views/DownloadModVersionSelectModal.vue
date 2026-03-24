<template>
    <ModalCard id="download-mod-version-select-modal" :is-active="isOpen" :can-close="true" v-if="thunderstoreMod !== null" @close-modal="closeModal()">
        <template v-slot:header>
            <h2 class='modal-title' v-if="thunderstoreMod !== null"> {{ $t('DownloadModVersionSelectModal.select_a_version_of') }} {{thunderstoreMod.getName()}} {{ $t('DownloadModVersionSelectModal.to_download') }} </h2>
        </template>
        <template v-slot:body>
            <p>{{ $t('DownloadModVersionSelectModal.it_s_recommended_to_select_the') }}</p>
            <p>{{ $t('DownloadModVersionSelectModal.using_outdated_versions_may_ca') }}</p>
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
                    <span class="tag is-dark" v-if='selectedVersion === null'> {{ $t('DownloadModVersionSelectModal.you_need_to_select_a_version') }} </span>
                    <span class="tag is-success" v-else-if='recommendedVersion === selectedVersion'>
                        {{selectedVersion}} {{ $t('DownloadModVersionSelectModal.is_the_recommended_version') }} </span>
                    <span class="tag is-success" v-else-if='versionNumbers[0] === selectedVersion'>
                        {{selectedVersion}} {{ $t('DownloadModVersionSelectModal.is_the_latest_version') }} </span>
                    <span class="tag is-danger" v-else-if='versionNumbers[0] !== selectedVersion'>
                        {{selectedVersion}} {{ $t('DownloadModVersionSelectModal.is_an_outdated_version') }} </span>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="downloadMod">{{ $t('DownloadModVersionSelectModal.download_with_dependencies') }}</button>
        </template>
    </ModalCard>
</template>

<script lang="ts" setup>
import ModalCard from "../ModalCard.vue";
import R2Error from "../../model/errors/R2Error";
import ManifestV2 from "../../model/ManifestV2";
import ThunderstoreVersion from "../../model/ThunderstoreVersion";
import { MOD_LOADER_VARIANTS } from "../../r2mm/installing/profile_installers/ModLoaderVariantRecord";
import * as PackageDb from "../../r2mm/manager/PackageDexieStore";
import ProfileModList from "../../r2mm/mods/ProfileModList";
import Game from '../../model/game/Game';
import { computed, ref, watch } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import ThunderstoreCombo from "../../model/ThunderstoreCombo";
import { InstallMode } from "../../utils/DependencyUtils";

const store = getStore<State>();

const versionNumbers = ref<string[]>([]);
const recommendedVersion = ref<string | null>(null);
const selectedVersion = ref<string | null>(null);
const currentVersion = ref<string | null>(null);

const isOpen = computed(() => store.state.modals.isDownloadModVersionSelectModalOpen);
const thunderstoreMod = computed(() => store.state.modals.downloadModalMod);

function closeModal() {
    store.commit("closeDownloadModVersionSelectModal");
}

watch(() => store.state.modals.downloadModalMod, async () => {
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

    downloadHandler(mod, version);
}

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
