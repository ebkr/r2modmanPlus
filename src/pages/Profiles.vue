<template>
  <div>
    <CreateProfileModal />
    <DeleteProfileModal />
    <RenameProfileModal />
    <!-- Create modal -->
    <div :class="['modal', {'is-active':(addingProfile !== false)}]">
      <div class="modal-background" @click="closeNewProfileModal()"></div>
      <div class="modal-content">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">{{addingProfileType}} a profile</p>
          </header>
            <template v-if="(addingProfile && importUpdateSelection === 'IMPORT') || (addingProfile && importUpdateSelection === null)">
              <div class="card-content">
                <p>This profile will store its own mods independently from other profiles.</p>
                <br/>
                <input class="input" v-model="newProfileName" ref="profileNameInput" />
                <br/><br/>
                <span class="tag is-dark" v-if="newProfileName === '' || makeProfileNameSafe(newProfileName) === ''">
                    Profile name required
                </span>
                <span class="tag is-success" v-else-if="!doesProfileExist(newProfileName)">
                    "{{makeProfileNameSafe(newProfileName)}}" is available
                </span>
                <span class="tag is-danger" v-else-if="doesProfileExist(newProfileName)">
                    "{{makeProfileNameSafe(newProfileName)}}" is either already in use, or contains invalid characters
                </span>
              </div>
            </template>
            <template v-if="addingProfile && importUpdateSelection === 'UPDATE'">
                <div class="card-content">
                    <div class="notification is-warning">
                        <p>All contents of the profile will be overwritten with the contents of the code/file.</p>
                    </div>
                    <p>Select a profile below:</p>
                    <br/>
                    <select class="select" @change="profileSelectOnChange">
                        <option v-for="profile of profileList" :key="profile">{{ profile }}</option>
                    </select>
                </div>
            </template>
          <div class="card-footer">
              <template v-if="addingProfile && (importUpdateSelection === 'IMPORT' || importUpdateSelection === null)">
                  <button id="modal-create-profile-invalid" class="button is-danger" v-if="doesProfileExist(newProfileName)">Create</button>
                  <button id="modal-create-profile" class="button is-info" @click="createProfile(newProfileName)" v-else>Create</button>
              </template>
              <template v-if="addingProfile && importUpdateSelection === 'UPDATE'">
                  <button id="modal-update-profile-invalid" class="button is-danger" v-if="!doesProfileExist(activeProfileName)">Update profile: {{ activeProfileName }}</button>
                  <button id="modal-update-profile" class="button is-info" v-else @click="updateProfile()">Update profile: {{ activeProfileName }}</button>
              </template>
          </div>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="closeNewProfileModal()"></button>
    </div>
    <!-- Profile import / update selection modal -->
    <div :class="['modal', {'is-active':(showImportUpdateSelectionModal !== false)}]">
        <div class="modal-background" @click="showImportUpdateSelectionModal = false"></div>
        <div class="modal-content">
            <div class="card">
                <header class="card-header">
                    <p class="card-header-title">Are you going to be updating an existing profile or creating a new one?</p>
                </header>
                <div class="card-footer">
                    <button id="modal-import-new-profile" class="button is-info"
                            @click="showImportUpdateSelectionModal = false; showImportModal = true; importUpdateSelection = 'IMPORT'">Import new profile</button>
                    <button id="modal-update-existing-profile" class="button is-primary"
                            @click="showImportUpdateSelectionModal = false; showImportModal = true; importUpdateSelection = 'UPDATE'">Update existing profile</button>
                </div>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="showImportUpdateSelectionModal = false"></button>
    </div>
    <!-- Import profile modal -->
    <div :class="['modal', {'is-active':(showImportModal !== false)}]">
      <div class="modal-background" @click="showImportModal = false"></div>
      <div class="modal-content">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title" v-if="importUpdateSelection === 'IMPORT'">How are you importing a profile?</p>
            <p class="card-header-title" v-if="importUpdateSelection === 'UPDATE'">How are you updating your profile?</p>
          </header>
          <div class="card-footer">
            <button id="modal-import-profile-file" class="button is-info"
              @click="importProfile(); showImportModal = false;">From file</button>
            <button id="modal-import-profile-code" class="button is-primary"
              @click="showImportModal = false; openProfileCodeModal();">From code</button>
          </div>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="showImportModal = false"></button>
    </div>
    <!-- Import code modal -->
    <div :class="['modal', {'is-active':(showCodeModal !== false)}]">
      <div class="modal-background" @click="showCodeModal = false;"></div>
      <div class="modal-content">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">Enter the profile code</p>
          </header>
          <div class="card-content">
            <input type="text" class="input" v-model="profileImportCode" ref="profileCodeInput" />
            <br />
            <br />
            <span class="tag is-dark" v-if="profileImportCode === ''">You haven't entered a code</span>
            <span class="tag is-success" v-else>You may import the profile</span>
          </div>
          <div class="card-footer">
            <button
              id="modal-import-profile-from-code-invalid"
              class="button is-danger"
              v-if="profileImportCode === ''"
            >Fix issues before importing</button>
            <button id="modal-import-profile-from-code" class="button is-info" @click="showCodeModal = false; importProfileUsingCode();" v-else>Import</button>
          </div>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="showCodeModal = false;"></button>
    </div>
    <!-- Import modal -->
    <div :class="['modal', {'is-active':(importingProfile !== false)}]">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">{{percentageImported}}% imported</p>
          </header>
          <div class="card-content">
            <p>This may take a while, as mods are being downloaded.</p>
            <p>Please do not close {{appName}}.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Importing file modal -->
    <div :class="['modal', {'is-active': showFileSelectionHang}]">
         <div class="modal-background"></div>
         <div class="modal-content">
             <div class="notification is-info">
                <h3 class="title">Loading file</h3>
                 <p>A file selection window will appear. Once a profile has been selected it may take a few moments.</p>
             </div>
         </div>
    </div>
    <!-- Content -->
    <hero
      title="Profile selection"
      subtitle="Profiles help to organise mods easily"
      heroType="is-info"
    />
    <div class="columns">
      <div class="column is-full">
        <div>
          <article class="media">
            <div class="media-content">
              <div class="content">
                <div class='notification'>
                    <div class="container">
                        <i class='fas fa-long-arrow-alt-left margin-right' />
                        <strong><a @click="backToGameSelection">Back to game selection</a></strong>
                    </div>
                </div>
                <div v-for="(profileName) of profileList" :key="profileName">
                  <a @click="setSelectedProfile(profileName)">
                    <div class="container">
                      <div class="border-at-bottom">
                        <div class="card is-shadowless">
                          <p
                            :class="['card-header-title', {'has-text-info':activeProfileName === profileName}]"
                          >{{profileName}}</p>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
                <div class="container">
                  <nav class="level">
                    <div class="level-item">
                      <a id="select-profile" class="button is-info" @click="moveToNextScreen()">Select profile</a>
                    </div>
                      <div class="level-item">
                          <a id="rename-profile-disabled" class="button" v-if="activeProfileName === 'Default'" :disabled="true">Rename</a>
                          <a id="rename-profile" class="button" @click="openRenameProfileModal()" v-else>Rename</a>
                      </div>
                    <div class="level-item">
                      <a id="create-profile" class="button" @click="openCreateProfileModal()">Create new</a>
                    </div>
                    <div class="level-item">
                      <!-- <a class='button' @click="importProfile()">Import profile</a> -->
                      <a id="import-profile" class="button" @click="showImportUpdateSelectionModal = true; importUpdateSelection = null;">Import / Update</a>
                    </div>
                    <div class="level-item">
                        <a class="button is-danger" @click="openDeleteProfileModal()">Delete</a>
                    </div>
                  </nav>
                </div>
                </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Component from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { Hero, Progress } from '../components/all';
