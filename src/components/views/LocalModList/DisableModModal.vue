<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ModalCard } from '../../all';
import ManifestV2 from '../../../model/ManifestV2';

@Component({
    components: {ModalCard}
})
export default class DisableModModal extends Vue {

    @Prop({required: true})
    readonly mod!: ManifestV2;

    @Prop({required: true})
    readonly dependencyList!: Set<ManifestV2>;

    @Prop({required: true})
    readonly dependantsList!: Set<ManifestV2>;

    @Prop({required: true})
    readonly modBeingDisabled!: string | null;

    @Prop({required: true, type: Function})
    readonly onClose!: () => void;

    @Prop({required: true, type: Function})
    readonly onDisableIncludeDependents!: (mod: ManifestV2) => void;

    @Prop({required: true, type: Function})
    readonly onDisableExcludeDependents!: (mod: ManifestV2) => void;

    get isLocked(): boolean {
        return this.modBeingDisabled !== null;
    }
}
</script>
<template>
    <ModalCard :is-active="true" :can-close="!isLocked" @close-modal="onClose">
        <template v-slot:header>
            <p class="modal-card-title">Disabling {{mod.getName()}}</p>
        </template>
        <template v-slot:body>
            <div class="max-height-100 is-flex is-flex-direction-column">
                <div class='notification is-warning'>
                    <p>
                        Other mods depend on this mod. Select <strong>Disable all</strong>
                        to disable dependent mods, otherwise they may cause errors.
                    </p>
                </div>
                <h3 class="subtitle mb-3">Mods to be disabled</h3>
                <div class="is-flex-shrink-1 overflow-auto code-snippet">
                    <ul class="list">
                        <li class="list-item">{{mod.getName()}}</li>
                        <li class="list-item" v-for='(key, index) in dependantsList'
                            :key='`dependant-${index}`'>
                            {{key.getName()}}
                        </li>
                    </ul>
                </div>
                <div v-if="isLocked" class="mt-3">
                    <h3 class="subtitle mb-3">Disabling {{modBeingDisabled}}</h3>
                    <progress class="progress is-small is-info"/>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <button class="button is-info"
                    :disabled="isLocked"
                    @click="onDisableIncludeDependents(mod)">
                Disable all (recommended)
            </button>
            <button class="button"
                    :disabled="isLocked"
                    @click="onDisableExcludeDependents(mod)">
                Disable {{mod.getName()}} only
            </button>
        </template>
    </ModalCard>
</template>

<style scoped lang="scss">

</style>
