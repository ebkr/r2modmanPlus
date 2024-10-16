<script lang="ts">
import { mixins } from "vue-class-component";
import { Component } from 'vue-property-decorator';

import ManagerInformation from "../../_managerinf/ManagerInformation";
import R2Error from "../../model/errors/R2Error";
import ExportFormat from "../../model/exports/ExportFormat";
import ExportMod from "../../model/exports/ExportMod";
import ThunderstoreDownloaderProvider from "../../providers/ror2/downloading/ThunderstoreDownloaderProvider";
import InteractionProvider from "../../providers/ror2/system/InteractionProvider";
import { ProfileImportExport } from "../../r2mm/mods/ProfileImportExport";
import * as ProfileUtils from "../../utils/ProfileUtils";
import { ModalCard } from "../all";
import ProfilesMixin from "../mixins/ProfilesMixin.vue";
import OnlineModList from "../views/OnlineModList.vue";


@Component({
    components: { OnlineModList, ModalCard}
})
export default class ImportProfileModal extends mixins(ProfilesMixin) {
    private importUpdateSelection: "IMPORT" | "UPDATE" | null = null;
    private importPhaseDescription: string = 'Downloading mods: 0%';
    private profileImportCode: string = '';
    private listenerId: number = 0;
    private newProfileName: string = '';
    private profileImportFilePath: string | null = null;
    private profileImportContent: ExportFormat | null = null;
    private activeStep:
        'IMPORT_UPDATE_SELECTION'
        | 'FILE_CODE_SELECTION'
        | 'IMPORT_CODE'
        | 'IMPORT_FILE'
        | 'ADDING_PROFILE'
        | 'REVIEW_IMPORT'
        | 'NO_PACKAGES_IN_IMPORT'
        | 'PROFILE_IS_BEING_IMPORTED'
    = 'IMPORT_UPDATE_SELECTION';

    get appName(): string {
        return ManagerInformation.APP_NAME;
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
        this.activeStep = 'IMPORT_FILE';
        process.nextTick(() => {
            InteractionProvider.instance.selectFile({
                title: 'Import Profile',
                filters: [{
                    name: "*",
                    extensions: ["r2z"]
                }],
                buttonLabel: 'Import'
            }).then((value: string[]) => {
                if (value.length === 0) {
                    this.closeModal();
                }
                this.importProfileHandler(value);
            });
        });
    }

    async importProfileHandler(files: string[] | null) {
        if (files === null || files.length === 0) {
            this.closeModal();
            return;
        }

        let read: string | null = await ProfileUtils.readProfileFile(files[0]);

        if (read !== null) {
            this.profileImportFilePath = files[0];
            this.profileImportContent = await ProfileUtils.parseYamlToExportFormat(read);

            if (this.profileToOnlineMods.length === 0) {
                this.activeStep = 'NO_PACKAGES_IN_IMPORT';
                return;
            }

            this.activeStep = 'REVIEW_IMPORT';
        }
    }

    // Create an EventListener which gets triggered after the user either
    // creates a new profile or selects an existing one to be updated.
    async installProfileHandler() {
        const profileContent = this.profileImportContent;
        const filePath = this.profileImportFilePath;

        if (profileContent === null || filePath === null) {
            this.closeModal();
            const reason = `content is ${profileContent ? 'not' : ''} null, file path is ${filePath ? 'not' : ''} null`;
            this.$store.commit('error/handleError', R2Error.fromThrownValue(`Can't install profile: ${reason}`));
            return;
        }

        const localListenerId = this.listenerId + 1;
        this.listenerId = localListenerId;

        document.addEventListener(
            'created-profile',
            async (event: Event) => {
                const targetProfile = (event as CustomEvent).detail;
                if (typeof targetProfile === "string" && targetProfile.trim() !== '') {
                    await this.importProfile(targetProfile, localListenerId, profileContent.getMods(), filePath);
                } else {
                    this.closeModal();
                    this.$store.commit('error/handleError', R2Error.fromThrownValue(`Can't import profile: unknown target profile`));
                }
            },
            {once: true}
        );

        this.newProfileName = profileContent.getProfileName();
        this.activeStep = 'ADDING_PROFILE';
    }

    async importProfile(targetProfileName: string, localListenerId: number, mods: ExportMod[], zipPath: string) {
        if (this.listenerId !== localListenerId) {
            return;
        }

        this.activeStep = 'PROFILE_IS_BEING_IMPORTED';
        this.importPhaseDescription = 'Downloading mods: 0%';
        const progressCallback = (progress: number|string) => typeof progress === "number"
            ? this.importPhaseDescription = `Downloading mods: ${Math.floor(progress)}%`
            : this.importPhaseDescription = progress;
        const community = this.$store.state.activeGame.internalFolderName;
        const settings = this.$store.getters['settings'];
        const ignoreCache = settings.getContext().global.ignoreCache;
        const isUpdate = this.importUpdateSelection === 'UPDATE';

        try {
            const comboList = await ProfileUtils.exportModsToCombos(mods, community);
            await ThunderstoreDownloaderProvider.instance.downloadImportedMods(comboList, ignoreCache, progressCallback);
            await ProfileUtils.populateImportedProfile(comboList, mods, targetProfileName, isUpdate, zipPath, progressCallback);
        } catch (e) {
            await this.$store.dispatch('profiles/ensureProfileExists');
            this.closeModal();
            this.$store.commit('error/handleError', R2Error.fromThrownValue(e));
            return;
        }

        await this.$store.dispatch('profiles/setSelectedProfile', {profileName: targetProfileName, prewarmCache: true});
        this.closeModal();
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

    <ModalCard v-else-if="activeStep === 'IMPORT_FILE'" key="IMPORT_FILE" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:header>
            <h2 class="modal-title">Loading file</h2>
        </template>
        <template v-slot:footer>
            <p>A file selection window will appear. Once a profile has been selected it may take a few moments.</p>
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

    <ModalCard v-else-if="activeStep === 'NO_PACKAGES_IN_IMPORT'" key="NO_PACKAGES_IN_IMPORT" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:header>
            <h2 class="modal-title">There was a problem importing the profile</h2>
        </template>
        <template v-slot:body>
            <p>None of the packages inside the export were found on Thunderstore.</p>
            <p>There is nothing to import.</p>
        </template>
        <template v-slot:footer>
            <button
                id="modal-import-profile-from-code-invalid"
                class="button is-info"
                @click="closeModal">
                Close
            </button>
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

    <ModalCard v-else-if="activeStep === 'PROFILE_IS_BEING_IMPORTED'" key="PROFILE_IS_BEING_IMPORTED" :is-active="isOpen" :canClose="false">
        <template v-slot:header>
            <h2 class="modal-title">{{importPhaseDescription}}</h2>
        </template>
        <template v-slot:footer>
            <p>
                This may take a while, as files are being downloaded, extracted, and copied.
                <br><br>
                Please do not close {{appName}}.
            </p>
        </template>
    </ModalCard>
</template>

<style scoped>
.modal-title {
    font-size: 1.5rem;
}
</style>
