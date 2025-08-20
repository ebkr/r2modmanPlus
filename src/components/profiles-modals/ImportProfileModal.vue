<script lang="ts" setup>

import ManagerInformation from "../../_managerinf/ManagerInformation";
import R2Error from "../../model/errors/R2Error";
import ExportFormat from "../../model/exports/ExportFormat";
import ExportMod from "../../model/exports/ExportMod";
import ThunderstoreCombo from "../../model/ThunderstoreCombo";
import InteractionProvider from "../../providers/ror2/system/InteractionProvider";
import { ProfileImportExport } from "../../r2mm/mods/ProfileImportExport";
import { sleep } from "../../utils/Common";
import * as ProfileUtils from "../../utils/ProfileUtils";
import { ModalCard } from "../all";
import OnlineModList from "../views/OnlineModList.vue";
import { useProfilesComposable } from '../composables/ProfilesComposable';
import { computed, nextTick, ref, watch, watchEffect } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import FileUtils from "../../utils/FileUtils";
import * as DownloadUtils from "../../utils/DownloadUtils";

const VALID_PROFILE_CODE_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const store = getStore<State>();

const {
    doesProfileExist,
    makeProfileNameSafe,
} = useProfilesComposable();

const importUpdateSelection = ref<'CREATE' | 'UPDATE'>('CREATE');
const importPhaseDescription = ref<string>('Downloading mods: 0%');
const importViaCodeInProgress = ref<boolean>(false);
const profileImportCode = ref<string>('');
const targetProfileName = ref<string>('');
const profileImportFilePath = ref<string | null>(null);
const profileImportContent = ref<ExportFormat | null>(null);
const profileMods = ref<{known: ThunderstoreCombo[], unknown: string[]}>({known: [], unknown: []});
const isPartialImportAllowed = ref<boolean>(false);

type ActiveStep =
    'FILE_CODE_SELECTION'
    | 'IMPORT_FILE'
    | 'IMPORT_CODE'
    | 'REFRESH_MOD_LIST'
    | 'REVIEW_IMPORT'
    | 'IMPORT_UPDATE_SELECTION'
    | 'ADDING_PROFILE'
    | 'PROFILE_IS_BEING_IMPORTED'
const activeStep = ref<ActiveStep>('FILE_CODE_SELECTION');

const appName = computed(() => ManagerInformation.APP_NAME);
const isOpen = computed(() => store.state.modals.isImportProfileModalOpen);
const profileList = computed(() => store.state.profiles.profileList);
const knownProfileMods = computed(() => profileMods.value.known.map((combo) => combo.getMod()));
const unknownProfileModNames = computed(() => profileMods.value.unknown.join(', '));
const isProfileCodeValid = computed(() => VALID_PROFILE_CODE_REGEX.test(profileImportCode.value));
const profileTotalDownloadSize = ref<number>(0);

const profileCodeInput = ref<HTMLInputElement>();
const profileNameInput = ref<HTMLInputElement>();
const reviewConfirmedButton = ref<HTMLButtonElement>();

function closeModal() {
    activeStep.value = 'FILE_CODE_SELECTION';
    targetProfileName.value = '';
    importUpdateSelection.value = 'CREATE';
    importViaCodeInProgress.value = false;
    profileImportCode.value = '';
    profileImportFilePath.value = null;
    profileImportContent.value = null;
    profileMods.value = {known: [], unknown: []};
    store.commit('closeImportProfileModal');
}

watchEffect(async () => {
    if (activeStep.value === 'IMPORT_CODE') {
        await nextTick();
        profileCodeInput.value && profileCodeInput.value.focus();
    }
    else if (activeStep.value === 'ADDING_PROFILE') {
        await nextTick();
        profileNameInput.value && profileNameInput.value.focus();
    }
    else if (activeStep.value === 'REVIEW_IMPORT') {
        await nextTick();
        reviewConfirmedButton.value && reviewConfirmedButton.value.focus();
    }
});


// Required to trigger a re-render of the modlist in preview step
// when the online modlist is refreshed.
watch(store.state.tsMods.mods, async() => {
    if (profileImportContent.value === null) {
        return;
    }

    profileMods.value = await ProfileUtils.exportModsToCombos(
        profileImportContent.value.getMods(),
        store.state.activeGame
    );
})

// Fired when user selects to import either from file or code.
async function onFileOrCodeSelect(mode: 'FILE' | 'CODE') {
    if (mode === 'FILE') {
        activeStep.value = 'IMPORT_FILE';
        process.nextTick(async () => {
            const files = await InteractionProvider.instance.selectFile({
                title: 'Import Profile',
                filters: [{
                    name: "*",
                    extensions: ["r2z"]
                }],
                buttonLabel: 'Import'
            });
            await validateProfileFile(files);
        });
    } else {
        activeStep.value = 'IMPORT_CODE';
    }
}

