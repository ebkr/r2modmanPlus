<script lang="ts" setup>
import { ModalCard } from '../../all';
import R2Error from '../../../model/errors/R2Error';
import Dependants from '../../../r2mm/mods/Dependants';
import { computed } from 'vue';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';

const store = getStore<State>();

const dependants = computed(() => Dependants.getDependantList(mod.value, store.state.profile.modList));
const dependencies = computed(() => Dependants.getDependencyList(mod.value, store.state.profile.modList));
const isOpen = computed(() =>
    store.state.modals.isAssociatedModsModOpen
    && store.state.modals.associatedModsModalMod !== null);

const mod = computed(() => {
    if (store.state.modals.associatedModsModalMod === null) {
        throw new R2Error(
            'Error while opening AssociatedModsModal',
            'Mod not provided'
        );
    }
    return store.state.modals.associatedModsModalMod;
});

function onClose() {
    store.commit('closeAssociatedModsModal');
}
</script>
<template>
    <ModalCard id="associated-mods-modal" v-if="isOpen" :is-active="true" @close-modal="onClose">
        <template v-slot:header>
            <h2 class='modal-title'>Mods associated with {{mod.getName()}}</h2>
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
            <div v-if="dependencies.size === 0 && dependants.size === 0">
                <p>This mod has no dependencies or dependants.</p>
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
