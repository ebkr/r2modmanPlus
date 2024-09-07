<script lang="ts">
import { Component } from 'vue-property-decorator';
import { ModalCard } from "../all";
import R2Error from "../../model/errors/R2Error";
import { ProfileImportExport } from "../../r2mm/mods/ProfileImportExport";
import ExportMod from "../../model/exports/ExportMod";
import path from "path";
import Profile from "../../model/Profile";
import FileUtils from "../../utils/FileUtils";
import FsProvider from "../../providers/generic/file/FsProvider";
import ThunderstoreDownloaderProvider from "../../providers/ror2/downloading/ThunderstoreDownloaderProvider";
import StatusEnum from "../../model/enums/StatusEnum";
import ThunderstoreCombo from "../../model/ThunderstoreCombo";
import ManifestV2 from "../../model/ManifestV2";
import ProfileModList from "../../r2mm/mods/ProfileModList";
import ProfileInstallerProvider from "../../providers/ror2/installing/ProfileInstallerProvider";
import InteractionProvider from "../../providers/ror2/system/InteractionProvider";
import { mixins } from "vue-class-component";
import ProfilesMixin from "../mixins/ProfilesMixin.vue";
import ExportFormat from "../../model/exports/ExportFormat";
import Itf_RoR2MM from "../../r2mm/installing/Itf_RoR2MM";
import * as yaml from "yaml";
import VersionNumber from "../../model/VersionNumber";
import ZipProvider from "../../providers/generic/zip/ZipProvider";
import ThunderstoreMod from "../../model/ThunderstoreMod";
import ThunderstoreVersion from "../../model/ThunderstoreVersion";
import ManagerInformation from "../../_managerinf/ManagerInformation";
import OnlineModList from 'components/views/OnlineModList.vue';

let fs: FsProvider;


@Component({
    components: { OnlineModList, ModalCard}
})
export default class ImportProfileModal extends mixins(ProfilesMixin) {
    private importUpdateSelection: "IMPORT" | "UPDATE" | null = null;
    private percentageImported: number = 0;
    private profileImportCode: string = '';
    private isProfileBeingImported: boolean = false;
    private listenerId: number = 0;
    private newProfileName: string = '';
    private profileImportFilePath: string | null = null;
    private profileImportContent: ExportFormat | null = null;
    private activeStep: 'IMPORT_UPDATE_SELECTION' | 'FILE_SELECTION' | 'FILE_CODE_SELECTION' | 'IMPORT_CODE' | 'IMPORT_FILE' | 'ADDING_PROFILE' | 'REVIEW_IMPORT' = 'IMPORT_UPDATE_SELECTION';



    async created() {
        fs = FsProvider.instance;
    }

    get appName(): string {
        return ManagerInformation.APP_NAME;
    }

    get activeProfile(): Profile {
        return this.$store.getters['profile/activeProfile'];
    }

    get isOpen(): boolean {
        return this.$store.state.modals.isImportProfileModalOpen;
    }

    async profileSelectOnChange(event: Event) {
        if (event.target instanceof HTMLSelectElement) {
            this.activeProfileName = event.target.value;
        }
    }

    get profileToOnlineMods() {
        if (!this.profileImportContent) {
            return [];
        }
        return this.profileImportContent.getMods()
            .map(mod => this.$store.getters['tsMods/tsMod'](mod))
            .filter(mod => !!mod)
    }

    closeModal() {
        this.activeStep = 'IMPORT_UPDATE_SELECTION';
        this.listenerId = 0;
        this.newProfileName = '';
        this.importUpdateSelection = null;
        this.profileImportCode = '';
        this.profileImportFilePath = null;
        this.profileImportContent = null;
        this.$store.commit('closeImportProfileModal');
    }

