<template>
    <div>
        <div id='downloadProgressModal' :class="['modal', {'is-active':downloadingMod}]" v-if="$store.state.download.downloadObject !== null">
            <div class="modal-background" @click="downloadingMod = false;"></div>
            <div class='modal-content'>
                <div class='notification is-info'>
                    <h3 class='title'>Downloading {{$store.state.download.downloadObject.modName}}</h3>
                    <p>{{Math.floor($store.state.download.downloadObject.progress)}}% complete</p>
                    <Progress
                        :max='100'
                        :value='$store.state.download.downloadObject.progress'
                        :className="['is-dark']"
                    />
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="downloadingMod = false;"></button>
        </div>
        <DownloadModVersionSelectModal @download-mod="downloadHandler" />
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

import { mixins } from "vue-class-component";
import { Component } from 'vue-property-decorator';
import { Store } from "vuex";
import ThunderstoreMod from '../../model/ThunderstoreMod';
import ManifestV2 from '../../model/ManifestV2';
import ThunderstoreVersion from '../../model/ThunderstoreVersion';
import ThunderstoreDownloaderProvider from '../../providers/ror2/downloading/ThunderstoreDownloaderProvider';
import R2Error from '../../model/errors/R2Error';
import StatusEnum from '../../model/enums/StatusEnum';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ProfileInstallerProvider from '../../providers/ror2/installing/ProfileInstallerProvider';
import ProfileModList from '../../r2mm/mods/ProfileModList';
import Profile from '../../model/Profile';
import { Progress } from '../all';
import ConflictManagementProvider from '../../providers/generic/installing/ConflictManagementProvider';
import ModalCard from '../ModalCard.vue';
import { installModsAndResolveConflicts } from '../../utils/ProfileUtils';
import DownloadMixin from "../mixins/DownloadMixin.vue";
import DownloadModVersionSelectModal from "../../components/views/DownloadModVersionSelectModal.vue";

