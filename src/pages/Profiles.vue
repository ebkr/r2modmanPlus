<template>
  <div>
    <!-- Create modal -->
    <div :class="['modal', {'is-active':(addingProfile !== false || renamingProfile !== false)}]">
      <div class="modal-background" @click="closeNewProfileModal()"></div>
      <div class="modal-content">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">{{addingProfileType}} a profile</p>
          </header>
          <div class="card-content">
            <p>This profile will store its own mods independently from other profiles.</p>
            <br/>
            <input class="input" v-model="newProfileName" />
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
          <div class="card-footer">
              <template v-if="addingProfile">
                  <button class="button is-danger" v-if="doesProfileExist(newProfileName)">Create</button>
                  <button class="button is-info" @click="createProfile(newProfileName)" v-else>Create</button>
              </template>
              <template v-if="renamingProfile">
                  <button class="button is-danger" v-if="doesProfileExist(newProfileName)">Rename</button>
                  <button class="button is-info" @click="performRename(newProfileName)" v-else>Rename</button>
              </template>
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
            <button class="button is-info"
              @click="importProfile(); showImportModal = false;">From file</button>
            <button class="button is-primary"
              @click="profileImportCode = ''; showImportModal = false; showCodeModal = true;">From code</button>
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
            <p class="card-header-title">{{percentageImported}}% imported</p>
          </header>
          <div class="card-content">
            <p>This may take a while, as mods are being downloaded.</p>
            <p>Please do not close {{appName}}.</p>
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
                <div class="container">
                  <nav class="level">
                    <div class="level-item">
                      <a class="button is-info" @click="setProfileAndContinue()">Select profile</a>
                    </div>
                      <div class="level-item">
                          <a class="button" v-if="selectedProfile === 'Default'" :disabled="true">Rename</a>
                          <a class="button" @click="renameProfile()" v-else>Rename</a>
                      </div>
                    <div class="level-item">
                      <a class="button" @click="newProfile('Create', undefined)">Create new</a>
                    </div>
                    <div class="level-item">
                      <!-- <a class='button' @click="importProfile()">Import profile</a> -->
                      <a class="button" @click="showImportModal = true">Import</a>
                    </div>
                    <div class="level-item">
                      <a class="button is-danger" @click="removeProfile()">Delete</a>
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
import Vue from 'vue';
import Component from 'vue-class-component';
import { Hero, Progress } from '../components/all';
import sanitize from 'sanitize-filename';
import ZipProvider from '../providers/generic/zip/ZipProvider';
import Axios from 'axios';

import Profile from '../model/Profile';
import VersionNumber from '../model/VersionNumber';
import ThunderstoreMod from '../model/ThunderstoreMod';
import ThunderstoreCombo from '../model/ThunderstoreCombo';
import ThunderstoreVersion from '../model/ThunderstoreVersion';
import ManifestV2 from '../model/ManifestV2';
import ExportFormat from '../model/exports/ExportFormat';
import ExportMod from '../model/exports/ExportMod';
import R2Error from '../model/errors/R2Error';
import StatusEnum from '../model/enums/StatusEnum';
import ManagerSettings from '../r2mm/manager/ManagerSettings';
import ProfileModList from '../r2mm/mods/ProfileModList';
import ProfileInstallerProvider from '../providers/ror2/installing/ProfileInstallerProvider';
import PathResolver from '../r2mm/manager/PathResolver';
import ThunderstoreDownloaderProvider from '../providers/ror2/downloading/ThunderstoreDownloaderProvider';

import * as  yaml from 'yaml';
import * as path from 'path';
import FsProvider from '../providers/generic/file/FsProvider';
import Itf_RoR2MM from '../r2mm/installing/Itf_RoR2MM';
import FileUtils from '../utils/FileUtils';
import InteractionProvider from '../providers/ror2/system/InteractionProvider';
import ManagerInformation from '../_managerinf/ManagerInformation';
import GameDirectoryResolverProvider from '../providers/ror2/game/GameDirectoryResolverProvider';
import GameManager from '../model/game/GameManager';
import Game from '../model/game/Game';

