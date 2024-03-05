<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ModalCard } from '../../all';
import ManifestV2 from '../../../model/ManifestV2';
import Dependants from '../../../r2mm/mods/Dependants';

@Component({
    components: {ModalCard}
})
export default class UninstallModModal extends Vue {

    @Prop({required: true})
    readonly mod!: ManifestV2;

    @Prop({required: true})
    readonly modBeingUninstalled!: string | null;

    @Prop({required: true, type: Function})
    readonly onClose!: () => void;

    @Prop({required: true, type: Function})
    readonly onUninstallIncludeDependents!: (mod: ManifestV2) => void;

    @Prop({required: true, type: Function})
    readonly onUninstallExcludeDependents!: (mod: ManifestV2) => void;

    get dependants() {
        return Dependants.getDependantList(this.mod, this.$store.state.profile.modList);
    }

    get isLocked(): boolean {
        return this.modBeingUninstalled !== null;
    }
}
</script>
<template>
    <ModalCard :is-active="true" :can-close="!isLocked" @close-modal="onClose">
        <template v-slot:header>
            <p class='modal-card-title'>Uninstalling {{mod.getName()}}</p>
        </template>
        <template v-slot:body>
            <div class="max-height-100 is-flex is-flex-direction-column">
                <div class='notification is-warning'>
                    <p>
                        Other mods depend on this mod. Select <strong>Uninstall all</strong>
                        to uninstall dependent mods, otherwise they may cause errors.
                    </p>
                </div>
                <h3 class="subtitle mb-3">Mods to be uninstalled</h3>
                <div class="is-flex-shrink-1 overflow-auto code-snippet">
                    <ul class="list">
                        <li class="list-item">{{mod.getName()}}</li>
                        <li class="list-item" v-for='(mod) in dependants'
                            :key='`dependant-${mod.getName()}`'>
                            {{mod.getName()}}
                        </li>
                    </ul>
                </div>
                <div v-if="isLocked" class="mt-3">
                    <h3 class="subtitle mb-3">Uninstalling {{modBeingUninstalled}}</h3>
                    <progress class="progress is-small is-info"/>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <button class="button is-info"
                    :disabled="isLocked"
                    @click="onUninstallIncludeDependents(mod)">
                Uninstall all (recommended)
            </button>
            <button class="button"
                    :disabled="isLocked"
                    @click="onUninstallExcludeDependents(mod)">
                Uninstall {{mod.getName()}} only
            </button>
        </template>
    </ModalCard>
</template>

<style scoped lang="scss">

</style>
