<template>
    <ModalCard :is-active="isOpen" :can-close="true" v-if="thunderstoreMod !== null" @close-modal="closeModal()">
        <template v-slot:header>
            <h2 class='modal-title' v-if="thunderstoreMod !== null">
                Select a version of {{thunderstoreMod.getName()}} to download
            </h2>
        </template>
        <template v-slot:body>
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
                        <span class="margin-right margin-right--half-width"><span class="margin-right margin-right--half-width"/> <i class='fas fa-long-arrow-alt-right'></i></span>
                    </div>
                </template>
                <div class="column is-narrow">
                    <select class='select' :value="selectedVersion" @change="emitSelected">
                        <option v-for='(value, index) in versionNumbers' :key='index' :value='value'>
                            {{value}}
                        </option>
                    </select>
                </div>
                <div class="column is-narrow">
                    <span class="tag is-dark" v-if='selectedVersion === null'>
                        You need to select a version
                    </span>
                    <span class="tag is-success" v-else-if='recommendedVersion === selectedVersion'>
                        {{selectedVersion}} is the recommended version
                    </span>
                    <span class="tag is-success" v-else-if='versionNumbers[0] === selectedVersion'>
                        {{selectedVersion}} is the latest version
                    </span>
                    <span class="tag is-danger" v-else-if='versionNumbers[0] !== selectedVersion'>
                        {{selectedVersion}} is an outdated version
                    </span>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="downloadThunderstoreMod">Download with dependencies</button>
        </template>
    </ModalCard>
</template>

<script lang="ts">

import { mixins } from "vue-class-component";
import { Component, Prop } from 'vue-property-decorator';

import ModalCard from '../ModalCard.vue';
import DownloadMixin from "../../components/mixins/DownloadMixin.vue";
import ThunderstoreMod from "../../model/ThunderstoreMod";
import ThunderstoreVersion from "../../model/ThunderstoreVersion";
import * as PackageDb from "../../r2mm/manager/PackageDexieStore";


@Component({
    components: {
        ModalCard
    },
})
export default class DownloadModVersionSelectModal extends mixins(DownloadMixin) {
    @Prop({ required: true })
    private currentVersion!: string;

    @Prop({ required: true })
    private recommendedVersion!: string;

    @Prop({required: true})
    private versionNumbers!: string[]

    @Prop({ required: false })
    private selectedVersion!: string | null;

    @Prop({ required: true })
    private downloadHandler!: (tsMod: ThunderstoreMod, tsVersion: ThunderstoreVersion) => void;

    @Prop({ required: false })
    private setSelectedVersion!: (selectedVersion: string) => void;


    emitSelected(event: Event) {
        this.$emit("selected-version", event);
    }

    async downloadThunderstoreMod() {
        const refSelectedThunderstoreMod: ThunderstoreMod | null = this.thunderstoreMod;
        const refSelectedVersion: string | null = this.selectedVersion;
        if (refSelectedThunderstoreMod === null || refSelectedVersion === null) {
            // Shouldn't happen, but shouldn't throw an error.
            return;
        }

        let version: ThunderstoreVersion;

        try {
            version = await PackageDb.getVersionAsThunderstoreVersion(
                this.activeGame.internalFolderName,
                refSelectedThunderstoreMod.getFullName(),
                refSelectedVersion
            );
        } catch {
            return;
        }

        this.downloadHandler(refSelectedThunderstoreMod, version);
    }
}

</script>
