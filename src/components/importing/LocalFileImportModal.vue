<template>
    <div>
        <ModalCard id="import-mod-from-file-modal" :can-close="true" @close-modal="closeModal" :is-active="isOpen">
            <template v-slot:header>
                <h2 class='modal-title'>Import mod from file</h2>
            </template>
            <template v-slot:footer v-if="fileToImport === null">
                <button class="button is-info" @click="selectFile">Select file</button>
            </template>
            <template v-slot:footer v-else>
                <button class="button is-info" @click="importFile">Import local mod</button>
            </template>

            <template slot="body" v-if="fileToImport === null">
                <template v-if="!waitingForSelection">
                    <p>Please select a zip or DLL to be imported.</p>
                    <p>Zip files that contain a manifest file will have the some information pre-filled. If a manifest is not available, this will have to be entered manually.</p>
                </template>
                <template v-else>
                    <p>Waiting for file. This may take a minute.</p>
                </template>
            </template>

            <template v-slot:body v-if="fileToImport !== null">
                <div class="notification is-warning" v-if="validationMessage !== null">
                    <p>{{ validationMessage }}</p>
                </div>
                <div class="input-group input-group--flex margin-right">
                    <label for="mod-name" class="non-selectable">Mod name</label>
                    <input
                        v-model="modName"
                        id="mod-name"
                        class="input margin-right"
                        ref="mod-name"
                        type="text"
                        placeholder="Enter the name of the mod"
                        autocomplete="off"
                    />
                </div>
                <br/>
                <div class="input-group input-group--flex margin-right">
                    <label for="mod-author" class="non-selectable">Author</label>
                    <input
                        v-model="modAuthor"
                        id="mod-author"
                        class="input margin-right"
                        ref="mod-author"
                        type="text"
                        placeholder="Enter the author name"
                        autocomplete="off"
                    />
                </div>
                <br/>
                <div class="input-group input-group--flex margin-right">
                    <label for="mod-author" class="non-selectable">Description (optional)</label>
                    <input
                        v-model="modDescription"
                        id="mod-description"
                        class="input margin-right"
                        ref="mod-description"
                        type="text"
                        placeholder="Enter a description"
                        autocomplete="off"
                    />
                </div>
                <hr/>
                <h3 class="title is-6">Version</h3>
                <div class="input-group input-group--flex margin-right non-selectable">
                    <div class="is-flex">
                        <div class="margin-right margin-right--half-width">
                            <label for="mod-version-major">Major</label>
                            <input id="mod-version-major" ref="mod-version" class="input margin-right" type="number" v-model="modVersionMajor" min="0" step="1" placeholder="0"/>
                        </div>
                        <div class="margin-right margin-right--half-width">
                            <label for="mod-version-minor">Minor</label>
                            <input id="mod-version-minor" ref="mod-version" class="input margin-right" type="number" v-model="modVersionMinor" min="0" step="1" placeholder="0"/>
                        </div>
                        <div>
                            <label for="mod-version-patch">Patch</label>
                            <input id="mod-version-patch" ref="mod-version" class="input margin-right" type="number" v-model="modVersionPatch" min="0" step="1" placeholder="0"/>
                        </div>
                    </div>
                </div>
            </template>
        </ModalCard>
    </div>
</template>

<script lang="ts" setup>

import InteractionProvider from '../../providers/ror2/system/InteractionProvider';
import * as path from 'path';
import VersionNumber from '../../model/VersionNumber';
import ZipProvider from '../../providers/generic/zip/ZipProvider';
import ManifestV2 from '../../model/ManifestV2';
import R2Error from '../../model/errors/R2Error';
import { ImmutableProfile } from '../../model/Profile';
import ProfileModList from '../../r2mm/mods/ProfileModList';
import LocalModInstallerProvider from '../../providers/ror2/installing/LocalModInstallerProvider';
import ModalCard from '../ModalCard.vue';
import { ref, defineProps, computed } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';

const store = getStore<State>();

type LocalFileImportModalProps = {
    visible: boolean;
}

const isOpen = computed(() => store.state.modals.isLocalFileImportModalOpen);

const props = defineProps<LocalFileImportModalProps>();

const fileToImport = ref<string | null>(null);
const waitingForSelection = ref<boolean>(false);
const validationMessage = ref<string | null>(null);

