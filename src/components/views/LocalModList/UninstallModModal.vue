<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Modal } from '../../all';
import ManifestV2 from '../../../model/ManifestV2';

@Component({
    components: {Modal}
})
export default class UninstallModModal extends Vue {

    @Prop({required: true})
    readonly mod!: ManifestV2;

    @Prop({required: true})
    readonly dependencyList!: Set<ManifestV2>;

    @Prop({required: true})
    readonly dependantsList!: Set<ManifestV2>;

    @Prop({required: true})
    readonly modBeingUninstalled!: string | null;

    @Prop({required: true, type: Function})
    readonly onClose!: () => void;

    @Prop({required: true, type: Function})
    readonly onUninstallIncludeDependents!: (mod: ManifestV2) => void;

    @Prop({required: true, type: Function})
    readonly onUninstallExcludeDependents!: (mod: ManifestV2) => void;
}
</script>
<template>
    <Modal :open="true" @close-modal="onClose">
        <template v-slot:title>
            <p class='card-header-title'>
                Uninstalling {{mod.getName()}}
            </p>
        </template>
        <template v-slot:body>
            <div class='notification is-warning'>
                <p>
                    Other mods depend on this mod. Select <strong>Uninstall all</strong>
                    to uninstall dependent mods, otherwise they may cause errors.
                </p>
            </div>
            <p>Mods to be uninstalled:</p>
            <br/>
            <div>
                <ul class="list">
                    <li class="list-item">{{mod.getName()}}</li>
                    <li class="list-item" v-for='(key, index) in dependantsList'
                        :key='`dependant-${index}`'>
                        {{key.getName()}}
                    </li>
                </ul>
            </div>
        </template>
        <template v-slot:footer>
            <button class="button is-info"
                    :disabled="modBeingUninstalled !== null"
                    @click="onUninstallIncludeDependents(mod)">
                Uninstall all (recommended)
            </button>
            <button class="button"
                    :disabled="modBeingUninstalled !== null"
                    @click="onUninstallExcludeDependents(mod)">
                Uninstall {{mod.getName()}} only
            </button>
            <span v-if="modBeingUninstalled" class="tag is-warning margin-top--1rem margin-left">
                Uninstalling {{ modBeingUninstalled }}
            </span>
        </template>
    </Modal>
</template>

<style scoped lang="scss">

</style>
