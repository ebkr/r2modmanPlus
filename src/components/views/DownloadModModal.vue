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
        <div id="downloadModal" :class="['modal', {'is-active':showDownloadModal}]" v-if="!updateAllMods">
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-content">
                <div class='card'>
                    <header class="card-header">
                        <p class='card-header-title' v-if="thunderstoreMod !== null">Select a version of
                            {{thunderstoreMod.getName()}} to download
                        </p>
                    </header>
                    <div class='card-content'>
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
                                    <span>&nbsp;&nbsp;<i class='fas fa-long-arrow-alt-right'></i>&nbsp;&nbsp;</span>
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
                                <span class="tag is-success" v-else-if='versionNumbers[0] === selectedVersion'>
                                    {{selectedVersion}} is the latest version
                                </span>
                                <span class="tag is-danger" v-else-if='versionNumbers[0] !== selectedVersion'>
                                    {{selectedVersion}} is an outdated version
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class='card-footer'>
                        <button class="button is-info" @click="downloadThunderstoreMod()">Download with dependencies
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div id="updateAllModal" :class="['modal', {'is-active':showDownloadModal}]" v-if="updateAllMods">
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-content">
                <div class='card'>
                    <header class="card-header">
                        <p class='card-header-title'>Update all installed mods</p>
                    </header>
                    <div class='card-content'>
                        <p>All installed mods will be updated to their latest versions.</p>
                        <p>Any missing dependencies will be installed.</p>
                    </div>
                    <div class='card-footer'>
                        <button class="button is-info" @click="downloadLatest()">Update all</button>
                    </div>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeModal()"></button>
        </div>
    </div>
</template>

