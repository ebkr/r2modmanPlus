<template>
    <div>
        <Modal :show-close="true" @close-modal="emitClose" :open="visible">
            <template slot="title">
                <p class='card-header-title'>Import mod from file</p>
            </template>
            <template slot="footer" v-if="fileToImport === null">
                <button class="button is-info" @click="selectFile">Select file</button>
            </template>
            <template slot="footer" v-else-if="fileToImport !== null">
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

            <template slot="body" v-if="fileToImport !== null">
                <div class="input-group input-group--flex margin-right">
                    <label for="mod-name" class="non-selectable">Mod name</label>
                    <input id="mod-name" ref="mod-name" class="input margin-right" type="text" v-model="modName" placeholder="Enter the name of the mod"/>
                </div>
                <br/>
                <div class="input-group input-group--flex margin-right">
                    <label for="mod-author" class="non-selectable">Author</label>
                    <input id="mod-author" ref="mod-author" class="input margin-right" type="text" v-model="modAuthor" placeholder="Enter the author name"/>
                </div>
                <br/>
                <div class="input-group input-group--flex margin-right">
                    <label for="mod-author" class="non-selectable">Description (optional)</label>
                    <input id="mod-description" ref="mod-description" class="input margin-right" type="text" v-model="modDescription" placeholder="Enter a description"/>
                </div>
                <hr/>
                <h3 class="title is-6">Version</h3>
                <div class="input-group input-group--flex margin-right non-selectable">
                    <div class="is-flex">
                        <div>
                            <label for="mod-version-major">Major</label>
                            <input id="mod-version-major" ref="mod-version" class="input margin-right" type="text" v-model="modVersionMajor" placeholder="0"/>
                        </div>
                        <span>&nbsp;</span>
                        <div>
                            <label for="mod-version-minor">Minor</label>
                            <input id="mod-version-minor" ref="mod-version" class="input margin-right" type="text" v-model="modVersionMinor" placeholder="0"/>
                        </div>
                        <span>&nbsp;</span>
                        <div>
                            <label for="mod-version-patch">Patch</label>
                            <input id="mod-version-patch" ref="mod-version" class="input margin-right" type="text" v-model="modVersionPatch" placeholder="0"/>
                        </div>
                    </div>
                </div>
            </template>
        </Modal>
    </div>
</template>

<script lang="ts">

import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import InteractionProvider from '../../providers/ror2/system/InteractionProvider';
import Modal from 'components/Modal.vue';
import * as path from 'path';
import VersionNumber from '../../model/VersionNumber';
import ZipProvider from '../../providers/generic/zip/ZipProvider';
import ManifestV2 from '../../model/ManifestV2';
import R2Error from '../../model/errors/R2Error';
import Profile from '../../model/Profile';
import ProfileModList from '../../r2mm/mods/ProfileModList';
import LocalModInstallerProvider from '../../providers/ror2/installing/LocalModInstallerProvider';

@Component({
    components: { Modal }
})
export default class LocalFileImportModal extends Vue {

    @Prop({default: false, type: Boolean})
    private visible!: boolean;

    private fileToImport: string | null = null;
    private waitingForSelection: boolean = false;

    private modName = "";
    private modAuthor = "Unknown";
    private modDescription = "";
    private modVersionMajor = 0;
    private modVersionMinor = 0;
    private modVersionPatch = 0;

    private resultingManifest = new ManifestV2();

    private contextProfile: Profile | null = null;


    @Watch("visible")
    private visiblityChanged() {
        this.fileToImport = null;
        this.waitingForSelection = false;
    }

    private async selectFile() {
        this.waitingForSelection = true;
        InteractionProvider.instance.selectFile({
            buttonLabel: "Select file",
            title: "Import local mod from file",
            filters: []
        }).then(value => {
            if (value.length > 0) {
                this.fileToImport = value[0];
                this.assumeDefaults();
            } else {
                this.waitingForSelection = false;
                this.fileToImport = null;
            }
        })
    }

