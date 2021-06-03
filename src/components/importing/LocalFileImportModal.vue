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
                <button class="button is-info">Import local mod</button>
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
                    <input id="mod-name" ref="mod-name" class="input margin-right" type="text" placeholder="Enter the name of the mod"/>
                </div>
                <br/>
                <div class="input-group input-group--flex margin-right">
                    <label for="mod-author" class="non-selectable">Author</label>
                    <input id="mod-author" ref="mod-author" class="input margin-right" type="text" placeholder="Enter the author name"/>
                </div>
                <br/>
                <div class="input-group input-group--flex margin-right">
                    <label for="mod-author" class="non-selectable">Description</label>
                    <input id="mod-author" ref="mod-author" class="input margin-right" type="text" placeholder="Enter a description"/>
                </div>
                <hr/>
                <h3 class="title is-6">Version</h3>
                <div class="input-group input-group--flex margin-right non-selectable">
                    <div class="is-flex">
                        <div>
                            <label for="mod-version">Major</label>
                            <input id="mod-version" ref="mod-version" class="input margin-right" type="text" placeholder="0"/>
                        </div>
                        <span>&nbsp;</span>
                        <div>
                            <label for="mod-version">Minor</label>
                            <input id="mod-version" ref="mod-version" class="input margin-right" type="text" placeholder="0"/>
                        </div>
                        <span>&nbsp;</span>
                        <div>
                            <label for="mod-version">Patch</label>
                            <input id="mod-version" ref="mod-version" class="input margin-right" type="text" placeholder="0"/>
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

@Component({
    components: { Modal }
})
export default class LocalFileImportModal extends Vue {

    @Prop({default: false, type: Boolean})
    private visible!: boolean;

    private fileToImport: string | null = null;
    private waitingForSelection: boolean = false;

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
            } else {
                this.waitingForSelection = false;
                this.fileToImport = null;
            }
        })
    }

    private emitClose() {
        this.$emit("close-modal");
    }

}
</script>
