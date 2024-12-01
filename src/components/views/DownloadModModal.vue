<template>
    <div>
        <div id='downloadProgressModal' :class="['modal', {'is-active':downloadingMod}]" v-if="downloadObject !== null">
            <div class="modal-background" @click="downloadingMod = false;"></div>
            <div class='modal-content'>
                <div class='notification is-info'>
                    <h3 class='title'>Downloading {{downloadObject.modName}}</h3>
                    <p>{{Math.floor(downloadObject.progress)}}% complete</p>
                    <Progress
                        :max='100'
                        :value='downloadObject.progress'
                        :className="['is-dark']"
                    />
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="downloadingMod = false;"></button>
        </div>
        <ModalCard :is-active="isOpen" :can-close="true" v-if="thunderstoreMod !== null" @close-modal="closeModal()">
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
                        <select class='select' v-model='selectedVersion'>
                            <option v-for='(value, index) in versionNumbers' :key='index' v-bind:value='value'>
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
                <button class="button is-info" @click="downloadThunderstoreMod()">Download with dependencies</button>
            </template>
        </ModalCard>
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
                <button class="button is-info" @click="downloadLatest()">Update all</button>
            </template>
        </ModalCard>
    </div>
</template>

<script lang="ts">

import { Component, Vue, Watch } from 'vue-property-decorator';
import StatusEnum from '../../model/enums/StatusEnum';
import R2Error from '../../model/errors/R2Error';
import Game from '../../model/game/Game';
import ManifestV2 from '../../model/ManifestV2';
import Profile from '../../model/Profile';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import ThunderstoreVersion from '../../model/ThunderstoreVersion';
import ConflictManagementProvider from '../../providers/generic/installing/ConflictManagementProvider';
import ThunderstoreDownloaderProvider from '../../providers/ror2/downloading/ThunderstoreDownloaderProvider';
import ProfileInstallerProvider from '../../providers/ror2/installing/ProfileInstallerProvider';
import { MOD_LOADER_VARIANTS } from '../../r2mm/installing/profile_installers/ModLoaderVariantRecord';
import * as PackageDb from '../../r2mm/manager/PackageDexieStore';
import ProfileModList from '../../r2mm/mods/ProfileModList';
import * as ModDownloadUtils from "../../utils/ModDownloadUtils";
import { Progress } from '../all';
import ModalCard from '../ModalCard.vue';

interface DownloadProgress {
    assignId: number;
    initialMods: string[];
    modName: string;
    progress: number;
    failed: boolean;
}

