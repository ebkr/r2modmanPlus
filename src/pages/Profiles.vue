<template>
  <div>
    <!-- Create modal -->
    <div :class="['modal', {'is-active':(addingProfile !== false)}]">
      <div class="modal-background" @click="closeNewProfileModal()"></div>
      <div class="modal-content">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">{{addingProfileType}} a new profile</p>
          </header>
          <div class="card-content">
            <p>This profile will store its own mods independently from other profiles.</p>
            <br />
            <input class="input" v-model="newProfileName" />
            <br />
            <br />
            <span
              class="tag is-dark"
              v-if="newProfileName === '' || makeProfileNameSafe(newProfileName) === ''"
            >Profile name required</span>
            <span
              class="tag is-success"
              v-else-if="!doesProfileExist(newProfileName)"
            >"{{makeProfileNameSafe(newProfileName)}}" is available</span>
            <span
              class="tag is-danger"
              v-else-if="doesProfileExist(newProfileName)"
            >"{{makeProfileNameSafe(newProfileName)}}" is either already in use, or contains invalid characters</span>
          </div>
          <div class="card-footer">
            <button class="button is-danger" v-if="doesProfileExist(newProfileName)">Create</button>
            <button class="button is-info" @click="createProfile(newProfileName)" v-else>Create</button>
          </div>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="closeNewProfileModal()"></button>
    </div>
    <!-- Import option modal -->
    <div :class="['modal', {'is-active':(showImportModal !== false)}]">
      <div class="modal-background" @click="showImportModal = false"></div>
      <div class="modal-content">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">How are you importing a profile?</p>
          </header>
          <div class="card-footer">
            <button
              class="button is-info"
              @click="importProfile(); showImportModal = false;"
            >From file</button>
            <button
              class="button is-primary"
              @click="profileImportCode = ''; showImportModal = false; showCodeModal = true;"
            >From code</button>
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
            <input type="text" class="input" v-model="profileImportCode" />
            <br />
            <br />
            <span class="tag is-dark" v-if="profileImportCode === ''">You haven't entered a code</span>
            <span class="tag is-success" v-else>You may import the profile</span>
          </div>
          <div class="card-footer">
            <button
              class="button is-danger"
              v-if="profileImportCode === ''"
            >Fix issues before importing</button>
            <button class="button is-info" @click="showCodeModal = false; importProfileUsingCode();" v-else>Import</button>
          </div>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="showCodeModal = false;"></button>
    </div>
    <!-- Delete modal -->
    <div :class="['modal', {'is-active':(removingProfile !== false)}]">
      <div class="modal-background" @click="closeRemoveProfileModal()"></div>
      <div class="modal-content">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">Delete profile</p>
          </header>
          <div class="card-content">
            <p>This will remove all mods, and their config files, installed within this profile.</p>
            <p>If this was an accident, click either the darkened area, or the cross inside located in the top right.</p>
            <p>Are you sure you'd like to delete this profile?</p>
          </div>
          <div class="card-footer">
            <button
              class="button is-danger"
              @click="removeProfileAfterConfirmation()"
            >Delete profile</button>
          </div>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="closeRemoveProfileModal()"></button>
    </div>
    <!-- Import modal -->
    <div :class="['modal', {'is-active':(importingProfile !== false)}]">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="card">
          <header class="card-header">
            <p
              class="card-header-title"
              v-if="totalModsToImport > 0"
            >Importing profile ({{numberOfModsImported}} / {{totalModsToImport}})</p>
            <p class="card-header-title" v-else>Importing profile</p>
          </header>
          <div class="card-content">
            <p>This may take a while, as mods are being downloaded.</p>
            <p>Please do not close r2modman.</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Error modal -->
    <div id="errorModal" :class="['modal', {'is-active':(errorMessage !== '')}]">
      <div class="modal-background" v-on:click="errorMessage = ''"></div>
      <div class="modal-content">
        <div class="notification is-danger">
          <h3 class="title">Error</h3>
          <h5 class="title is-5">{{errorMessage}}</h5>
          <p>{{errorStack}}</p>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" v-on:click="errorMessage = ''"></button>
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
                <div v-for="(profileName) of profileList" :key="profileName">
                  <a @click="selectProfile(profileName)">
                    <div class="container">
                      <div class="border-at-bottom">
                        <div class="card is-shadowless">
                          <p
                            :class="['card-header-title', {'has-text-info':selectedProfile === profileName}]"
                          >{{profileName}}</p>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              <nav class="level">
                <div class="level-item">
                  <a class="button is-info" @click="setProfileAndContinue()">Use selected profile</a>
                </div>
                <div class="level-item">
                  <a class="button" @click="newProfile('Create')">Create new</a>
                </div>
                <div class="level-item">
                  <!-- <a class='button' @click="importProfile()">Import profile</a> -->
                  <a class="button" @click="showImportModal = true">Import profile</a>
                </div>
                <div class="level-item">
                  <a class="button is-danger" @click="removeProfile()">Delete selected profile</a>
                </div>
              </nav>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { Hero, Progress } from '../components/all';