    // User selects importing via code from the UI.
    async importProfileUsingCode() {
        try {
            const filepath = await ProfileImportExport.downloadProfileCode(this.profileImportCode.trim());
            await this.importProfileHandler([filepath]);
        } catch (e: any) {
            const err = R2Error.fromThrownValue(e, 'Failed to import profile');
            this.$store.commit('error/handleError', err);
        }
    }

    // User selects importing from file from the UI.
    importProfileFromFile() {
        this.activeStep = 'FILE_SELECTION';
        InteractionProvider.instance.selectFile({
            title: 'Import Profile',
            filters: [{
                name: "*",
                extensions: ["r2z"]
            }],
            buttonLabel: 'Import'
        }).then((value: string[]) => {
            if(value.length === 0) {
                this.closeModal();
            }
            this.importProfileHandler(value);
        })
    }

    // When creating, the flow is:
    //      1. Reads and parses the mods to be installed
    //      2. Creates an EventListener which gets triggered after the user has created a new profile. The callback then:
    //          1. Downloads (and extracts) the mods to the profile
    // When updating, the flow is:
    //      1. Reads and parses the mods to be installed
    //      2. Creates an EventListener which gets triggered after the user has selected the old profile to be updated. The callback then:
    //          1. Deletes the temporary profile (called _profile_update) if it exists (leftover from previous failed run etc.)
    //          2. Downloads (and extracts) the mods to temporary profile
    //          3. Deletes the old profile (including the folder on disk)
    //          4. Renames temporary profile to the chosen profile's name
    async importProfileHandler(files: string[] | null) {
        if (files === null || files.length === 0) {
            this.isProfileBeingImported = false;
            return;
        }

        let read: string | null = await this.readProfileFile(files[0]);

        if (read !== null) {
            this.profileImportFilePath = files[0];
            this.profileImportContent = await this.parseYamlToExportFormat(read);
            this.activeStep = 'REVIEW_IMPORT';
        }
    }