    private async assumeDefaults() {

        this.modName = "";
        this.modAuthor = "Unknown";
        this.modDescription = "";
        this.modVersionMajor = 0;
        this.modVersionMinor = 0;
        this.modVersionPatch = 0;

        this.resultingManifest = new ManifestV2();

        if (this.fileToImport === null) { return }

        if (this.fileToImport.endsWith(".zip")) {
            const entries = await ZipProvider.instance.getEntries(this.fileToImport);
            if (entries.filter(value => value.name === "manifest.json").length === 1) {
                const manifestContents = await ZipProvider.instance.readFile(this.fileToImport, "manifest.json");
                if (manifestContents !== null) {
                    const manifestJson: any = JSON.parse(manifestContents.toString().trim());
                    const manifestOrErr = new ManifestV2().makeSafeFromPartial(manifestJson);
                    if (manifestOrErr instanceof R2Error) {
                        // Assume V1. Allow user to correct anything incorrect in case manifest is not Thunderstore valid.
                        this.modName = manifestJson.name || "";
                        this.modDescription = manifestJson.description || "";
                        const modVersion = new VersionNumber(manifestJson.version_number || "").toString().split(".");
                        this.modVersionMajor = Number(modVersion[0]);
                        this.modVersionMinor = Number(modVersion[1]);
                        this.modVersionPatch = Number(modVersion[2]);
                        const inferred = this.inferFieldValuesFromFile(this.fileToImport);
                        this.modAuthor = inferred.modAuthor;
                        this.resultingManifest.setDependencies(manifestJson.dependencies || []);
                        return;
                    } else {
                        this.resultingManifest = manifestOrErr;
                        this.modName = manifestOrErr.getDisplayName();
                        this.modAuthor = manifestOrErr.getAuthorName();
                        this.modDescription = manifestOrErr.getDescription();
                        const modVersion = manifestOrErr.getVersionNumber().toString().split(".");
                        this.modVersionMajor = Number(modVersion[0]);
                        this.modVersionMinor = Number(modVersion[1]);
                        this.modVersionPatch = Number(modVersion[2]);
                        // TODO: Make fields readonly if V2 is provided.
                        return;
                    }
                }
            } else {
                console.log("Does not contain manifest");
            }
        }

        const inferred = this.inferFieldValuesFromFile(this.fileToImport);

        this.modName = inferred.modName
        this.modAuthor = inferred.modAuthor;
        this.modVersionMajor = inferred.modVersionMajor;
        this.modVersionMinor = inferred.modVersionMinor;
        this.modVersionPatch = inferred.modVersionPatch;
    }

    private inferFieldValuesFromFile(file: string): ImportFieldAttributes {
        const fileName = path.basename(file, path.extname(file));
        const hyphenSeparated = fileName.split("-");
        const underscoreSeparated = fileName.split("_");

        // Note: For some unknown reason, this speeds up the time it takes for Vue to update on screen ??
        // Thanks Vue.
        console.log();

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
            const modVersion = this.santizeVersionNumber(hyphenSeparated[2]).toString().split(".");
            data.modVersionMajor = Number(modVersion[0]);
            data.modVersionMinor = Number(modVersion[1]);
            data.modVersionPatch = Number(modVersion[2]);
        } else if (hyphenSeparated.length === 2) {
            data.modName = hyphenSeparated[0];
            const modVersion = this.santizeVersionNumber(hyphenSeparated[1]).toString().split(".");
            data.modVersionMajor = Number(modVersion[0]);
            data.modVersionMinor = Number(modVersion[1]);
            data.modVersionPatch = Number(modVersion[2]);
        } else if (underscoreSeparated.length === 3) {
            data.modAuthor = underscoreSeparated[0];
            data.modName = underscoreSeparated[1];
            const modVersion = this.santizeVersionNumber(underscoreSeparated[2]).toString().split(".");
            data.modVersionMajor = Number(modVersion[0]);
            data.modVersionMinor = Number(modVersion[1]);
            data.modVersionPatch = Number(modVersion[2]);
        } else if (underscoreSeparated.length === 2) {
            data.modName = underscoreSeparated[0];
            const modVersion = this.santizeVersionNumber(underscoreSeparated[1]).toString().split(".");
            data.modVersionMajor = Number(modVersion[0]);
            data.modVersionMinor = Number(modVersion[1]);
            data.modVersionPatch = Number(modVersion[2]);
        } else {
            data.modName = fileName;
        }

        return data;
    }

    private santizeVersionNumber(vn: string): VersionNumber {
        const modVersionSplit = vn.split(".");
        const modVersionString = `${modVersionSplit[0]}.${modVersionSplit[1]}.${modVersionSplit[2].split(new RegExp("[^0-9]+"))[0]}`;
        return new VersionNumber(modVersionString);
    }

    private emitClose() {
        this.$emit("close-modal");
    }

    private importFile() {
        if (this.fileToImport === null) {
            return;
        }

        this.resultingManifest.setName(`${this.modAuthor}-${this.modName}`);
        this.resultingManifest.setDisplayName(this.modName);
        this.resultingManifest.setVersionNumber(new VersionNumber(`${this.modVersionMajor}.${this.modVersionMinor}.${this.modVersionPatch}`));
        this.resultingManifest.setDescription(this.modDescription);
        this.resultingManifest.setAuthorName(this.modAuthor);

        const installCallback = (async (success: boolean, error: any | null) => {
            if (!success && error !== null) {
                this.showError(error);
                return;
            }
            const updatedModListResult = await ProfileModList.getModList(this.contextProfile!);
            if (updatedModListResult instanceof R2Error) {
                this.showError(updatedModListResult);
                return;
            }
            await this.$store.dispatch("updateModList", updatedModListResult);
            this.emitClose();
        });

        if (this.fileToImport.endsWith(".zip")) {
            LocalModInstallerProvider.instance.extractToCacheWithManifestData(this.contextProfile!, this.fileToImport, this.resultingManifest, installCallback);
        } else {
            LocalModInstallerProvider.instance.placeFileInCache(this.contextProfile!, this.fileToImport, this.resultingManifest, installCallback);
        }
    }

    private showError(err: R2Error) {
        this.$emit("error", err);
    }

    created() {
        this.contextProfile = Profile.getActiveProfile();
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