import { Prop } from 'vue-property-decorator';
import { isUndefined, isNull } from 'util';
import sanitize from 'sanitize-filename';
import { ipcRenderer } from 'electron';
import AdmZip from 'adm-zip';
import Axios from 'axios';

import Profile from '../model/Profile';
import VersionNumber from '../model/VersionNumber';
import ThunderstoreMod from '../model/ThunderstoreMod';
import ThunderstoreVersion from '../model/ThunderstoreVersion';
import ManifestV2 from '../model/ManifestV2';
import ExportFormat from '../model/exports/ExportFormat';
import ExportMod from '../model/exports/ExportMod';
import R2Error from '../model/errors/R2Error';
import StatusEnum from '../model/enums/StatusEnum';
import ManagerSettings from '../r2mm/manager/ManagerSettings';
import ThunderstoreDownloader from '../r2mm/downloading/ThunderstoreDownloader';
import ThunderstorePackages from '../r2mm/data/ThunderstorePackages';
import ProfileModList from '../r2mm/mods/ProfileModList';
import ProfileInstaller from '../r2mm/installing/ProfileInstaller';
import PathResolver from '../r2mm/manager/PathResolver';

import * as yaml from 'yaml';
import * as fs from 'fs-extra';
import * as path from 'path';

let settings: ManagerSettings;

@Component({
    components: {
        hero: Hero,
        'progress-bar': Progress
    }
})
export default class Profiles extends Vue {
    private profileList: string[] = ['Default'];

    private selectedProfile: string = '';

    private addingProfile: boolean = false;
    private newProfileName: string = '';
    private addingProfileType: string = 'Create';

    private removingProfile: boolean = false;
    private importingProfile: boolean = false;
    private numberOfModsImported: number = 0;
    private totalModsToImport: number = 0;

    private showImportModal: boolean = false;
    private showCodeModal: boolean = false;
    private profileImportCode: string = '';

    errorMessage: string = '';
    errorStack: string = '';

    showError(error: R2Error) {
        this.errorMessage = error.name;
        this.errorStack = error.message;
    }

    doesProfileExist(nameToCheck: string): boolean {
        if (
            isNull(
                nameToCheck.match(new RegExp('^[a-zA-Z0-9](\\s|[a-zA-Z0-9])*$'))
            )
        ) {
            return true;
        }
        const safe: string | undefined = sanitize(nameToCheck);
        if (isUndefined(safe)) {
            return true;
        }
        return !isUndefined(
            this.profileList.find(
                (profile: string) =>
                    profile.toLowerCase() === safe.toLowerCase()
            )
        );
    }

    selectProfile(profile: string) {
        new Profile(profile);
        this.selectedProfile = profile;
        settings.setProfile(profile);
    }

    newProfile(type: string, nameOverride: string | undefined) {
        this.newProfileName = nameOverride || '';
        this.addingProfile = true;
        this.addingProfileType = type;
    }

    createProfile(profile: string) {
        const safeName = this.makeProfileNameSafe(profile);
        if (safeName === '') {
            return;
        }
        new Profile(safeName);
        this.profileList.push(safeName);
        this.selectedProfile = Profile.getActiveProfile().getProfileName();
        this.addingProfile = false;
        ipcRenderer.emit('created-profile', safeName);
    }

