<template>
    <div>
        <div id='downloadProgressModal' :class="['modal', {'is-active':downloadingMod}]" v-if="downloadObject !== null">
            <div class="modal-background" @click="downloadingMod = false;"></div>
            <div class='modal-content'>
                <div class='notification is-info'>
                    <h3 class='title'>{{ $t('views.download.downloading', {name: downloadObject.modName}) }}</h3>
                    <p>{{ $t('views.download.progress', {progress: Math.floor(downloadObject.progress)}) }}</p>
                    <Progress
                        :max='100'
                        :value='downloadObject.progress'
                        :className="['is-dark']"
                    />
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="downloadingMod = false;"></button>
        </div>
        <div id="downloadModal" :class="['modal', {'is-active': isOpen}]" v-if="thunderstoreMod !== null">
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-content">
                <div class='card'>
                    <header class="card-header">
                        <p class='card-header-title' v-if="thunderstoreMod !== null">
                            {{ $t('views.download.selectVersion', {name: thunderstoreMod.getName()}) }}
                        </p>
                    </header>
                    <div class='card-content'>
                        <p>{{ $t('views.download.recommended') }}</p>
                        <p>{{ $t('views.download.outdated') }}</p>
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
                                   {{ $t('views.download.need') }}
                                </span>
                                <span class="tag is-success" v-else-if='versionNumbers[0] === selectedVersion'>
                                    {{ $t('views.download.latestVersion', {version: selectedVersion}) }}
                                </span>
                                <span class="tag is-danger" v-else-if='versionNumbers[0] !== selectedVersion'>
                                    {{ $t('views.download.outdatedVersion', {version: selectedVersion}) }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class='card-footer'>
                        <button class="button is-info" @click="downloadThunderstoreMod()">
                            {{ $t('views.download.dependencies') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div id="updateAllModal" :class="['modal', {'is-active': isOpen}]" v-if="thunderstoreMod === null">
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-content">
                <div class='card'>
                    <header class="card-header">
                        <p class='card-header-title'>{{ $t('views.download.updateAll') }}</p>
                    </header>
                    <div class='card-content'>
                        <p>{{ $t('views.download.installed') }}</p>
                        <p>{{ $t('views.download.missing') }}</p>
                        <p>{{ $t('views.download.following') }}</p>
                        <br/>
                        <ul class="list">
                            <li class="list-item" v-for='(key, index) in $store.getters["profile/modsWithUpdates"]'
                                :key='`to-update-${index}-${key.getVersion().getFullName()}`'>
                                {{ $t('views.download.updatedTo', {name: key.getVersion().getName(), number: key.getVersion().getVersionNumber().toString()}) }}
                            </li>
                        </ul>
                    </div>
                    <div class='card-footer'>
                        <button class="button is-info" @click="downloadLatest()">{{ $t('views.download.update') }}</button>
                    </div>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeModal()"></button>
        </div>
    </div>
</template>

<script lang="ts">

import { Component, Vue, Watch } from 'vue-property-decorator';
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
import Game from '../../model/game/Game';
import ConflictManagementProvider from '../../providers/generic/installing/ConflictManagementProvider';

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
            Progress
        }
    })
    export default class DownloadModModal extends Vue {

        versionNumbers: string[] = [];
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

        public static async downloadSpecific(game: Game, profile: Profile, combo: ThunderstoreCombo, thunderstorePackages: ThunderstoreMod[]): Promise<void> {
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
                    ThunderstoreDownloaderProvider.instance.download(game, profile, tsMod, tsVersion, thunderstorePackages, (progress: number, modName: string, status: number, err: R2Error | null) => {
                        const assignIndex = DownloadModModal.allVersions.findIndex(([number, val]) => number === currentAssignId);
                        if (status === StatusEnum.FAILURE) {
                            if (err !== null) {
                                const existing = DownloadModModal.allVersions[assignIndex]
                                existing[1].failed = true;
                                DownloadModModal.allVersions[assignIndex] = [currentAssignId, existing[1]];
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
                            const modList = await ProfileModList.getModList(profile);
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

        get thunderstorePackages(): ThunderstoreMod[] {
            return this.$store.state.tsMods.mods;
        }

        @Watch('$store.state.modals.downloadModModalMod')
        async getModVersions() {
            this.currentVersion = null;
            if (this.thunderstoreMod !== null) {
                this.selectedVersion = this.thunderstoreMod.getVersions()[0].getVersionNumber().toString();
                this.versionNumbers = this.thunderstoreMod.getVersions()
                    .map(value => value.getVersionNumber().toString());

                const modListResult = await ProfileModList.getModList(this.profile);
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

        downloadThunderstoreMod() {
            const refSelectedThunderstoreMod: ThunderstoreMod | null = this.thunderstoreMod;
            const refSelectedVersion: string | null = this.selectedVersion;
            if (refSelectedThunderstoreMod === null || refSelectedVersion === null) {
                // Shouldn't happen, but shouldn't throw an error.
                return;
            }
            const version = refSelectedThunderstoreMod.getVersions()
                .find((modVersion: ThunderstoreVersion) => modVersion.getVersionNumber().toString() === refSelectedVersion);
            if (version === undefined) {
                return;
            }
            this.downloadHandler(refSelectedThunderstoreMod, version);
        }

        // TODO: rethink how this method and provider's downloadLatestOfAll()
        // access the active game, local mod list and TS mod list.
        async downloadLatest() {
            this.closeModal();
            const modsWithUpdates: ThunderstoreCombo[] = this.$store.getters['profile/modsWithUpdates'];
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
            ThunderstoreDownloaderProvider.instance.downloadLatestOfAll(this.activeGame, modsWithUpdates, this.thunderstorePackages, (progress: number, modName: string, status: number, err: R2Error | null) => {
                const assignIndex = DownloadModModal.allVersions.findIndex(([number, val]) => number === currentAssignId);
                if (status === StatusEnum.FAILURE) {
                    if (err !== null) {
                        this.downloadingMod = false;
                        const existing = DownloadModModal.allVersions[assignIndex]
                        existing[1].failed = true;
                        this.$set(DownloadModModal.allVersions, assignIndex, [currentAssignId, existing[1]]);
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
                    if (this.downloadObject!.assignId === currentAssignId) {
                        this.downloadObject = Object.assign({}, obj);
                    }
                    this.$set(DownloadModModal.allVersions, assignIndex, [currentAssignId, obj]);
                }
            }, this.downloadCompletedCallback);
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
                ThunderstoreDownloaderProvider.instance.download(this.activeGame, this.profile, tsMod, tsVersion, this.thunderstorePackages, (progress: number, modName: string, status: number, err: R2Error | null) => {
                    const assignIndex = DownloadModModal.allVersions.findIndex(([number, val]) => number === currentAssignId);
                    if (status === StatusEnum.FAILURE) {
                        if (err !== null) {
                            this.downloadingMod = false;
                            const existing = DownloadModModal.allVersions[assignIndex]
                            existing[1].failed = true;
                            this.$set(DownloadModModal.allVersions, assignIndex, [currentAssignId, existing[1]]);
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
                        if (this.downloadObject!.assignId === currentAssignId) {
                            this.downloadObject = Object.assign({}, obj);
                        }
                        this.$set(DownloadModModal.allVersions, assignIndex, [currentAssignId, obj]);
                    }
                }, this.downloadCompletedCallback);
            }, 1);
        }

        async downloadCompletedCallback(downloadedMods: ThunderstoreCombo[]) {
            ProfileModList.requestLock(async () => {
                for (const combo of downloadedMods) {
                    try {
                        await DownloadModModal.installModAfterDownload(this.profile, combo.getMod(), combo.getVersion());
                    } catch (e) {
                        this.downloadingMod = false;
                        const err = R2Error.fromThrownValue(e, `Failed to install mod [${combo.getMod().getFullName()}]`);
                        this.$store.commit('error/handleError', err);
                        return;
                    }
                }
                this.downloadingMod = false;
                const modList = await ProfileModList.getModList(this.profile);
                if (!(modList instanceof R2Error)) {
                    await this.$store.dispatch('profile/updateModList', modList);
                    const err = await ConflictManagementProvider.instance.resolveConflicts(modList, this.profile);
                    if (err instanceof R2Error) {
                        this.$store.commit('error/handleError', err);
                    }
                }
            });
        }

        static async installModAfterDownload(profile: Profile, mod: ThunderstoreMod, version: ThunderstoreVersion): Promise<R2Error | void> {
            return new Promise(async (resolve, reject) => {
                const manifestMod: ManifestV2 = new ManifestV2().fromThunderstoreMod(mod, version);
                const profileModList = await ProfileModList.getModList(profile);
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
                        const result = await ProfileInstallerProvider.instance.uninstallMod(manifestMod, profile);
                        if (result instanceof R2Error) {
                            return reject(result);
                        }
                    }
                    const installError: R2Error | null = await ProfileInstallerProvider.instance.installMod(manifestMod, profile);
                    if (!(installError instanceof R2Error)) {
                        const newModList: ManifestV2[] | R2Error = await ProfileModList.addMod(manifestMod, profile);
                        if (newModList instanceof R2Error) {
                            return reject(newModList);
                        }
                    } else {
                        return reject(installError);
                    }
                    if (olderInstallOfMod !== undefined) {
                        if (!olderInstallOfMod.isEnabled()) {
                            await ProfileModList.updateMod(manifestMod, profile, async mod => {
                                mod.disable();
                            });
                            await ProfileInstallerProvider.instance.disableMod(manifestMod, profile);
                        }
                    }
                }
                return resolve();
            });
        }
    }

</script>