<script lang="ts">

    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import ThunderstoreMod from '../../model/ThunderstoreMod';
    import ManifestV2 from '../../model/ManifestV2';
    import ThunderstoreVersion from '../../model/ThunderstoreVersion';
    import BetterThunderstoreDownloader from '../../r2mm/downloading/BetterThunderstoreDownloader';
    import R2Error from '../../model/errors/R2Error';
    import StatusEnum from '../../model/enums/StatusEnum';
    import ThunderstoreCombo from '../../model/ThunderstoreCombo';
    import ThunderstorePackages from '../../r2mm/data/ThunderstorePackages';
    import ProfileInstaller from '../../r2mm/installing/ProfileInstaller';
    import ProfileModList from '../../r2mm/mods/ProfileModList';
    import ModBridge from '../../r2mm/mods/ModBridge';
    import { ipcRenderer } from 'electron';
    import Profile from '../../model/Profile';
    import { Progress } from '../all';

    let assignId = 0;

    @Component({
        components: {
            Progress
        }
    })
    export default class DownloadModModal extends Vue {

        versionNumbers: string[] = [];
        downloadObject: any | null = null;
        downloadingMod: boolean = false;
        selectedVersion: string | null = null;
        currentVersion: string | null = null;


        @Prop()
        thunderstoreMod: ThunderstoreMod | null = null;

        @Prop()
        showDownloadModal: boolean = false;

        @Prop({ default: false })
        updateAllMods: boolean = true;

        get thunderstorePackages(): ThunderstoreMod[] {
            return this.$store.state.thunderstoreModList;
        }

        @Watch('thunderstoreMod')
        getModVersions() {
            this.currentVersion = null;
            if (this.thunderstoreMod !== null) {
                this.selectedVersion = this.thunderstoreMod.getVersions()[0].getVersionNumber().toString();
                this.versionNumbers = this.thunderstoreMod.getVersions()
                    .map(value => value.getVersionNumber().toString());

                const modListResult = ProfileModList.getModList(Profile.getActiveProfile());
                if (!(modListResult instanceof R2Error)) {
                    const manifestMod = modListResult.find((local: ManifestV2) => local.getName() === this.thunderstoreMod!.getFullName());
                    if (manifestMod !== undefined) {
                        this.currentVersion = manifestMod.getVersionNumber().toString();
                    }
                }
            }
        }

        closeModal() {
            this.$emit('closed-modal');
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

        downloadLatest() {
            this.closeModal();
            assignId += 1;
            this.downloadObject = {
                progress: 0,
                modName: '',
                assignId: assignId
            };
            this.downloadingMod = true;
            const localMods = ProfileModList.getModList(Profile.getActiveProfile());
            if (localMods instanceof R2Error) {
                this.downloadingMod = false;
                this.$emit('error', localMods);
                return;
            }
            const outdatedMods = localMods.filter(mod => !ModBridge.isLatestVersion(mod));
            BetterThunderstoreDownloader.downloadLatestOfAll(outdatedMods, this.thunderstorePackages, (progress: number, modName: string, status: number, err: R2Error | null) => {
                if (status === StatusEnum.FAILURE) {
                    if (err !== null) {
                        this.downloadingMod = false;
                        this.$emit('error', err);
                        return;
                    }
                } else if (status === StatusEnum.PENDING) {
                    if (this.downloadObject.assignId === assignId) {
                        this.downloadObject = Object.assign({}, {
                            progress: progress,
                            modName: modName
                        });
                    }
                }
            }, (downloadedMods: ThunderstoreCombo[]) => {
                downloadedMods.forEach(combo => {
                    this.installModAfterDownload(combo.getMod(), combo.getVersion());
                });
                this.downloadingMod = false;
                const modList = ProfileModList.getModList(Profile.getActiveProfile());
                if (!(modList instanceof R2Error)) {
                    // ipcRenderer.emit('update-local-mod-list', null, modList);
                    this.$store.dispatch('updateModList', modList);
                }
            });
        }

        downloadHandler(tsMod: ThunderstoreMod, tsVersion: ThunderstoreVersion) {
            this.closeModal();
            assignId += 1;
            this.downloadObject = {
                progress: 0,
                modName: tsMod.getName(),
                assignId: assignId
            };
            this.downloadingMod = true;
            BetterThunderstoreDownloader.download(tsMod, tsVersion, this.thunderstorePackages, (progress: number, modName: string, status: number, err: R2Error | null) => {
                if (status === StatusEnum.FAILURE) {
                    if (err !== null) {
                        this.downloadingMod = false;
                        this.$emit('error', err);
                        return;
                    }
                } else if (status === StatusEnum.PENDING) {
                    if (this.downloadObject.assignId === assignId) {
                        this.downloadObject = Object.assign({}, {
                            progress: progress,
                            modName: modName
                        });
                    }
                }
            }, (downloadedMods: ThunderstoreCombo[]) => {
                downloadedMods.forEach(combo => {
                    this.installModAfterDownload(combo.getMod(), combo.getVersion());
                });
                this.downloadingMod = false;
                const modList = ProfileModList.getModList(Profile.getActiveProfile());
                if (!(modList instanceof R2Error)) {
                    // ipcRenderer.emit('update-local-mod-list', null, modList);
                    this.$store.dispatch('updateModList', modList);
                }
            });
        }

        installModAfterDownload(mod: ThunderstoreMod, version: ThunderstoreVersion): R2Error | void {
            const manifestMod: ManifestV2 = new ManifestV2().fromThunderstoreMod(mod, version);
            const profileModList = ProfileModList.getModList(Profile.getActiveProfile());
            if (profileModList instanceof R2Error) {
                return profileModList;
            }
            const modAlreadyInstalled = profileModList.find(
                value => value.getName() === mod.getFullName()
                    && value.getVersionNumber().isEqualTo(version.getVersionNumber())
            );
            if (!modAlreadyInstalled) {
                if (manifestMod.getName().toLowerCase() !== 'bbepis-bepinexpack') {
                    const result = ProfileInstaller.uninstallMod(manifestMod);
                    if (result instanceof R2Error) {
                        this.$emit('error', result);
                        return result;
                    }
                }
                const installError: R2Error | null = ProfileInstaller.installMod(manifestMod);
                if (!(installError instanceof R2Error)) {
                    const newModList: ManifestV2[] | R2Error = ProfileModList.addMod(manifestMod);
                    if (newModList instanceof R2Error) {
                        this.$emit('error', newModList);
                        return newModList;
                    }
                } else {
                    this.$emit('error', installError);
                    return installError;
                }
            }
        }

    }

</script>
