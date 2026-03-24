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
        Promise.resolve().then(async () => {
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
            <h2 class="modal-title" v-if="importUpdateSelection === 'CREATE'">{{ $t('ImportProfileModal.how_are_you_importing_a_profil') }}</h2>
            <h2 class="modal-title" v-if="importUpdateSelection === 'UPDATE'">{{ $t('ImportProfileModal.how_are_you_updating_your_prof') }}</h2>
        </template>
        <template v-slot:footer>
            <button id="modal-import-profile-file"
                    class="button is-info"
                    @click="onFileOrCodeSelect('FILE')">{{ $t('ImportProfileModal.from_file') }}</button>
            <button id="modal-import-profile-code"
                    class="button is-primary"
                    @click="onFileOrCodeSelect('CODE')">{{ $t('ImportProfileModal.from_code') }}</button>
        </template>
    </ModalCard>

    <ModalCard id="import-profile-from-file-modal" v-else-if="activeStep === 'IMPORT_FILE'" key="IMPORT_FILE" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:header>
            <h2 class="modal-title">{{ $t('ImportProfileModal.loading_file') }}</h2>
        </template>
        <template v-slot:footer>
            <p>{{ $t('ImportProfileModal.a_file_selection_window_will_a') }}</p>
        </template>
    </ModalCard>

    <ModalCard id="import-profile-from-code-modal" v-else-if="activeStep === 'IMPORT_CODE'" :can-close="!importViaCodeInProgress" key="IMPORT_CODE" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:header>
            <h2 class="modal-title">{{ $t('ImportProfileModal.enter_the_profile_code') }}</h2>
        </template>
        <template v-slot:body>
            <input
                v-model="profileImportCode"
                @keyup.enter="isProfileCodeValid && !importViaCodeInProgress && onProfileCodeEntered()"
                id="import-profile-modal-profile-code"
                class="input"
                type="text"
                ref="profileCodeInput"
                :placeholder="$t('ImportProfileModal.enter_the_profile_code')"
                autocomplete="off"
            />
            <br />
            <br />
            <span class="tag is-danger" v-if="profileImportCode !== '' && !isProfileCodeValid"> {{ $t('ImportProfileModal.invalid_code_check_for_typos') }} </span>
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
            <h2 class="modal-title">{{ $t('ImportProfileModal.refreshing_online_mod_list') }}</h2>
        </template>
        <template v-slot:footer>
            <div>
                <p> {{ $t('ImportProfileModal.some_of_the_packages_in_the_pr') }} </p>
                <p v-if="store.getters['download/activeDownloadCount'] > 0" class="margin-top"> {{ $t('ImportProfileModal.waiting_for_mod_downloads_to_f') }} </p>
                <p v-else class="margin-top">
                    {{store.state.tsMods.thunderstoreModListUpdateStatus}}
                </p>
            </div>
        </template>
    </ModalCard>

    <ModalCard id="review-profile-import-modal" v-else-if="activeStep === 'REVIEW_IMPORT'" key="REVIEW_IMPORT" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:header>
            <h2 class="modal-title">{{ $t('ImportProfileModal.packages_to_be_installed') }}</h2>
        </template>
        <template v-slot:body>
            <div v-if="knownProfileMods.length === 0 || profileMods.unknown.length > 0" class="notification is-warning">
                <p>{{ $t('ImportProfileModal.these_packages_in_the_profile') }}</p>
                <p class="margin-top">{{ unknownProfileModNames }}</p>

                <p v-if="knownProfileMods.length === 0" class="margin-top"> {{ $t('ImportProfileModal.ensure_the_profile_is_intended') }} </p>
            </div>

            <p v-if="knownProfileMods.length > 0 && profileMods.unknown.length > 0" class="margin-bottom">{{ $t('ImportProfileModal.these_packages_will_be_install') }}</p>
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
                <label for="partialImportAllowedCheckbox">{{ $t('ImportProfileModal.i_understand_that_some_of_the') }}</label>
            </div>

            <button
                id="modal-review-confirmed"
                ref="reviewConfirmedButton"
                class="button is-info"
                :disabled="knownProfileMods.length === 0 || (profileMods.unknown.length > 0 && !isPartialImportAllowed)"
                @click="onProfileReviewConfirmed"
            > {{ $t('ImportProfileModal.import') }} </button>

        </template>
    </ModalCard>

    <ModalCard id="import-or-update-profile-selection-modal" v-else-if="activeStep === 'IMPORT_UPDATE_SELECTION'" key="IMPORT_UPDATE_SELECTION" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:header>
            <h2 class="modal-title">{{ $t('ImportProfileModal.are_you_going_to_be_updating_a') }}</h2>
        </template>
        <template v-slot:footer>
            <button id="modal-import-new-profile"
                    class="button is-info"
                    @click="onCreateOrUpdateSelect('CREATE')"> {{ $t('ImportProfileModal.import_new_profile') }} </button>
            <button id="modal-update-existing-profile"
                    class="button is-primary"
                    @click="onCreateOrUpdateSelect('UPDATE')"> {{ $t('ImportProfileModal.update_existing_profile') }} </button>
        </template>
    </ModalCard>

    <ModalCard id="import-add-profile-modal" v-else-if="activeStep === 'ADDING_PROFILE'" key="ADDING_PROFILE" :is-active="isOpen" @close-modal="closeModal">
        <template v-slot:header>
            <h2 v-if="importUpdateSelection === 'CREATE'" class="modal-title">{{ $t('ImportProfileModal.import_a_profile') }}</h2>
        </template>
        <template v-slot:body v-if="importUpdateSelection === 'CREATE'">
            <p>{{ $t('ImportProfileModal.this_profile_will_store_its_ow') }}</p>
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
            <span class="tag is-dark" v-if="makeProfileNameSafe(targetProfileName) === ''"> {{ $t('ImportProfileModal.profile_name_required') }} </span>
            <span class="tag is-success" v-else-if="!doesProfileExist(targetProfileName)">
                "{{makeProfileNameSafe(targetProfileName)}}{{ $t('ImportProfileModal.is_available') }} </span>
            <span class="tag is-danger" v-else>
                "{{makeProfileNameSafe(targetProfileName)}}{{ $t('ImportProfileModal.is_either_already_in_use_or_c') }} </span>
        </template>
        <template v-slot:body v-else-if="importUpdateSelection === 'UPDATE'">
            <div class="notification is-warning">
                <p>{{ $t('ImportProfileModal.all_contents_of_the_profile_wi') }}</p>
            </div>
            <p>{{ $t('ImportProfileModal.select_a_profile_below') }}</p>
            <br/>
            <select class="select" v-model="targetProfileName">
                <option v-for="profile of profileList" :key="profile">{{ profile }}</option>
            </select>
        </template>
        <template v-slot:footer v-if="importUpdateSelection === 'CREATE'">
            <button id="modal-create-profile-invalid" class="button is-danger" v-if="doesProfileExist(targetProfileName)">{{ $t('ImportProfileModal.create') }}</button>
            <button id="modal-create-profile" class="button is-info" v-else @click="onImportTargetSelected()">{{ $t('ImportProfileModal.create') }}</button>
        </template>
        <template v-slot:footer v-else-if="importUpdateSelection === 'UPDATE'">
            <button id="modal-update-profile-invalid" class="button is-danger" v-if="!doesProfileExist(targetProfileName)">{{ $t('ImportProfileModal.update_profile') }} {{ targetProfileName }}</button>
            <button id="modal-update-profile" class="button is-info" v-else @click="onImportTargetSelected()">{{ $t('ImportProfileModal.update_profile') }} {{ targetProfileName }}</button>
        </template>
    </ModalCard>

    <ModalCard id="profile-importing-in-progress-modal" v-else-if="activeStep === 'PROFILE_IS_BEING_IMPORTED'" key="PROFILE_IS_BEING_IMPORTED" :is-active="isOpen" :canClose="false">
        <template v-slot:header>
            <h2 class="modal-title">{{importPhaseDescription}}</h2>
        </template>
        <template v-slot:footer>
            <p> {{ $t('ImportProfileModal.this_may_take_a_while_as_files') }} <br><br> {{ $t('ImportProfileModal.please_do_not_close') }} {{appName}}.
            </p>
        </template>
    </ModalCard>
</template>

<style scoped>
.modal-title {
    font-size: 1.5rem;
}
</style>