import sanitize from 'sanitize-filename';

import Profile from '../model/Profile';
import ThunderstoreCombo from '../model/ThunderstoreCombo';
import ManifestV2 from '../model/ManifestV2';
import ExportFormat from '../model/exports/ExportFormat';
import ExportMod from '../model/exports/ExportMod';
import R2Error from '../model/errors/R2Error';
import StatusEnum from '../model/enums/StatusEnum';
import ManagerSettings from '../r2mm/manager/ManagerSettings';
import ProfileModList from '../r2mm/mods/ProfileModList';
import ProfileInstallerProvider from '../providers/ror2/installing/ProfileInstallerProvider';
import ThunderstoreDownloaderProvider from '../providers/ror2/downloading/ThunderstoreDownloaderProvider';

import * as path from 'path';
import FsProvider from '../providers/generic/file/FsProvider';
import Itf_RoR2MM from '../r2mm/installing/Itf_RoR2MM';
import FileUtils from '../utils/FileUtils';
import InteractionProvider from '../providers/ror2/system/InteractionProvider';
import GameDirectoryResolverProvider from '../providers/ror2/game/GameDirectoryResolverProvider';
import { ProfileImportExport } from '../r2mm/mods/ProfileImportExport';
import DeleteProfileModal from "../components/profiles-modals/DeleteProfileModal.vue";
import RenameProfileModal from "../components/profiles-modals/RenameProfileModal.vue";
import CreateProfileModal from "../components/profiles-modals/CreateProfileModal.vue";
import ProfilesMixin from "../components/mixins/ProfilesMixin.vue";
import * as yaml from "yaml";
import VersionNumber from "../model/VersionNumber";
import ZipProvider from "../providers/generic/zip/ZipProvider";
import ThunderstoreMod from "../model/ThunderstoreMod";
import ThunderstoreVersion from "../model/ThunderstoreVersion";
import ManagerInformation from "../_managerinf/ManagerInformation";

