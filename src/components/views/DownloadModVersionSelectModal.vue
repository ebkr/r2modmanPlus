<template>
    <ModalCard :is-active="isOpen" :can-close="true" v-if="thunderstoreMod !== null" @close-modal="closeModal()">
        <template v-slot:header>
            <h2 class='modal-title' v-if="thunderstoreMod !== null">
                Select a version of {{thunderstoreMod.getName()}} to download
            </h2>
            <p>Currently Selected Version: {{ selectedVersion }}</p>
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
                    <select class='select' :value="selectedVersion" @change="handleChange">
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

import DownloadMixin from "../../components/mixins/DownloadMixin.vue";
import ModalCard from '../ModalCard.vue';


@Component({
    components: {
        ModalCard
    },
})
export default class DownloadModVersionSelectModal extends mixins(DownloadMixin) {
    @Prop({ required: true }) versionNumbers!: string[];
    @Prop({ required: true }) selectedVersion!: string | null;
    @Prop({ required: true }) currentVersion!: string;
    @Prop({ required: true }) recommendedVersion!: string;
    @Prop({ required: true }) downloadThunderstoreMod!: Function;
    @Prop({ required: true }) setSelectedVersion!: Function;

    handleChange(event: Event) {
        this.$props.setSelectedVersion((event.target as HTMLSelectElement).value);
    }
}

</script>
