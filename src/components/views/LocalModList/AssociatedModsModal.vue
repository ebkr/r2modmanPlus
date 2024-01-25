<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Modal } from '../../all';
import ManifestV2 from '../../../model/ManifestV2';

@Component({
    components: {Modal}
})
export default class AssociatedModsModal extends Vue {

    @Prop({required: true})
    readonly mod!: ManifestV2;

    @Prop({required: true})
    readonly dependencyList!: Set<ManifestV2>;

    @Prop({required: true})
    readonly dependantsList!: Set<ManifestV2>;

    @Prop({required: true, type: Function})
    readonly onClose!: () => void;
}
</script>
<template>
    <Modal :open="true" @close-modal="onClose">
        <template v-slot:title>
            <p class='card-header-title'>
                Mods associated with {{mod.getName()}}
            </p>
        </template>
        <template v-slot:body>
            <div v-if="!!dependencyList.size">
                <h3 class="subtitle is-5">Dependencies</h3>
                <ul class="list">
                    <li class="list-item" v-for='(key, index) in dependencyList'
                        :key='`dependency-${index}`'>
                        {{key.getName()}}
                    </li>
                </ul>
            </div>
            <br v-if="!!dependencyList.size"/>
            <div v-if="!!dependantsList.size">
                <h3 class="subtitle is-5">Dependants</h3>
                <ul class="list">
                    <li class="list-item" v-for='(key, index) in dependantsList'
                        :key='`dependant-${index}`'>
                        {{key.getName()}}
                    </li>
                </ul>
            </div>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="onClose">
                Done
            </button>
        </template>
    </Modal>
</template>

<style scoped lang="scss">

</style>
