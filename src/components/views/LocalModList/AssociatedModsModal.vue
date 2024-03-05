<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ModalCard } from '../../all';
import ManifestV2 from '../../../model/ManifestV2';
import Dependants from '../../../r2mm/mods/Dependants';

@Component({
    components: {ModalCard}
})
export default class AssociatedModsModal extends Vue {

    @Prop({required: true})
    readonly mod!: ManifestV2;

    @Prop({required: true, type: Function})
    readonly onClose!: () => void;

    get dependants(): Set<ManifestV2> {
        return Dependants.getDependantList(this.mod, this.$store.state.profile.modList);
    }

    get dependencies(): Set<ManifestV2> {
        return Dependants.getDependencyList(this.mod, this.$store.state.profile.modList);
    }
}
</script>
<template>
    <ModalCard :is-active="true" @close-modal="onClose">
        <template v-slot:header>
            <p class='card-header-title'>
                Mods associated with {{mod.getName()}}
            </p>
        </template>
        <template v-slot:body>
            <div v-if="!!dependencies.size">
                <h3 class="subtitle is-5">Dependencies</h3>
                <ul class="list">
                    <li class="list-item" v-for='(mod) in dependencies'
                        :key='`dependency-${mod.getName()}`'>
                        {{mod.getName()}}
                    </li>
                </ul>
            </div>
            <br v-if="!!dependencies.size"/>
            <div v-if="!!dependants.size">
                <h3 class="subtitle is-5">Dependants</h3>
                <ul class="list">
                    <li class="list-item" v-for='(mod) in dependants'
                        :key='`dependant-${mod.getName()}`'>
                        {{mod.getName()}}
                    </li>
                </ul>
            </div>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="onClose">
                Done
            </button>
        </template>
    </ModalCard>
</template>

<style scoped lang="scss">

</style>
