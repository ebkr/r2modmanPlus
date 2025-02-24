<template>
    <div>
        <div id='downloadProgressModal' :class="['modal', {'is-active':$store.state.download.isModProgressModalOpen}]" v-if="$store.getters['download/currentDownload'] !== null">
            <div class="modal-background" @click="setIsModProgressModalOpen(false);"></div>
            <div class='modal-content'>
                <div class='notification is-info'>
                    <h3 class='title'>Downloading {{$store.getters['download/currentDownload'].modName}}</h3>
                    <p>{{Math.floor($store.getters['download/currentDownload'].progress)}}% complete</p>
                    <Progress
                        :max='100'
                        :value="$store.getters['download/currentDownload'].progress"
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
import StatusEnum from '../../model/enums/StatusEnum';
import R2Error from '../../model/errors/R2Error';
import ManifestV2 from '../../model/ManifestV2';
import Profile from '../../model/Profile';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import ThunderstoreVersion from '../../model/ThunderstoreVersion';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ConflictManagementProvider from '../../providers/generic/installing/ConflictManagementProvider';
import ProfileInstallerProvider from '../../providers/ror2/installing/ProfileInstallerProvider';
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

        public static async downloadSpecific(
            profile: Profile,
            combo: ThunderstoreCombo,
            ignoreCache: boolean,
            store: Store<any>
        ): Promise<void> {
            return new Promise(async (resolve, reject) => {

                const assignId = await store.dispatch(
                    'download/addDownload',
                    [`${combo.getMod().getName()} (${combo.getVersion().getVersionNumber().toString()})`]
                );

                setTimeout(async () => {
                    let downloadedMods: ThunderstoreCombo[] = [];
                    try {
                        downloadedMods = await ThunderstoreDownloaderProvider.instance.download(
                            profile.asImmutableProfile(),
                            combo,
                            ignoreCache,
                            (progress: number, modName: string, status: number, err: R2Error | null) => {
                                try {
                                    DownloadModModal.downloadProgressCallback(store, assignId, progress, modName, status, err);
                                } catch (e) {
                                    reject(e);
                                }
                            }
                        );
                    } catch (e) {
                        return reject(e);
                    }
                    await ProfileModList.requestLock(async () => {
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
                }, 1);
            });
        }

        static downloadProgressCallback(store: Store<any>, assignId: number, progress: number, modName: string, status: number, err: R2Error | null) {
            if (status === StatusEnum.FAILURE) {
                store.commit('download/updateDownload', {assignId, failed: true});
                if (err !== null) {
                    DownloadMixin.addSolutionsToError(err);
                    throw err;
                }
            } else if (status === StatusEnum.PENDING) {
                store.commit('download/updateDownload', {assignId, progress, modName});
            }
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
                        this.ignoreCache,
                        (progress, modName, status, err) => { this.downloadProgressCallback(assignId, progress, modName, status, err); }
                    );
                } catch (e) {
                    this.setIsModProgressModalOpen(false);
                    this.$store.commit('error/handleError', R2Error.fromThrownValue(e));
                    return;
                }
                await this.downloadCompletedCallback(downloadedMods);
                this.setIsModProgressModalOpen(false);
            }, 1);

        }

        downloadProgressCallback(assignId: number, progress: number, modName: string, status: number, err: R2Error | null) {
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
        };

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
    }

</script>