// Fired when user has entered a profile code to import.
async function onProfileCodeEntered() {
    try {
        importViaCodeInProgress.value = true;
        const filepath = await ProfileImportExport.downloadProfileCode(profileImportCode.value.trim());
        await validateProfileFile([filepath]);
    } catch (e: any) {
        const err = R2Error.fromThrownValue(e, 'Failed to import profile');
        store.commit('error/handleError', err);
    } finally {
        importViaCodeInProgress.value = false;
    }
}

// Check that selected profile zip is valid and proceed.
async function validateProfileFile(files: string[] | null) {
    if (files === null || files.length === 0) {
        closeModal();
        return;
    }

    try {
        const yamlContent = await ProfileUtils.readProfileFile(files[0]);
        profileImportContent.value = await ProfileUtils.parseYamlToExportFormat(yamlContent);
        profileMods.value = await ProfileUtils.exportModsToCombos(
            profileImportContent.value.getMods(),
            store.state.activeGame
        );
    } catch (e: unknown) {
        const err = R2Error.fromThrownValue(e);
        store.commit('error/handleError', err);
        closeModal();
        return;
    }

    profileImportFilePath.value = files[0];

    if (profileMods.value.unknown.length > 0) {
        // Sometimes the reason some packages are unknown is that
        // the mod list is out of date, so let's try refreshing it
        activeStep.value = 'REFRESH_MOD_LIST';

        // Mod downloads in progress will prevent mod list refresh, so wait
        // them out first.
        while (store.getters['download/activeDownloadCount'] > 0) {
            await sleep(100);
        }

        // Awaiting the sync doesn't work here as the function will immediately
        // return if the process is already in progress, e.g. when the splash
        // screen has started the process in the background. Use while-loop
        // instead to wait in this screen.
        try {
            await store.dispatch('tsMods/syncPackageList');
        } catch (e: unknown) {
            const err = R2Error.fromThrownValue(e);
            store.commit('error/handleError', err);
            closeModal();
            return;
        }

        while (store.state.tsMods.isThunderstoreModListUpdateInProgress) {
            await sleep(100);
        }
    }

    activeStep.value = 'REVIEW_IMPORT';
}

// Fired when user has accepted the mods to be imported in the review phase.
async function onProfileReviewConfirmed() {
    const profileContent = profileImportContent.value;
    const filePath = profileImportFilePath.value;

    // Check and return early for better UX.
    if (profileContent === null || filePath === null) {
        onContentOrPathNotSet();
        return;
    }

    targetProfileName.value = profileContent.getProfileName();
    activeStep.value = 'IMPORT_UPDATE_SELECTION';
}

// Fired when user selects whether to import a new profile or update existing one.
function onCreateOrUpdateSelect(mode: 'CREATE' | 'UPDATE') {
    importUpdateSelection.value = mode;

    if (mode === 'UPDATE') {
        targetProfileName.value = store.getters['profile/activeProfileName'];
    }

    activeStep.value = 'ADDING_PROFILE';
}

// Fired when user confirms the import target location (new or existing profile).
async function onImportTargetSelected() {
    const profileContent = profileImportContent.value;
    const filePath = profileImportFilePath.value;

    // Recheck to ensure values haven't changed and to satisfy TypeScript.
    if (profileContent === null || filePath === null) {
        onContentOrPathNotSet();
        return;
    }

    const importTargetProfileName = makeProfileNameSafe(targetProfileName.value);

    // Sanity check, should not happen.
    if (importTargetProfileName === '') {
        const err = new R2Error("Can't import profile: unknown target profile", "Please try again");
        store.commit('error/handleError', err);
        return;
    }

    if (importUpdateSelection.value === 'CREATE') {
        try {
            await store.dispatch('profiles/addProfile', importTargetProfileName);
        } catch (e) {
            closeModal();
            const err = R2Error.fromThrownValue(e, 'Error while creating profile');
            store.commit('error/handleError', err);
            return;
        }
    }

    await importProfile(importTargetProfileName, profileContent.getMods(), filePath);
}