const modName = ref<string>("");
const modAuthor = ref<string>("Unknown");
const modDescription = ref<string>("");
const modVersionMajor = ref<number>(0);
const modVersionMinor = ref<number>(0);
const modVersionPatch = ref<number>(0);

let resultingManifest = new ManifestV2();

async function selectFile() {
    waitingForSelection.value = true;
    InteractionProvider.instance.selectFile({
        buttonLabel: "Select file",
        title: "Import local mod from file",
        filters: []
    }).then(value => {
        if (value.length > 0) {
            fileToImport.value = value[0];
            assumeDefaults();
        } else {
            waitingForSelection.value = false;
            fileToImport.value = null;
        }
    })
}

async function resetValues() {
    modName.value = "";
    modAuthor.value = "Unknown";
    modDescription.value = "";
    modVersionMajor.value = 0;
    modVersionMinor.value = 0;
    modVersionPatch.value = 0;
    fileToImport.value = null;
    waitingForSelection.value = false;
    validationMessage.value = null;
}

async function assumeDefaults() {

    modName.value = "";
    modAuthor.value = "Unknown";
    modDescription.value = "";
    modVersionMajor.value = 0;
    modVersionMinor.value = 0;
    modVersionPatch.value = 0;

    resultingManifest = new ManifestV2();

    if (fileToImport.value === null) { return }

    if (fileToImport.value.endsWith(".zip")) {
        const entries = await ZipProvider.instance.getEntries(fileToImport.value);
        if (entries.filter(value => value.entryName === "manifest.json").length === 1) {
            const manifestContents = await ZipProvider.instance.readFile(fileToImport.value, "manifest.json");
            if (manifestContents !== null) {
                const manifestJson: any = JSON.parse(manifestContents.toString().trim());
                const manifestOrErr = new ManifestV2().makeSafeFromPartial(manifestJson);
                if (manifestOrErr instanceof R2Error) {
                    // Assume V1. Allow user to correct anything incorrect in case manifest is not Thunderstore valid.
                    modName.value = manifestJson.name || "";
                    modDescription.value = manifestJson.description || "";
                    const modVersion = new VersionNumber(manifestJson.version_number || "").toString().split(".");
                    modVersionMajor.value = Number(modVersion[0]);
                    modVersionMinor.value = Number(modVersion[1]);
                    modVersionPatch.value = Number(modVersion[2]);
                    const inferred = inferFieldValuesFromFile(fileToImport.value);
                    modAuthor.value = inferred.modAuthor;
                    resultingManifest.setDependencies(manifestJson.dependencies || []);
                    return;
                } else {
                    resultingManifest = manifestOrErr;
                    modName.value = manifestOrErr.getDisplayName();
                    modAuthor.value = manifestOrErr.getAuthorName();
                    modDescription.value = manifestOrErr.getDescription();
                    const modVersion = manifestOrErr.getVersionNumber().toString().split(".");
                    modVersionMajor.value = Number(modVersion[0]);
                    modVersionMinor.value = Number(modVersion[1]);
                    modVersionPatch.value = Number(modVersion[2]);
                    // TODO: Make fields readonly if V2 is provided.
                    return;
                }
            }
        } else {
            console.log("Does not contain manifest");
        }
    }

    const inferred = inferFieldValuesFromFile(fileToImport.value);

    modName.value = inferred.modName
    modAuthor.value = inferred.modAuthor;
    modVersionMajor.value = inferred.modVersionMajor;
    modVersionMinor.value = inferred.modVersionMinor;
    modVersionPatch.value = inferred.modVersionPatch;
}