    async installProfileHandler() {
        const profileContent = this.profileImportContent;
        const localListenerId = this.listenerId + 1;
        this.listenerId = localListenerId;
        document.addEventListener('created-profile', ((event: CustomEvent) =>
                this.profileCreatedCallback(event, localListenerId, profileContent!, [this.profileImportFilePath!])
        ) as EventListener, {once: true});
        this.newProfileName = profileContent!.getProfileName();
        this.activeStep = 'ADDING_PROFILE';
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

    profileCreatedCallback(event: CustomEvent, localListenerId: number, parsed: ExportFormat, files: string[]) {
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
                        await this.$store.dispatch('profiles/setSelectedProfile', { profileName: profileName, prewarmCache: true });
                    }
                    if (parsed.getMods().length > 0) {
                        this.isProfileBeingImported = true;
                        setTimeout(() => {
                            this.downloadImportedProfileMods(parsed.getMods(), async () => {
                                if (files[0].endsWith('.r2z')) {
                                    await this.extractZippedProfileFile(files[0], profileName);
                                }
                                if (this.importUpdateSelection === 'UPDATE') {
                                    this.activeProfileName = event.detail;
                                    try {
                                        await FileUtils.emptyDirectory(path.join(Profile.getDirectory(), event.detail));
                                    } catch (e) {
                                        console.log("Failed to empty directory:", e);
                                    }
                                    await fs.rmdir(path.join(Profile.getDirectory(), event.detail));
                                    await fs.rename(path.join(Profile.getDirectory(), profileName), path.join(Profile.getDirectory(), event.detail));
                                }
                                await this.$store.dispatch('profiles/setSelectedProfile', { profileName: event.detail, prewarmCache: true });
                                this.closeModal();
                            });
                        }, 100);
                    }
                }
            })();
        }
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

    downloadImportedProfileMods(modList: ExportMod[], callback?: () => void) {
        this.percentageImported = 0;
        ThunderstoreDownloaderProvider.instance.downloadImportedMods(
            this.$store.state.activeGame,
            modList,
            this.downloadProgressCallback,
            async (comboList: ThunderstoreCombo[]) => {
                await this.downloadCompletedCallback(comboList, modList, callback);
            }
        );
    }

    // Called from the downloadImportedProfileMods function
    downloadProgressCallback(progress: number, modName: string, status: number, err: R2Error | null) {
        if (status == StatusEnum.FAILURE) {
            this.closeModal();
            this.isProfileBeingImported = false;
            if (err instanceof R2Error) {
                this.$store.commit('error/handleError', err);
            }
        } else if (status == StatusEnum.PENDING) {
            this.percentageImported = Math.floor(progress);
        }
    }

    // Called from the downloadImportedProfileMods function
    async downloadCompletedCallback(comboList: ThunderstoreCombo[], modList: ExportMod[], callback?: () => void) {
        let keepIterating = true;
        for (const comboMod of comboList) {
            if (!keepIterating) {
                return;
            }
            const installResult: R2Error | ManifestV2 = await this.installModAfterDownload(comboMod.getMod(), comboMod.getVersion());
            if (installResult instanceof R2Error) {
                this.$store.commit('error/handleError', installResult);
                keepIterating = false;
                this.isProfileBeingImported = false;
                return;
            }
            for (const imported of modList) {
                if (imported.getName() == comboMod.getMod().getFullName() && !imported.isEnabled()) {
                    await ProfileModList.updateMod(installResult, this.activeProfile, async (modToDisable: ManifestV2) => {
                        // Need to enable temporarily so the manager doesn't think it's re-disabling a disabled mod.
                        modToDisable.enable();
                        await ProfileInstallerProvider.instance.disableMod(modToDisable, this.activeProfile);
                        modToDisable.disable();
                    });
                }
            }
        }
        if (callback !== undefined) {
            callback();
        }
        this.isProfileBeingImported = false;
    }

    // Called when the name for the imported profile is given and confirmed by the user.
    async createProfile() {
        const safeName = this.makeProfileNameSafe(this.newProfileName);
        if (safeName === '') {
            return;
        }
        try {
            await this.$store.dispatch('profiles/addProfile', safeName);
            document.dispatchEvent(new CustomEvent("created-profile", {detail: safeName}));
        } catch (e) {
            const err = R2Error.fromThrownValue(e, 'Error importing a profile');
            this.$store.commit('error/handleError', err);
        }
    }

    // Called when the profile to update is selected and confirmed by the user.
    updateProfile() {
        document.dispatchEvent(new CustomEvent("created-profile", {detail: this.activeProfileName}));
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
}

</script>