let settings: ManagerSettings;
let fs: FsProvider;

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
    private percentageImported: number = 0;

    private showImportModal: boolean = false;
    private showCodeModal: boolean = false;
    private profileImportCode: string = '';
    private showFileSelectionHang: boolean = false;

    private renamingProfile: boolean = false;

    private activeGame!: Game;

    errorMessage: string = '';
    errorStack: string = '';

    get appName(): string {
        return ManagerInformation.APP_NAME;
    }

    showError(error: R2Error) {
        this.errorMessage = error.name;
        this.errorStack = error.message;
    }

    doesProfileExist(nameToCheck: string): boolean {
        if ((nameToCheck.match(new RegExp('^([a-zA-Z0-9])(\\s|[a-zA-Z0-9]|_|-|[.])*$'))) === null) {
            return true;
        }
        const safe: string | undefined = sanitize(nameToCheck);
        if (safe === undefined) {
            return true;
        }
        return (this.profileList.find(
                (profile: string) =>
                    profile.toLowerCase() === safe.toLowerCase())) !== undefined;
    }

    renameProfile() {
        this.newProfileName = this.selectedProfile;
        this.addingProfileType = "Rename";
        this.renamingProfile = true;
    }

    async performRename(newName: string) {
        await fs.rename(
            path.join(Profile.getDirectory(), this.selectedProfile),
            path.join(Profile.getDirectory(), newName)
        );
        this.closeNewProfileModal();
        await this.updateProfileList();
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
        document.dispatchEvent(new CustomEvent("created-profile", {detail: safeName}));
    }

    closeNewProfileModal() {
        this.addingProfile = false;
        this.renamingProfile = false;
        if (this.addingProfile) {
            document.dispatchEvent(new CustomEvent("created-profile", {detail: ''}));
        }
    }

    removeProfile() {
        this.removingProfile = true;
    }

    async removeProfileAfterConfirmation() {
        try {
            await FileUtils.emptyDirectory(Profile.getActiveProfile().getPathOfProfile());
            await fs.rmdir(Profile.getActiveProfile().getPathOfProfile());
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
            for (let profileIteration = 0; profileIteration < this.profileList.length; profileIteration++) {
                if (this.profileList[profileIteration] === Profile.getActiveProfile().getProfileName()) {
                    this.profileList.splice(profileIteration, 1);
                    break;
                }
            }
        }
        new Profile('Default');
        this.selectedProfile = Profile.getActiveProfile().getProfileName();

        const settings = await ManagerSettings.getSingleton(this.activeGame);
        await settings.setProfile(Profile.getActiveProfile().getProfileName());

        this.closeRemoveProfileModal();
    }

    closeRemoveProfileModal() {
        this.removingProfile = false;
    }

    makeProfileNameSafe(nameToSanitize: string): string {
        return sanitize(nameToSanitize);
    }

    setProfileAndContinue() {
        settings.setProfile(Profile.getActiveProfile().getProfileName());
        this.$router.push({ path: '/manager' });
    }

    downloadImportedProfileMods(modList: ExportMod[]) {
        this.percentageImported = 0;
        ThunderstoreDownloaderProvider.instance.downloadImportedMods(this.activeGame, modList,
        (progress: number, modName: string, status: number, err: R2Error | null) => {
            if (status == StatusEnum.FAILURE) {
                this.importingProfile = false;
                if (err instanceof R2Error) {
                    this.showError(err);
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
                    this.showError(installResult);
                    keepIterating = false;
                    this.importingProfile = false;
                    return;
                }
                for (const imported of modList) {
                    if (imported.getName() == comboMod.getMod().getFullName() && !imported.isEnabled()) {
                        await ProfileModList.updateMod(installResult, Profile.getActiveProfile(), async modToDisable => {
                            modToDisable.disable();
                            await ProfileInstallerProvider.instance.disableMod(modToDisable, Profile.getActiveProfile());
                        });
                    }
                }
            };
            this.importingProfile = false;
        });
    }

    importProfileUsingCode() {
        Axios.get(`https://r2modman-hastebin.herokuapp.com/raw/${this.profileImportCode}`)
            .then(resp => resp.data)
            .then(async resp => {
                if (resp.startsWith("#r2modman")) {
                    const buf = Buffer.from(resp.substring(9).trim(), 'base64');
                    await FileUtils.ensureDirectory(path.join(PathResolver.ROOT, '_import_cache'));
                    await fs.writeFile(path.join(PathResolver.ROOT, '_import_cache', 'import.r2z'), buf);
                    await this.importProfileHandler([path.join(PathResolver.ROOT, '_import_cache', 'import.r2z')]);
                } else {
                        throw new Error('Code invalid, no profile is associated with this code');
                }
            }).catch(e => {
                const err = new R2Error('Failed to find profile', e.message, null);
                this.showError(err);
            })
    }

    async importProfileHandler(files: string[] | null) {
        if (files === null || files.length === 0) {
            this.importingProfile = false;
            return;
        }
        let read = '';
        if (files[0].endsWith('.r2x')) {
            read = await fs.readFile(files[0]).toString();
        } else if (files[0].endsWith('.r2z')) {
            const result: Buffer | null = await ZipProvider.instance.readFile(files[0], "export.r2x");
            if (result === null) {
                return;
            }
            read = result.toString();
        } else if (files[0].endsWith(".json")) {
            return this.importAlternativeManagerProfile(files[0]);
        }
        const parsedYaml = yaml.parse(read);
        const parsed: ExportFormat = new ExportFormat(
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
        document.addEventListener('created-profile', ((event: CustomEvent) => {
            (async () => {
                const profileName: string = event.detail;
                if (profileName !== '') {
                    if (files[0].endsWith('.r2z')) {
                        const entries = await ZipProvider.instance.getEntries(files[0]);
                        for (const entry of entries) {
                            if (entry.entryName.startsWith('config/')) {
                                await ZipProvider.instance.extractEntryTo(
                                    files[0],
                                    entry.entryName,
                                    path.join(
                                        Profile.getDirectory(),
                                        profileName,
                                        'BepInEx'
                                    )
                                );
                            }
                        }
                    }
                    if (parsed.getMods().length > 0) {
                        this.importingProfile = true;
                        setTimeout(() => {
                            this.downloadImportedProfileMods(parsed.getMods());
                        }, 100);
                    }
                }
            })();
        }) as EventListener, {once: true});
        this.newProfile('Import', parsed.getProfileName());
    }

    async importAlternativeManagerProfile(file: string) {
        try {
            const fileString = await fs.readFile(file).toString();
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
            const err = new R2Error("Failed to import profile", e.message, null);
            this.showError(err);
            return;
        }
    }

    importProfile() {
        this.showFileSelectionHang = true;
        InteractionProvider.instance.selectFile({
            title: 'Import Profile',
            filters: ['.r2z', '.json'],
            buttonLabel: 'Import'
        }).then(value => {
            this.showFileSelectionHang = false;
            this.importProfileHandler(value);
        })
    }

    async installModAfterDownload(mod: ThunderstoreMod, version: ThunderstoreVersion): Promise<R2Error | ManifestV2> {
        const manifestMod: ManifestV2 = new ManifestV2().fromThunderstoreMod(mod, version);
        const installError: R2Error | null = await ProfileInstallerProvider.instance.installMod(manifestMod, Profile.getActiveProfile());
        if (!(installError instanceof R2Error)) {
            const newModList: ManifestV2[] | R2Error = await ProfileModList.addMod(manifestMod, Profile.getActiveProfile());
            if (newModList instanceof R2Error) {
                return newModList;
            }
            return manifestMod;
        } else {
            // (mod failed to be placed in /{profile} directory)
            return installError;
        }
    }

    async updateProfileList() {
        this.profileList = ["Default"];
        const profilesDirectory: string = Profile.getActiveProfile().getDirectory();
        await fs.readdir(profilesDirectory).then(dirContents => {
            dirContents.forEach(async (file: string) => {
                if ((await fs.stat(path.join(profilesDirectory, file))).isDirectory() && file.toLowerCase() !== 'default') {
                    this.profileList.push(file);
                }
            });
        }).catch(() => { /* Do nothing */ });
    }

    async created() {

        this.activeGame = GameManager.activeGame;

        fs = FsProvider.instance;
        settings = await ManagerSettings.getSingleton(this.activeGame);
        await settings.load();

        this.selectedProfile = settings.getContext().gameSpecific.lastSelectedProfile;
        new Profile(this.selectedProfile);

        // Set default paths
        if (settings.getContext().gameSpecific.gameDirectory === null) {
            const result = await GameDirectoryResolverProvider.instance.getDirectory(this.activeGame);
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
}
</script>