async function importProfile(targetProfileName: string, mods: ExportMod[], zipPath: string) {
    activeStep.value = 'PROFILE_IS_BEING_IMPORTED';
    importPhaseDescription.value = 'Downloading mods: 0%';
    const progressCallback = (downloadedSize: number) => {
        importPhaseDescription.value = `Downloading mods: ${DownloadUtils.generateProgressPercentage(downloadedSize, profileTotalDownloadSize.value)}%` +
         ` of ${FileUtils.humanReadableSize(profileTotalDownloadSize.value)}`;
    };
    const isUpdate = importUpdateSelection.value === 'UPDATE';

    try {
        const combos = profileMods.value.known as ThunderstoreCombo[];
        profileTotalDownloadSize.value = await DownloadUtils.getTotalDownloadSizeInBytes(combos, store.state.download.ignoreCache);

        await store.dispatch('download/downloadToCache', {combos, progressCallback});
        await ProfileUtils.populateImportedProfile(combos, mods, targetProfileName, isUpdate, zipPath, (progress) => {
            importPhaseDescription.value = progress;
        });
    } catch (e) {
        await store.dispatch('profiles/ensureProfileExists');
        closeModal();
        store.commit('error/handleError', R2Error.fromThrownValue(e));
        return;
    }

    await store.dispatch('profiles/setSelectedProfile', {profileName: targetProfileName, prewarmCache: true});
    closeModal();
}

function onContentOrPathNotSet() {
    closeModal();
    const reason = `content is ${profileImportContent.value ? 'not' : ''} null, file path is ${profileImportFilePath.value ? 'not' : ''} null`;
    store.commit('error/handleError', R2Error.fromThrownValue(`Can't install profile: ${reason}`));
}
</script>