    closeNewProfileModal() {
        this.addingProfile = false;
        ipcRenderer.emit('created-profile', '');
    }

    removeProfile() {
        this.removingProfile = true;
    }

    removeProfileAfterConfirmation() {
        try {
            fs.emptyDirSync(Profile.getActiveProfile().getPathOfProfile());
            fs.removeSync(Profile.getActiveProfile().getPathOfProfile());
        } catch (e) {
            const err: Error = e;
            this.showError(
                new R2Error('Error whilst deleting profile', err.message, null)
            );
        }
        if (
            Profile.getActiveProfile()
                .getProfileName()
                .toLowerCase() !== 'default'
        ) {
            for (
                let profileIteration = 0;
                profileIteration < this.profileList.length;
                profileIteration++
            ) {
                if (
                    this.profileList[profileIteration] ===
                    Profile.getActiveProfile().getProfileName()
                ) {
                    this.profileList.splice(profileIteration, 1);
                    break;
                }
            }
        }
        new Profile('Default');
        this.selectedProfile = Profile.getActiveProfile().getProfileName();

        settings = new ManagerSettings();
        settings.load();
        settings.setProfile(Profile.getActiveProfile().getProfileName());

        this.closeRemoveProfileModal();
    }

    closeRemoveProfileModal() {
        this.removingProfile = false;
    }

    makeProfileNameSafe(nameToSanitize: string): string {
        const safe: string | undefined = sanitize(nameToSanitize);
        if (isUndefined(safe)) {
            return '';
        }
        return safe;
    }

    setProfileAndContinue() {
        settings.setProfile(Profile.getActiveProfile().getProfileName());
        this.$router.push({ path: '/manager' });
    }

    downloadImportedProfileMods(modList: ExportMod[]) {
        this.numberOfModsImported = 0;
        this.totalModsToImport = modList.length;
        let step = 0;
        let currentMod: ThunderstoreMod;
        const installStep = (
            progress: number,
            status: number,
            error: R2Error | void
        ) => {
            if (status === StatusEnum.SUCCESS) {
                this.numberOfModsImported += 1;
                const thunderstoreVersion:
                    | ThunderstoreVersion
                    | undefined = currentMod
                    .getVersions()
                    .find(
                        (version: ThunderstoreVersion) =>
                            version.getVersionNumber().toString() ===
                            modList[step].getVersionNumber().toString()
                    );
                if (isUndefined(thunderstoreVersion)) {
                    this.importingProfile = false;
                    return;
                }
                const mod: ManifestV2 = new ManifestV2().fromThunderstoreMod(
                    currentMod,
                    thunderstoreVersion
                );
                ProfileModList.addMod(mod);
                ProfileInstaller.installMod(mod);
                if (!modList[step].isEnabled()) {
                    const profileErr = ProfileInstaller.disableMod(mod);
                    const update:
                        | ManifestV2[]
                        | R2Error = ProfileModList.updateMod(
                        mod,
                        (updatingMod: ManifestV2) => {
                            updatingMod.disable();
                        }
                    );
                    if (update instanceof R2Error) {
                        this.showError(update);
                    }
                }
                step += 1;
                if (step < modList.length) {
                    const tsMod:
                        | ThunderstoreMod
                        | undefined = ThunderstorePackages.PACKAGES.find(
                        (mod: ThunderstoreMod) =>
                            mod.getFullName() === modList[step].getName()
                    );
                    if (isUndefined(tsMod)) {
                        this.importingProfile = false;
                        return;
                    }
                    currentMod = tsMod;
                    const downloader = new ThunderstoreDownloader(tsMod);
                    downloader.download(
                        installStep,
                        modList[step].getVersionNumber()
                    );
                } else {
                    this.importingProfile = false;
                }
            } else if (status === StatusEnum.FAILURE) {
                if (error instanceof R2Error) {
                    this.showError(error);
                }
                this.importingProfile = false;
                return;
            }
        };
        if (modList.length > 0) {
            const tsMod:
                | ThunderstoreMod
                | undefined = ThunderstorePackages.PACKAGES.find(
                (mod: ThunderstoreMod) =>
                    mod.getFullName() === modList[step].getName()
            );
            if (!(tsMod instanceof ThunderstoreMod)) {
                this.importingProfile = false;
                return;
            }
            currentMod = tsMod;
            const downloader = new ThunderstoreDownloader(tsMod);
            downloader.download(installStep, modList[step].getVersionNumber());
        }
    }