let fs: FsProvider;

@Component({
    components: {
        CreateProfileModal,
        hero: Hero,
        'progress-bar': Progress,
        DeleteProfileModal,
        RenameProfileModal,
    },
})
export default class Profiles extends ProfilesMixin {
    @Ref() readonly profileCodeInput: HTMLInputElement | undefined;
    @Ref() readonly profileNameInput: HTMLInputElement | undefined;

    private addingProfile: boolean = false;
    private newProfileName: string = '';
    private addingProfileType: string = 'Create';

    private importingProfile: boolean = false;
    private percentageImported: number = 0;

    private showImportUpdateSelectionModal: boolean = false;
    private importUpdateSelection: "IMPORT" | "UPDATE" | null = null;
    private showImportModal: boolean = false;
    private showCodeModal: boolean = false;
    private profileImportCode: string = '';
    private showFileSelectionHang: boolean = false;

    private listenerId: number = 0;

    get appName(): string {
        return ManagerInformation.APP_NAME;
    }

    get activeProfileName(): string {
        return this.$store.getters['profile/activeProfileName'];
    }

    get activeProfile(): Profile {
        return this.$store.getters['profile/activeProfile'];
    }

    async profileSelectOnChange(event: Event) {
        if (event.target instanceof HTMLSelectElement) {
            await this.setSelectedProfile(event.target.value, false);
        }
    }

    // Open modal for entering a name for a new profile. Triggered
    // either through user action or profile importing via file or code.
    newProfile(type: string, nameOverride: string | undefined) {
        this.newProfileName = nameOverride || '';
        this.addingProfile = true;
        this.addingProfileType = type;
        this.$nextTick(() => {
            if (this.profileNameInput) {
                this.profileNameInput.focus();
            }
        });
    }

    // User confirmed creation of a new profile with a name that didn't exist before.
    // The profile can be either empty or populated via importing.
    async createProfile(profile: string) {
        const safeName = this.makeProfileNameSafe(profile);
        if (safeName === '') {
            return;
        }
        this.$store.commit('profiles/setProfileList', [...this.profileList, safeName].sort());
        await this.setSelectedProfile(safeName);
        this.addingProfile = false;
        document.dispatchEvent(new CustomEvent("created-profile", {detail: safeName}));
    }

    // User confirmed updating an existing profile via importing.
    updateProfile() {
        this.addingProfile = false;
        document.dispatchEvent(new CustomEvent("created-profile", {detail: this.activeProfileName}));
    }

    closeNewProfileModal() {
        this.addingProfile = false;
    }

    openCreateProfileModal() {
        this.$store.commit('openCreateProfileModal');
    }

    openDeleteProfileModal() {
        this.$store.commit('openDeleteProfileModal');
    }

    openRenameProfileModal() {
        this.$store.commit('openRenameProfileModal');
    }

    makeProfileNameSafe(nameToSanitize: string): string {
        return sanitize(nameToSanitize);
    }

    async moveToNextScreen() {
        await this.$router.push({name: 'manager.installed'});
    }

    downloadImportedProfileMods(modList: ExportMod[], callback?: () => void) {
        this.percentageImported = 0;
        ThunderstoreDownloaderProvider.instance.downloadImportedMods(this.$store.state.activeGame, modList,
        (progress: number, modName: string, status: number, err: R2Error | null) => {
            if (status == StatusEnum.FAILURE) {
                this.importingProfile = false;
                if (err instanceof R2Error) {
                    this.$store.commit('error/handleError', err);
                }
            } else if (status == StatusEnum.PENDING) {
                this.percentageImported = Math.floor(progress);
            }
        }, async (comboList: ThunderstoreCombo[]) => {
            let keepIterating = true;
            for (const comboMod of comboList) {
                if (!keepIterating) {
                    return;
                }
                const installResult: R2Error | ManifestV2 = await this.installModAfterDownload(comboMod.getMod(), comboMod.getVersion());
                if (installResult instanceof R2Error) {
                    this.$store.commit('error/handleError', installResult);
                    keepIterating = false;
                    this.importingProfile = false;
                    return;
                }
                for (const imported of modList) {
                    if (imported.getName() == comboMod.getMod().getFullName() && !imported.isEnabled()) {
                        await ProfileModList.updateMod(installResult, this.activeProfile, async modToDisable => {
                            // Need to enable temporarily so the manager doesn't think it's re-disabling a disabled mod.
                            modToDisable.enable();
                            await ProfileInstallerProvider.instance.disableMod(modToDisable, this.activeProfile);
                            modToDisable.disable();
                        });
                    }
                }
            };
            if (callback !== undefined) {
                callback();
            }
            this.importingProfile = false;
        });
    }