<template>
    <ModalCard id="import-profile-from-file-or-code-modal" v-if="activeStep === 'FILE_CODE_SELECTION'" key="FILE_CODE_SELECTION" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:header>
            <h2 class="modal-title" v-if="importUpdateSelection === 'CREATE'">How are you importing a profile?</h2>
            <h2 class="modal-title" v-if="importUpdateSelection === 'UPDATE'">How are you updating your profile?</h2>
        </template>
        <template v-slot:footer>
            <button id="modal-import-profile-file"
                    class="button is-info"
                    @click="onFileOrCodeSelect('FILE')">From file</button>
            <button id="modal-import-profile-code"
                    class="button is-primary"
                    @click="onFileOrCodeSelect('CODE')">From code</button>
        </template>
    </ModalCard>

    <ModalCard id="import-profile-from-file-modal" v-else-if="activeStep === 'IMPORT_FILE'" key="IMPORT_FILE" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:header>
            <h2 class="modal-title">Loading file</h2>
        </template>
        <template v-slot:footer>
            <p>A file selection window will appear. Once a profile has been selected it may take a few moments.</p>
        </template>
    </ModalCard>

    <ModalCard id="import-profile-from-code-modal" v-else-if="activeStep === 'IMPORT_CODE'" :can-close="!importViaCodeInProgress" key="IMPORT_CODE" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:header>
            <h2 class="modal-title">Enter the profile code</h2>
        </template>
        <template v-slot:body>
            <input
                v-model="profileImportCode"
                @keyup.enter="isProfileCodeValid && !importViaCodeInProgress && onProfileCodeEntered()"
                id="import-profile-modal-profile-code"
                class="input"
                type="text"
                ref="profileCodeInput"
                placeholder="Enter the profile code"
                autocomplete="off"
            />
            <br />
            <br />
            <span class="tag is-danger" v-if="profileImportCode !== '' && !isProfileCodeValid">
                Invalid code, check for typos
            </span>
        </template>
        <template v-slot:footer>
            <button
                :disabled="!isProfileCodeValid || importViaCodeInProgress"
                id="modal-import-profile-from-code"
                class="button is-info"
                @click="onProfileCodeEntered();">
                {{importViaCodeInProgress ? 'Loading...' : 'Continue'}}
            </button>
        </template>
    </ModalCard>

    <ModalCard id="import-profile-refresh-mod-list-modal" v-else-if="activeStep === 'REFRESH_MOD_LIST'" key="REFRESH_MOD_LIST" :is-active="isOpen" :can-close="false">
        <template v-slot:header>
            <h2 class="modal-title">Refreshing online mod list</h2>
        </template>
        <template v-slot:footer>
            <div>
                <p>
                    Some of the packages in the profile are not recognized by the mod manager.
                    Refreshing the online mod list might fix the problem. Please wait...
                </p>
                <p v-if="$store.getters['download/activeDownloadCount'] > 0" class="margin-top">
                    Waiting for mod downloads to finish before refreshing the online mod list...
                </p>
                <p v-else class="margin-top"></p>
                    {{$store.state.tsMods.thunderstoreModListUpdateStatus}}
                </p>
            </div>
        </template>
    </ModalCard>

    <ModalCard id="review-profile-import-modal" v-else-if="activeStep === 'REVIEW_IMPORT'" key="REVIEW_IMPORT" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:header>
            <h2 class="modal-title">Packages to be installed</h2>
        </template>
        <template v-slot:body>
            <div v-if="knownProfileMods.length === 0 || profileMods.unknown.length > 0" class="notification is-warning">
                <p>These packages in the profile were not found on Thunderstore and will not be installed:</p>
                <p class="margin-top">{{ unknownProfileModNames }}</p>

                <p v-if="knownProfileMods.length === 0" class="margin-top">
                    Ensure the profile is intended for the currently selected game.
                </p>
            </div>

            <p v-if="knownProfileMods.length > 0 && profileMods.unknown.length > 0" class="margin-bottom">These packages will be installed:</p>
            <OnlineModList
                v-if="knownProfileMods.length > 0"
                :paged-mod-list="knownProfileMods"
                :read-only="true"
            />
        </template>
        <template v-slot:footer>

            <div v-if="knownProfileMods.length > 0 && profileMods.unknown.length > 0" class="is-flex-grow-1">
                <input
                    v-model="isPartialImportAllowed"
                    id="partialImportAllowedCheckbox"
                    class="is-checkradio has-background-color"
                    type="checkbox"
                >
                <label for="partialImportAllowedCheckbox">I understand that some of the mods won't be imported</label>
            </div>

            <button
                id="modal-review-confirmed"
                ref="reviewConfirmedButton"
                class="button is-info"
                :disabled="knownProfileMods.length === 0 || (profileMods.unknown.length > 0 && !isPartialImportAllowed)"
                @click="onProfileReviewConfirmed"
            >
                Import
            </button>

        </template>
    </ModalCard>

    <ModalCard id="import-or-update-profile-selection-modal" v-else-if="activeStep === 'IMPORT_UPDATE_SELECTION'" key="IMPORT_UPDATE_SELECTION" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:header>
            <h2 class="modal-title">Are you going to be updating an existing profile or creating a new one?</h2>
        </template>
        <template v-slot:footer>
            <button id="modal-import-new-profile"
                    class="button is-info"
                    @click="onCreateOrUpdateSelect('CREATE')">
                Import new profile
            </button>
            <button id="modal-update-existing-profile"
                    class="button is-primary"
                    @click="onCreateOrUpdateSelect('UPDATE')">
                Update existing profile
            </button>
        </template>
    </ModalCard>

    <ModalCard id="import-add-profile-modal" v-else-if="activeStep === 'ADDING_PROFILE'" key="ADDING_PROFILE" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:header>
            <h2 v-if="importUpdateSelection === 'CREATE'" class="modal-title">Import a profile</h2>
        </template>
        <template v-slot:body v-if="importUpdateSelection === 'CREATE'">
            <p>This profile will store its own mods independently from other profiles.</p>
            <br/>
            <input
                v-model="targetProfileName"
                @keyup.enter="!doesProfileExist(targetProfileName) && onImportTargetSelected()"
                id="import-profile-modal-new-profile-name"
                class="input"
                type="text"
                ref="profileNameInput"
                autocomplete="off"
            />
            <br/><br/>
            <span class="tag is-dark" v-if="makeProfileNameSafe(targetProfileName) === ''">
                Profile name required
            </span>
            <span class="tag is-success" v-else-if="!doesProfileExist(targetProfileName)">
                "{{makeProfileNameSafe(targetProfileName)}}" is available
            </span>
            <span class="tag is-danger" v-else>
                "{{makeProfileNameSafe(targetProfileName)}}" is either already in use, or contains invalid characters
            </span>
        </template>
        <template v-slot:body v-else-if="importUpdateSelection === 'UPDATE'">
            <div class="notification is-warning">
                <p>All contents of the profile will be overwritten with the contents of the code/file.</p>
            </div>
            <p>Select a profile below:</p>
            <br/>
            <select class="select" v-model="targetProfileName">
                <option v-for="profile of profileList" :key="profile">{{ profile }}</option>
            </select>
        </template>
        <template v-slot:footer v-if="importUpdateSelection === 'CREATE'">
            <button id="modal-create-profile-invalid" class="button is-danger" v-if="doesProfileExist(targetProfileName)">Create</button>
            <button id="modal-create-profile" class="button is-info" v-else @click="onImportTargetSelected()">Create</button>
        </template>
        <template v-slot:footer v-else-if="importUpdateSelection === 'UPDATE'">
            <button id="modal-update-profile-invalid" class="button is-danger" v-if="!doesProfileExist(targetProfileName)">Update profile: {{ targetProfileName }}</button>
            <button id="modal-update-profile" class="button is-info" v-else @click="onImportTargetSelected()">Update profile: {{ targetProfileName }}</button>
        </template>
    </ModalCard>

    <ModalCard id="profile-importing-in-progress-modal" v-else-if="activeStep === 'PROFILE_IS_BEING_IMPORTED'" key="PROFILE_IS_BEING_IMPORTED" :is-active="isOpen" :canClose="false">
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