interface DownloadProgress {
    assignId: number;
    initialMods: string[];
    modName: string;
    progress: number;
    failed: boolean;
}

    @Component({
        components: {
            DownloadModVersionSelectModal,
            ModalCard,
            Progress
        }
    })
    export default class DownloadModModal extends mixins(DownloadMixin) {

        downloadingMod: boolean = false;

        get ignoreCache(): boolean {
            const settings = this.$store.getters['settings'];
            return settings.getContext().global.ignoreCache;
        }

        public static async downloadSpecific(
            profile: Profile,
            combo: ThunderstoreCombo,
            ignoreCache: boolean,
            store: Store<any>
        ): Promise<void> {
            return new Promise((resolve, reject) => {
                const tsMod = combo.getMod();
                const tsVersion = combo.getVersion();

                store.commit('download/increaseAssignId');
                const currentAssignId = store.state.download.assignId;

                const progressObject = {
                    progress: 0,
                    initialMods: [`${tsMod.getName()} (${tsVersion.getVersionNumber().toString()})`],
                    modName: '',
                    assignId: currentAssignId,
                    failed: false,
                };

                store.commit('download/pushDownloadObjectToAllVersions', {
                    assignId: currentAssignId,
                    downloadObject: progressObject
                });

                setTimeout(() => {
                    ThunderstoreDownloaderProvider.instance.download(profile.asImmutableProfile(), tsMod, tsVersion, ignoreCache, (progress: number, modName: string, status: number, err: R2Error | null) => {
                        const assignIndex = store.state.download.allVersions.findIndex(([number, val]: [number, DownloadProgress]) => number === currentAssignId);
                        if (status === StatusEnum.FAILURE) {
                            if (err !== null) {
                                const existing = store.state.download.allVersions[assignIndex]
                                existing[1].failed = true;
                                store.commit('download/updateDownloadObject', {
                                    assignId: assignIndex,
                                    downloadVersion: [currentAssignId, existing[1]]
                                });
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
                            store.commit('download/updateDownloadObject', {
                                assignId: assignIndex,
                                downloadVersion: [currentAssignId, obj]
                            });
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
                                const err = await ConflictManagementProvider.instance.resolveConflicts(modList, profile.asImmutableProfile());
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

        async downloadLatest() {
            this.closeModal();
            const modsWithUpdates: ThunderstoreCombo[] = await this.$store.dispatch('profile/getCombosWithUpdates');

            this.$store.commit('download/increaseAssignId');
            const currentAssignId = this.$store.state.download.assignId;

            const progressObject = {
                progress: 0,
                initialMods: modsWithUpdates.map(value => `${value.getMod().getName()} (${value.getVersion().toString()})`),
                modName: '',
                assignId: currentAssignId,
                failed: false,
            };
            this.$store.commit('download/setDownloadObject', progressObject);
            this.$store.commit('download/pushDownloadObjectToAllVersions', {
                assignId: currentAssignId,
                downloadObject: progressObject
            });
            this.downloadingMod = true;
            ThunderstoreDownloaderProvider.instance.downloadLatestOfAll(modsWithUpdates, this.ignoreCache, (progress: number, modName: string, status: number, err: R2Error | null) => {
                const assignIndex = this.$store.state.download.allVersions.findIndex(([number, val]: [number, DownloadProgress]) => number === currentAssignId);
                if (status === StatusEnum.FAILURE) {
                    if (err !== null) {
                        this.downloadingMod = false;
                        const existing = this.$store.state.download.allVersions[assignIndex];
                        existing[1].failed = true;
                        this.$store.commit('download/updateDownloadObject', {
                            assignId: assignIndex,
                            downloadVersion: [currentAssignId, existing[1]]
                        });
                        DownloadModModal.addSolutionsToError(err);
                        this.$store.commit('error/handleError', err);
                        return;
                    }
                } else if (status === StatusEnum.PENDING) {
                    const obj = {
                        progress: progress,
                        modName: modName,
                        initialMods: modsWithUpdates.map(value => `${value.getMod().getName()} (${value.getVersion().getVersionNumber().toString()})`),
                        assignId: currentAssignId,
                        failed: false,
                    }
                    if (this.$store.state.download.downloadObject!.assignId === currentAssignId) {
                        this.$store.commit('download/setDownloadObject', obj);
                    }
                    this.$store.commit('download/updateDownloadObject', {
                        assignId: assignIndex,
                        downloadVersion: [currentAssignId, obj]
                    });
                }
            }, this.downloadCompletedCallback);
        }

        downloadHandler(tsMod: ThunderstoreMod, tsVersion: ThunderstoreVersion) {
            this.closeModal();

            this.$store.commit('download/increaseAssignId');
            const currentAssignId = this.$store.state.download.assignId;

            const progressObject = {
                progress: 0,
                initialMods: [`${tsMod.getName()} (${tsVersion.getVersionNumber().toString()})`],
                modName: '',
                assignId: currentAssignId,
                failed: false,
            };
            this.$store.commit('download/setDownloadObject', progressObject);
            this.$store.commit('download/pushDownloadObjectToAllVersions', {
                assignId: currentAssignId,
                downloadObject: this.$store.state.download.downloadObject
            });
            this.downloadingMod = true;
            setTimeout(() => {
                ThunderstoreDownloaderProvider.instance.download(this.profile.asImmutableProfile(), tsMod, tsVersion, this.ignoreCache, (progress: number, modName: string, status: number, err: R2Error | null) => {
                    const assignIndex = this.$store.state.download.allVersions.findIndex(([number, val]: [number, DownloadProgress]) => number === currentAssignId);
                    if (status === StatusEnum.FAILURE) {
                        if (err !== null) {
                            this.downloadingMod = false;
                            const existing = this.$store.state.download.allVersions[assignIndex];
                            existing[1].failed = true;
                            this.$store.commit('download/updateDownloadObject', {
                                assignId: assignIndex,
                                downloadVersion: [currentAssignId, existing[1]]
                            });
                            DownloadModModal.addSolutionsToError(err);
                            this.$store.commit('error/handleError', err);
                            return;
                        }
                    } else if (status === StatusEnum.PENDING) {
                        const obj = {
                            progress: progress,
                            initialMods: [`${tsMod.getName()} (${tsVersion.getVersionNumber().toString()})`],
                            modName: modName,
                            assignId: currentAssignId,
                            failed: false,
                        }
                        if (this.$store.state.download.downloadObject!.assignId === currentAssignId) {
                            this.$store.commit('download/setDownloadObject', obj);
                        }
                        this.$store.commit('download/updateDownloadObject', {
                            assignId: assignIndex,
                            downloadVersion: [currentAssignId, obj]
                        });
                    }
                }, this.downloadCompletedCallback);
            }, 1);
        }

        async downloadCompletedCallback(downloadedMods: ThunderstoreCombo[]) {
            try {
                await installModsAndResolveConflicts(downloadedMods, this.profile.asImmutableProfile(), this.$store);
            } catch (e) {
                this.$store.commit('error/handleError', R2Error.fromThrownValue(e));
            }
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