let assignId = 0;

    @Component({
        components: {
            ModalCard,
            Progress
        }
    })
    export default class DownloadModModal extends Vue {

        versionNumbers: string[] = [];
        recommendedVersion: string | null = null;
        downloadObject: DownloadProgress | null = null;
        downloadingMod: boolean = false;
        selectedVersion: string | null = null;
        currentVersion: string | null = null;

        static allVersions: [number, DownloadProgress][] = [];

        get activeGame(): Game {
            return this.$store.state.activeGame;
        }

        get profile(): Profile {
            return this.$store.getters['profile/activeProfile'];
        }

        get ignoreCache(): boolean {
            const settings = this.$store.getters['settings'];
            return settings.getContext().global.ignoreCache;
        }

        setDownloadObject(downloadObject: DownloadProgress | null) {
            this.downloadObject = downloadObject;
        }

        setDownloadingMod(downloadingMod: boolean) {
            this.downloadingMod = downloadingMod;
        }

        public static async downloadSpecific(
            profile: Profile,
            combo: ThunderstoreCombo,
            ignoreCache: boolean
        ): Promise<void> {
            return new Promise((resolve, reject) => {
                const tsMod = combo.getMod();
                const tsVersion = combo.getVersion();
                const currentAssignId = assignId++;
                const progressObject = {
                    progress: 0,
                    initialMods: [`${tsMod.getName()} (${tsVersion.getVersionNumber().toString()})`],
                    modName: '',
                    assignId: currentAssignId,
                    failed: false,
                };
                DownloadModModal.allVersions.push([currentAssignId, progressObject]);
                setTimeout(() => {
                    ThunderstoreDownloaderProvider.instance.download(profile.asImmutableProfile(), tsMod, tsVersion, ignoreCache, (progress: number, modName: string, status: number, err: R2Error | null) => {
                        const assignIndex = DownloadModModal.allVersions.findIndex(([number, val]) => number === currentAssignId);
                        if (status === StatusEnum.FAILURE) {
                            if (err !== null) {
                                const existing = DownloadModModal.allVersions[assignIndex]
                                existing[1].failed = true;
                                DownloadModModal.allVersions[assignIndex] = [currentAssignId, existing[1]];
                                DownloadModModal.addSolutionsToError(err);
                                return reject(err);
                            }
                        } else if (status === StatusEnum.PENDING) {
                            const obj = {
                                progress: progress,
                                initialMods: [`${tsMod.getName()} (${tsVersion.getVersionNumber().toString()})`],
                                modName: modName,
                                assignId: currentAssignId,
                                failed: false,
                            }
                            DownloadModModal.allVersions[assignIndex] = [currentAssignId, obj];
                        }
                    }, async (downloadedMods: ThunderstoreCombo[]) => {
                        ProfileModList.requestLock(async () => {
                            for (const combo of downloadedMods) {
                                try {
                                    await DownloadModModal.installModAfterDownload(profile, combo.getMod(), combo.getVersion());
                                } catch (e) {
                                    return reject(
                                        R2Error.fromThrownValue(e, `Failed to install mod [${combo.getMod().getFullName()}]`)
                                    );
                                }
                            }
                            const modList = await ProfileModList.getModList(profile.asImmutableProfile());
                            if (!(modList instanceof R2Error)) {
                                const err = await ConflictManagementProvider.instance.resolveConflicts(modList, profile);
                                if (err instanceof R2Error) {
                                    return reject(err);
                                }
                            }
                            return resolve();
                        });
                    });
                }, 1);
            });
        }

        get thunderstoreMod(): ThunderstoreMod | null {
            return this.$store.state.modals.downloadModModalMod;
        }

        get isOpen(): boolean {
            return this.$store.state.modals.isDownloadModModalOpen;
        }

        @Watch('$store.state.modals.downloadModModalMod')
        async getModVersions() {
            this.currentVersion = null;
            if (this.thunderstoreMod !== null) {
                this.selectedVersion = this.thunderstoreMod.getLatestVersion();
                this.recommendedVersion = null;

                this.versionNumbers = await PackageDb.getPackageVersionNumbers(
                    this.activeGame.internalFolderName,
                    this.thunderstoreMod.getFullName()
                );

                const foundRecommendedVersion = MOD_LOADER_VARIANTS[this.activeGame.internalFolderName]
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

                const modListResult = await ProfileModList.getModList(this.profile.asImmutableProfile());
                if (!(modListResult instanceof R2Error)) {
                    const manifestMod = modListResult.find((local: ManifestV2) => local.getName() === this.thunderstoreMod!.getFullName());
                    if (manifestMod !== undefined) {
                        this.currentVersion = manifestMod.getVersionNumber().toString();
                    }
                }
            }
        }

        closeModal() {
            this.$store.commit("closeDownloadModModal");
        }

        async downloadThunderstoreMod() {
            const refSelectedThunderstoreMod: ThunderstoreMod | null = this.thunderstoreMod;
            const refSelectedVersion: string | null = this.selectedVersion;
            if (refSelectedThunderstoreMod === null || refSelectedVersion === null) {
                // Shouldn't happen, but shouldn't throw an error.
                return;
            }

            let version: ThunderstoreVersion;

            try {
                version = await PackageDb.getVersionAsThunderstoreVersion(
                    this.activeGame.internalFolderName,
                    refSelectedThunderstoreMod.getFullName(),
                    refSelectedVersion
                );
            } catch {
                return;
            }

            this.downloadHandler(refSelectedThunderstoreMod, version);
        }

        async downloadLatest() {
            this.closeModal();
            const modsWithUpdates: ThunderstoreCombo[] = await this.$store.dispatch('profile/getCombosWithUpdates');
            const currentAssignId = assignId++;
            const progressObject = {
                progress: 0,
                initialMods: modsWithUpdates.map(value => `${value.getMod().getName()} (${value.getVersion().toString()})`),
                modName: '',
                assignId: currentAssignId,
                failed: false,
            };
            this.downloadObject = progressObject;
            DownloadModModal.allVersions.push([currentAssignId, this.downloadObject]);
            this.downloadingMod = true;
            ThunderstoreDownloaderProvider.instance.downloadLatestOfAll(
                modsWithUpdates,
                this.ignoreCache,
                (progress, modName, status, err) => { ModDownloadUtils.downloadProgressCallback(
                    currentAssignId,
                    progress,
                    modName,
                    status,
                    err,
                    modsWithUpdates.map(value => `${value.getMod().getName()} (${value.getVersion().getVersionNumber().toString()})`),
                    this.downloadObject,
                    this.setDownloadObject,
                    this.setDownloadingMod,
                    (assignIndex: string | number, value: any) => this.$set(DownloadModModal.allVersions, assignIndex, [currentAssignId, value]),
                    DownloadModModal.allVersions
                )},
                this.downloadCompletedCallback
            );
        }

        downloadHandler(tsMod: ThunderstoreMod, tsVersion: ThunderstoreVersion) {
            this.closeModal();
            const currentAssignId = assignId++;
            const progressObject = {
                progress: 0,
                initialMods: [`${tsMod.getName()} (${tsVersion.getVersionNumber().toString()})`],
                modName: '',
                assignId: currentAssignId,
                failed: false,
            };
            this.downloadObject = progressObject;
            DownloadModModal.allVersions.push([currentAssignId, this.downloadObject]);
            this.downloadingMod = true;
            setTimeout(() => {
                ThunderstoreDownloaderProvider.instance.download(
                    this.profile.asImmutableProfile(),
                    tsMod,
                    tsVersion,
                    this.ignoreCache,
                    (progress, modName, status, err) => { ModDownloadUtils.downloadProgressCallback(
                        currentAssignId,
                        progress,
                        modName,
                        status,
                        err,
                        [`${tsMod.getName()} (${tsVersion.getVersionNumber().toString()})`],
                        this.downloadObject,
                        this.setDownloadObject,
                        this.setDownloadingMod,
                        (assignIndex: string | number, value: any) => this.$set(DownloadModModal.allVersions, assignIndex, [currentAssignId, value]),
                        DownloadModModal.allVersions
                    ) },
                    this.downloadCompletedCallback
                );
            }, 1);
        }

        async downloadCompletedCallback(downloadedMods: ThunderstoreCombo[]) {
            await ModDownloadUtils.downloadCompletedCallback(this.profile, downloadedMods, this.$store);
            this.downloadingMod = false;
        }

        static async installModAfterDownload(profile: Profile, mod: ThunderstoreMod, version: ThunderstoreVersion): Promise<R2Error | void> {
            return new Promise(async (resolve, reject) => {
                const manifestMod: ManifestV2 = new ManifestV2().fromThunderstoreMod(mod, version);
                const profileModList = await ProfileModList.getModList(profile.asImmutableProfile());
                if (profileModList instanceof R2Error) {
                    return reject(profileModList);
                }
                const modAlreadyInstalled = profileModList.find(
                    value => value.getName() === mod.getFullName()
                        && value.getVersionNumber().isEqualTo(version.getVersionNumber())
                );

                if (modAlreadyInstalled === undefined || !modAlreadyInstalled) {
                    const resolvedAuthorModNameString = `${manifestMod.getAuthorName()}-${manifestMod.getDisplayName()}`;
                    const olderInstallOfMod = profileModList.find(value => `${value.getAuthorName()}-${value.getDisplayName()}` === resolvedAuthorModNameString);
                    if (manifestMod.getName().toLowerCase() !== 'bbepis-bepinexpack') {
                        const result = await ProfileInstallerProvider.instance.uninstallMod(manifestMod, profile.asImmutableProfile());
                        if (result instanceof R2Error) {
                            return reject(result);
                        }
                    }
                    const installError: R2Error | null = await ProfileInstallerProvider.instance.installMod(manifestMod, profile.asImmutableProfile());
                    if (!(installError instanceof R2Error)) {
                        const newModList: ManifestV2[] | R2Error = await ProfileModList.addMod(manifestMod, profile.asImmutableProfile());
                        if (newModList instanceof R2Error) {
                            return reject(newModList);
                        }
                    } else {
                        return reject(installError);
                    }
                    if (olderInstallOfMod !== undefined) {
                        if (!olderInstallOfMod.isEnabled()) {
                            await ProfileModList.updateMod(manifestMod, profile.asImmutableProfile(), async mod => {
                                mod.disable();
                            });
                            await ProfileInstallerProvider.instance.disableMod(manifestMod, profile.asImmutableProfile());
                        }
                    }
                }
                return resolve();
            });
        }

        static addSolutionsToError(err: R2Error): void {
            // Sanity check typing.
            if (!(err instanceof R2Error)) {
                return;
            }

            if (
                err.name.includes("Failed to download mod") ||
                err.name.includes("System.Net.WebException")
            ) {
                err.solution = "Try toggling the preferred Thunderstore CDN in the settings";
            }

            if (err.message.includes("System.IO.PathTooLongException")) {
                err.solution = 'Using "Change data folder" option in the settings to select a shorter path might solve the issue';
            }
        }
    }

</script>
