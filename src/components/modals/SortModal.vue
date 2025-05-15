<script setup lang="ts">
import ModalCard from '../ModalCard.vue';
import { SortDirection } from '../../model/real_enums/sort/SortDirection';
import SortingStyle from '../../model/enums/SortingStyle';
import { computed } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';

const store = getStore<State>();

const selectedBehaviour = computed({
    get() {
        return store.state.modFilters.sortBehaviour;
    },
    set(value: string) {
        store.commit("modFilters/setSortBehaviour", value);
    }
});

const selectedDirection = computed({
    get() {
        return store.state.modFilters.sortDirection;
    },
    set(value: string) {
        store.commit("modFilters/setSortDirection", value);
    }
});

function closeModal() {
    store.commit("closeOnlineSortModal");
}

const isOpen = computed(() => store.state.modals.isOnlineSortModalOpen)

</script>

<template>
    <ModalCard id="sort-modal" v-show="isOpen" :is-active="isOpen" :can-close="true" @close-modal="closeModal">
        <template v-slot:header>
            <h2 class="modal-title">Change the ordering of mods</h2>
        </template>
        <template v-slot:body>
            <div class="input-group">
                <label>Sort behaviour</label>
                <div class="input-group margin-bottom">
                    <select class="select select--content-spacing" v-model="selectedBehaviour">
                        <option v-for="(value, key) in SortingStyle" :value="value" :key="`sort-behaviour--${key}`">
                            {{ value }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="input-group">
                <label>Sort direction</label>
                <div class="input-group margin-bottom">
                    <select class="select select--content-spacing" v-model="selectedDirection">
                        <option v-for="(value, key) in SortDirection" :value="value" :key="`sort-direction--${key}`">
                            {{ value }}
                        </option>
                    </select>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="closeModal">
                Close
            </button>
        </template>
    </ModalCard>
</template>

<style scoped lang="scss">

</style>