    importProfileUsingCode() {
        Axios.get(`https://hastebin.com/raw/${this.profileImportCode}`)
            .then(resp => resp.data)
            .then(resp => {
                if (resp.startsWith("#r2modman")) {
                    const buf = Buffer.from(resp.substring(9).trim(), 'base64');
                    fs.ensureDirSync(path.join(PathResolver.ROOT, '_import_cache'));
                    fs.writeFileSync(path.join(PathResolver.ROOT, '_import_cache', 'import.r2z'), buf);
                    this.importProfileHandler([path.join(PathResolver.ROOT, '_import_cache', 'import.r2z')]);
                } else {
                        throw new Error('Code invalid, no profile is associated with this code');
                }
            }).catch(e => {
                const err = new R2Error('Failed to find profile', e.message, null);
                this.showError(err);
            })
    }

    importProfileHandler(files: string[] | null) {
        if (isNull(files) || files.length === 0) {
            this.importingProfile = false;
            return;
        }
        let read = '';
        if (files[0].endsWith('.r2x')) {
            read = fs.readFileSync(files[0]).toString();
        } else if (files[0].endsWith('.r2z')) {
            const zip = new AdmZip(files[0]);
            console.log(zip.getEntries());
            const result: Buffer | null = zip.readFile('export.r2x');
            if (isNull(result)) {
                return;
            }
            read = result.toString();
            // Read export.r2x.
        }
        const parsedYaml = yaml.parse(read);
        const parsed: ExportFormat = new ExportFormat(
            parsedYaml.profileName,
            parsedYaml.mods.map((mod: any) => {
                const enabled = isUndefined(mod.enabled) || mod.enabled;
                return new ExportMod(
                    mod.name,
                    new VersionNumber(
                        `${mod.version.major}.${mod.version.minor}.${mod.version.patch}`
                    ),
                    enabled
                );
            })
        );
        this.newProfile('Import', parsed.getProfileName());
        ipcRenderer.once('created-profile', (profileName: string) => {
            if (profileName !== '') {
                if (files[0].endsWith('.r2z')) {
                    const zip = new AdmZip(files[0]);
                    zip.getEntries().forEach(entry => {
                        if (entry.entryName.startsWith('config/')) {
                            console.log(entry.entryName);
                            zip.extractEntryTo(
                                entry.entryName,
                                path.join(
                                    Profile.getDirectory(),
                                    profileName,
                                    'BepInEx'
                                ),
                                true,
                                true
                            );
                        }
                    });
                    // Extract config folder
                }
                if (parsed.getMods().length > 0) {
                    this.importingProfile = true;
                    setTimeout(() => {
                        this.downloadImportedProfileMods(parsed.getMods());
                    }, 100);
                }
            }
        });
    }

    importProfile(file: string) {
        ipcRenderer.once(
            'receive-selection',
            (_sender: any, files: string[] | null) => {
                this.importProfileHandler(files);
            }
        );
        ipcRenderer.send('open-dialog', {
            title: 'Import Profile',
            properties: ['openFile'],
            filters: ['.r2x', '.r2z'],
            buttonLabel: 'Import'
        });
    }

    created() {
        settings = new ManagerSettings();
        settings.load();

        this.selectedProfile = settings.lastSelectedProfile;
        new Profile(this.selectedProfile);

        try {
            const profilesDirectory: string = Profile.getActiveProfile().getDirectory();
            fs.readdirSync(profilesDirectory).forEach((file: string) => {
                if (
                    fs
                        .lstatSync(path.join(profilesDirectory, file))
                        .isDirectory() &&
                    file.toLowerCase() !== 'default'
                ) {
                    this.profileList.push(file);
                }
            });
        } catch (e) {
            return;
        }
    }
}
</script>