<template>
    <ModalCard v-if="activeStep === 'IMPORT_UPDATE_SELECTION'" key="IMPORT_UPDATE_SELECTION" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:header>
            <h2 class="modal-title">Are you going to be updating an existing profile or creating a new one?</h2>
        </template>
        <template v-slot:footer>
            <button id="modal-import-new-profile"
                    class="button is-info"
                    @click="activeStep = 'FILE_CODE_SELECTION'; importUpdateSelection = 'IMPORT'">
                Import new profile
            </button>
            <button id="modal-update-existing-profile"
                    class="button is-primary"
                    @click="activeStep = 'FILE_CODE_SELECTION'; importUpdateSelection = 'UPDATE'">
                Update existing profile
            </button>
        </template>
    </ModalCard>

    <ModalCard v-else-if="activeStep === 'FILE_CODE_SELECTION'" key="FILE_CODE_SELECTION" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:header>
            <h2 class="modal-title" v-if="importUpdateSelection === 'IMPORT'">How are you importing a profile?</h2>
            <h2 class="modal-title" v-if="importUpdateSelection === 'UPDATE'">How are you updating your profile?</h2>
        </template>
        <template v-slot:footer>
            <button id="modal-import-profile-file"
                    class="button is-info"
                    @click="importProfileFromFile()">From file</button>
            <button id="modal-import-profile-code"
                    class="button is-primary"
                    @click="activeStep = 'IMPORT_CODE'">From code</button>
        </template>
    </ModalCard>

    <ModalCard v-else-if="activeStep === 'IMPORT_CODE'" key="IMPORT_CODE" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:header>
            <h2 class="modal-title">Enter the profile code</h2>
        </template>
        <template v-slot:body>
            <input
                type="text"
                class="input"
                v-model="profileImportCode"
                ref="profileCodeInput"
                @keyup.enter="importProfileUsingCode()"
            />
            <br />
            <br />
            <span class="tag is-dark" v-if="profileImportCode === ''">You haven't entered a code</span>
            <span class="tag is-success" v-else>You may import the profile</span>
        </template>
        <template v-slot:footer>
            <button
                id="modal-import-profile-from-code-invalid"
                class="button is-danger"
                v-if="profileImportCode === ''">
                Fix issues before importing
            </button>
            <button
                id="modal-import-profile-from-code"
                class="button is-info"
                @click="importProfileUsingCode();"
                v-else>
                Continue
            </button>
        </template>
    </ModalCard>

    <ModalCard v-else-if="activeStep === 'REVIEW_IMPORT'" key="REVIEW_IMPORT" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:header>
            <h2 class="modal-title">Packages to be installed</h2>
        </template>
        <template v-slot:body>
            <OnlineModList :paged-mod-list="profileToOnlineMods" :read-only="true" />
        </template>
        <template v-slot:footer>
            <button
                id="modal-import-profile-from-code-invalid"
                class="button is-info"
                @click="installProfileHandler();">
                Import
            </button>
        </template>
    </ModalCard>

    <ModalCard v-else-if="isProfileBeingImported" key="PROFILE_IS_BEING_IMPORTED" :is-active="isOpen" :canClose="false">
        <template v-slot:header>
            <h2 class="modal-title">{{percentageImported}}% imported</h2>
        </template>
        <template v-slot:body>
            <p>This may take a while, as mods are being downloaded.</p>
            <p>Please do not close {{appName}}.</p>
        </template>
    </ModalCard>

    <ModalCard v-else-if="activeStep === 'ADDING_PROFILE'" key="ADDING_PROFILE" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:header>
            <h2 v-if="importUpdateSelection === 'IMPORT'" class="modal-title">Import a profile</h2>
        </template>
        <template v-slot:body v-if="importUpdateSelection === 'IMPORT'">
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
        </template>
        <template v-slot:body v-else-if="importUpdateSelection === 'UPDATE'">
            <div class="notification is-warning">
                <p>All contents of the profile will be overwritten with the contents of the code/file.</p>
            </div>
            <p>Select a profile below:</p>
            <br/>
            <select class="select" :value="activeProfileName" @change="profileSelectOnChange">
                <option v-for="profile of profileList" :key="profile">{{ profile }}</option>
            </select>
        </template>
        <template v-slot:footer v-if="importUpdateSelection === 'IMPORT'">
            <button id="modal-create-profile-invalid" class="button is-danger" v-if="doesProfileExist(newProfileName)">Create</button>
            <button id="modal-create-profile" class="button is-info" @click="createProfile(newProfileName)" v-else>Create</button>
        </template>
        <template v-slot:footer v-else-if="importUpdateSelection === 'UPDATE'">
            <button id="modal-update-profile-invalid" class="button is-danger" v-if="!doesProfileExist(activeProfileName)">Update profile: {{ activeProfileName }}</button>
            <button id="modal-update-profile" class="button is-info" v-else @click="updateProfile()">Update profile: {{ activeProfileName }}</button>
        </template>
    </ModalCard>

    <ModalCard v-else-if="activeStep === 'IMPORT_FILE'" key="IMPORT_FILE" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:body>
            <h3 class="title">Loading file</h3>
            <p>A file selection window will appear. Once a profile has been selected it may take a few moments.</p>
        </template>
    </ModalCard>
</template>

<style scoped>
.modal-title {
    font-size: 1.5rem;
}
</style>