function inferFieldValuesFromFile(file: string): ImportFieldAttributes {
    const fileSafe = file.split("\\").join("/");
    const fileName = path.basename(fileSafe, path.extname(fileSafe));
    const hyphenSeparated = fileName.split("-");
    const underscoreSeparated = fileName.split("_");

    const data: ImportFieldAttributes = {
        modName: "",
        modAuthor: "Unknown",
        modVersionMajor: 0,
        modVersionMinor: 0,
        modVersionPatch: 0,
    }

    if (hyphenSeparated.length === 3) {
        data.modAuthor = hyphenSeparated[0];
        data.modName = hyphenSeparated[1];
        const modVersion = santizeVersionNumber(hyphenSeparated[2]).toString().split(".");
        data.modVersionMajor = Number(modVersion[0]);
        data.modVersionMinor = Number(modVersion[1]);
        data.modVersionPatch = Number(modVersion[2]);
    } else if (hyphenSeparated.length === 2) {
        data.modName = hyphenSeparated[0];
        const modVersion = santizeVersionNumber(hyphenSeparated[1]).toString().split(".");
        data.modVersionMajor = Number(modVersion[0]);
        data.modVersionMinor = Number(modVersion[1]);
        data.modVersionPatch = Number(modVersion[2]);
    } else if (underscoreSeparated.length === 3) {
        data.modAuthor = underscoreSeparated[0];
        data.modName = underscoreSeparated[1];
        const modVersion = santizeVersionNumber(underscoreSeparated[2]).toString().split(".");
        data.modVersionMajor = Number(modVersion[0]);
        data.modVersionMinor = Number(modVersion[1]);
        data.modVersionPatch = Number(modVersion[2]);
    } else if (underscoreSeparated.length === 2) {
        data.modName = underscoreSeparated[0];
        const modVersion = santizeVersionNumber(underscoreSeparated[1]).toString().split(".");
        data.modVersionMajor = Number(modVersion[0]);
        data.modVersionMinor = Number(modVersion[1]);
        data.modVersionPatch = Number(modVersion[2]);
    } else {
        data.modName = fileName;
    }

    return data;
}

function santizeVersionNumber(vn: string): VersionNumber {
    const modVersionSplit = vn.split(".");
    const modVersionString = `${versionPartToNumber(modVersionSplit[0])}.${versionPartToNumber(modVersionSplit[1])}.${versionPartToNumber(modVersionSplit[2])}`;
    return new VersionNumber(modVersionString);
}

function versionPartToNumber(input: string | undefined) {
    return (input || "0").split(new RegExp("[^0-9]+"))
        .filter(value => value.trim().length > 0)
        .shift() || "0";
}

async function closeModal() {
    await resetValues();
    store.commit("closeLocalFileImportModal");
}

async function importFile() {
    if (fileToImport.value === null) {
        return;
    }

    switch (0) {
        case modName.value.trim().length:
            validationMessage.value = "The mod name must not be empty.";
            return;
        case modAuthor.value.trim().length:
            validationMessage.value = "The mod author must not be empty.";
            return;
    }

    switch (NaN) {
        case Number(modVersionMajor.value):
        case Number(modVersionMinor.value):
        case Number(modVersionPatch.value):
            validationMessage.value = "Major, minor, and patch must all be numbers.";
            return;
    }

    if (modVersionMajor.value < 0) {
        validationMessage.value = "Major, minor, and patch must be whole numbers greater than 0.";
        return;
    }
    if (modVersionMinor.value < 0) {
        validationMessage.value = "Major, minor, and patch must be whole numbers greater than 0.";
        return;
    }
    if (modVersionPatch.value < 0) {
        validationMessage.value = "Major, minor, and patch must be whole numbers greater than 0.";
        return;
    }

    const profile: ImmutableProfile|null = store.state.profile.activeProfile
        ? store.state.profile.activeProfile.asImmutableProfile()
        : null;

    if (profile === null) {
        validationMessage.value = "Profile is not selected";
        return;
    }

    resultingManifest.setName(`${modAuthor.value.trim()}-${modName.value.trim()}`);
    resultingManifest.setDisplayName(modName.value.trim());
    resultingManifest.setVersionNumber(new VersionNumber(`${modVersionMajor.value}.${modVersionMinor.value}.${modVersionPatch.value}`));
    resultingManifest.setDescription(modDescription.value.trim());
    resultingManifest.setAuthorName(modAuthor.value.trim());

    try {
        if (fileToImport.value.endsWith(".zip")) {
            await LocalModInstallerProvider.instance.extractToCacheWithManifestData(profile, fileToImport.value, resultingManifest);
        } else {
            await LocalModInstallerProvider.instance.placeFileInCache(profile, fileToImport.value, resultingManifest);
        }
    } catch (e) {
        store.commit('error/handleError', R2Error.fromThrownValue(e));
        return;
    }

    const updatedModListResult = await ProfileModList.getModList(profile);
    if (updatedModListResult instanceof R2Error) {
        store.commit('error/handleError', R2Error.fromThrownValue(updatedModListResult));
    } else {
        await store.dispatch("profile/updateModList", updatedModListResult);
        closeModal();
    }
}

interface ImportFieldAttributes {
    modName: string;
    modAuthor: string;
    modVersionMajor: number;
    modVersionMinor: number;
    modVersionPatch: number;
}
</script>
