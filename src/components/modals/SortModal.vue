<script setup lang="ts">
import ModalCard from 'components/ModalCard.vue';
import { SortDirection } from '../../model/real_enums/sort/SortDirection';
import SortingStyle from '../../model/enums/SortingStyle';
import useStore from '../../store';
import { computed } from 'vue';

const store = useStore();

const directions = Object.keys(SortDirection);
const behaviours = Object.keys(SortingStyle);

const selectedBehaviour = computed(() => store.state.modFilters.sortBehaviour);
const selectedDirection = computed(() => store.state.modFilters.sortDirection);

function closeModal() {
    store.commit("closeOnlineSortModal");
}

const isOpen = computed(() => store.state.modals.isOnlineSortModalOpen)

function changeSortBehaviour(e: InputEvent) {
    const value: string = e.target!.value;
    const selected = Object.keys(SortingStyle)
        .find(style => SortingStyle[style] === value)!;
    store.commit("modFilters/setSortBehaviour", selected);
}

function changeSortDirection(e: InputEvent) {
    const value: string = e.target!.value;
    const selected = Object.keys(SortDirection)
        .find(style => SortDirection[style] === value)!;
    store.commit("modFilters/setSortDirection", selected);
}

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
                    <select class="select select--content-spacing" @change="changeSortBehaviour">
                        <option v-for="(key, index) in behaviours" :key="`sort-behaviour--${key}-${index}`" :selected="selectedBehaviour === key">
                            {{ SortingStyle[key] }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="input-group">
                <label>Sort direction</label>
                <div class="input-group margin-bottom">
                    <select class="select select--content-spacing" @change="changeSortDirection">
                        <option v-for="(key, index) in directions" :key="`sort-direction--${key}-${index}`" @selected="selectedDirection === key">
                            {{ SortDirection[key] }}
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