    async installModAfterDownload(mod: ThunderstoreMod, version: ThunderstoreVersion): Promise<R2Error | ManifestV2> {
        const manifestMod: ManifestV2 = new ManifestV2().fromThunderstoreMod(mod, version);
        const installError: R2Error | null = await ProfileInstallerProvider.instance.installMod(manifestMod, this.activeProfile);
        if (!(installError instanceof R2Error)) {
            const newModList: ManifestV2[] | R2Error = await ProfileModList.addMod(manifestMod, this.activeProfile);
            if (newModList instanceof R2Error) {
                return newModList;
            }
            return manifestMod;
        } else {
            // (mod failed to be placed in /{profile} directory)
            return installError;
        }
    }

    openProfileCodeModal() {
        this.profileImportCode = '';
        this.showCodeModal = true;
        this.$nextTick(() => {
            if (this.profileCodeInput) {
                this.profileCodeInput.focus();
            }
        });
    }

    async importProfileUsingCode() {
        try {
            const filepath = await ProfileImportExport.downloadProfileCode(this.profileImportCode.trim());
            await this.importProfileHandler([filepath]);
        } catch (e: any) {
            const err = R2Error.fromThrownValue(e, 'Failed to import profile');
            this.$store.commit('error/handleError', err);
        }
    }

    async importProfileHandler(files: string[] | null) {
        if (files === null || files.length === 0) {
            this.importingProfile = false;
            return;
        }

        if (files[0].endsWith(".json")) {
            return await this.importAlternativeManagerProfile(files[0]);
        }

        let read: string | null = await this.readProfileFile(files[0]);

        if (read === null) {
            return;
        }

        const parsed: ExportFormat = await this.parseYamlToExportFormat(read);
        const localListenerId = this.listenerId + 1;
        this.listenerId = localListenerId;
        document.addEventListener('created-profile', ((event: CustomEvent) => {
            if (this.listenerId === localListenerId) {
                (async () => {
                    let profileName: string = event.detail;
                    if (profileName !== '') {
                        if (this.importUpdateSelection === 'UPDATE') {
                            profileName = "_profile_update";
                            if (await fs.exists(path.join(Profile.getDirectory(), profileName))) {
                                await FileUtils.emptyDirectory(path.join(Profile.getDirectory(), profileName));
                                await fs.rmdir(path.join(Profile.getDirectory(), profileName));
                            }
                            // Use commit instead of dispatch so _profile_update is not
                            // saved to persistent storage if something goes wrong.
                            this.$store.commit('profile/setActiveProfile', profileName);
                        }
                        if (parsed.getMods().length > 0) {
                            this.importingProfile = true;
                            setTimeout(() => {
                                this.downloadImportedProfileMods(parsed.getMods(), async () => {
                                    if (files[0].endsWith('.r2z')) {
                                        await this.extractZippedProfileFile(files[0], profileName);
                                    }
                                    if (this.importUpdateSelection === 'UPDATE') {
                                        await this.setSelectedProfile(event.detail, false);
                                        try {
                                            await FileUtils.emptyDirectory(path.join(Profile.getDirectory(), event.detail));
                                        } catch (e) {
                                            console.log("Failed to empty directory:", e);
                                        }
                                        await fs.rmdir(path.join(Profile.getDirectory(), event.detail));
                                        await fs.rename(path.join(Profile.getDirectory(), profileName), path.join(Profile.getDirectory(), event.detail));
                                    }
                                    await this.setSelectedProfile(event.detail);
                                });
                            }, 100);
                        }
                    }
                })();
            }
        }) as EventListener, {once: true});
        this.newProfile('Import', parsed.getProfileName());
    }

    async extractZippedProfileFile(file: string, profileName: string) {
        const entries = await ZipProvider.instance.getEntries(file);
        for (const entry of entries) {
            if (entry.entryName.startsWith('config/') || entry.entryName.startsWith("config\\")) {
                await ZipProvider.instance.extractEntryTo(
                    file,
                    entry.entryName,
                    path.join(
                        Profile.getDirectory(),
                        profileName,
                        'BepInEx'
                    )
                );
            } else if (entry.entryName.toLowerCase() !== "export.r2x") {
                await ZipProvider.instance.extractEntryTo(
                    file,
                    entry.entryName,
                    path.join(
                        Profile.getDirectory(),
                        profileName
                    )
                )
            }
        }
    }

    async readProfileFile(file: string) {
        let read = '';
        if (file.endsWith('.r2x')) {
            read = (await FsProvider.instance.readFile(file)).toString();
        } else if (file.endsWith('.r2z')) {
            const result: Buffer | null = await ZipProvider.instance.readFile(file, "export.r2x");
            if (result === null) {
                return null;
            }
            read = result.toString();
        }
        return read;
    }

    async parseYamlToExportFormat(read: string) {
        const parsedYaml = await yaml.parse(read);
        return new ExportFormat(
            parsedYaml.profileName,
            parsedYaml.mods.map((mod: any) => {
                const enabled = mod.enabled === undefined || mod.enabled;
                return new ExportMod(
                    mod.name,
                    new VersionNumber(
                        `${mod.version.major}.${mod.version.minor}.${mod.version.patch}`
                    ),
                    enabled
                );
            })
        );
    }

    async importAlternativeManagerProfile(file: string) {
        try {
            const fileString = (await fs.readFile(file)).toString();
            const jsonContent = JSON.parse(fileString.trim());
            const ror2Itf = jsonContent as Itf_RoR2MM;
            if (ror2Itf.name != undefined && ror2Itf.packages != undefined) {
                this.newProfile('Import', ror2Itf.name);
                const itfPackages = ror2Itf.packages;
                document.addEventListener("created-profile", ((() => {
                    const packages = itfPackages.map(value => ExportMod.fromFullString(value));
                    setTimeout(() => {
                        this.downloadImportedProfileMods(packages);
                    }, 100);
                }) as EventListener), {once: true});
            }
        } catch (e) {
            const err = R2Error.fromThrownValue(e, 'Failed to import profile');
            this.$store.commit('error/handleError', err);
        }
    }

    importProfile() {
        this.showFileSelectionHang = true;
        InteractionProvider.instance.selectFile({
            title: 'Import Profile',
            filters: [{
                name: "*",
                extensions: ["r2z", "r2x"]
            }],
            buttonLabel: 'Import'
        }).then(value => {
            this.showFileSelectionHang = false;
            this.importProfileHandler(value);
        })
    }

    async created() {
        fs = FsProvider.instance;
        const settings = await this.$store.getters.settings;
        await settings.load();

        const lastProfileName = await this.$store.dispatch('profile/loadLastSelectedProfile');

        // If the view was entered via game selection, the mod list was updated
        // and the cache cleared. The profile is already set in the Vuex store
        // but we want to trigger the cache prewarming. Always doing this for
        // empty profiles is deemed a fair tradeoff. On the other hand there's
        // no point to trigger this when returning from the manager view and the
        // mods are already cached.
        if (this.$store.state.tsMods.cache.size === 0) {
            await this.setSelectedProfile(lastProfileName);
        }

        // Set default paths
        if (settings.getContext().gameSpecific.gameDirectory === null) {
            const result = await GameDirectoryResolverProvider.instance.getDirectory(this.$store.state.activeGame);
            if (!(result instanceof R2Error)) {
                await settings.setGameDirectory(result);
            }
        }

        if (settings.getContext().global.steamDirectory === null) {
            const result = await GameDirectoryResolverProvider.instance.getSteamDirectory();
            if (!(result instanceof R2Error)) {
                await settings.setSteamDirectory(result);
            }
        }

        await this.updateProfileList();
    }

    async setSelectedProfile(profileName: string, prewarmCache = true) {
        try {
            await this.$store.dispatch('profiles/setSelectedProfile', { profileName: profileName, prewarmCache: prewarmCache });
        } catch (e) {
            const err = R2Error.fromThrownValue(e, 'Error while selecting profile');
            this.$store.commit('error/handleError', err);
        }
    }

    async updateProfileList() {
        try {
            await this.$store.dispatch('profiles/updateProfileList');
        } catch (e) {
            const err = R2Error.fromThrownValue(e, 'Error whilst updating ProfileList');
            this.$store.commit('error/handleError', err);
        }
    }

    private async backToGameSelection() {
        await ManagerSettings.resetDefaults();
        await this.$router.push({name: "index"});
    }
}
</script>
