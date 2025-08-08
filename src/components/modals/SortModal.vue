<script setup lang="ts">
import ModalCard from '../ModalCard.vue';
import { SortDirection } from '../../model/real_enums/sort/SortDirection';
import SortingStyle from '../../model/enums/SortingStyle';
import { computed } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import {useI18n} from "vue-i18n";

const store = getStore<State>();
const { t } = useI18n();

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
            <h2 class="modal-title">
                {{ t('translations.pages.manager.online.modals.sort.title') }}
            </h2>
        </template>
        <template v-slot:body>
            <div class="input-group">
                <label>
                    {{ t('translations.pages.manager.online.modals.sort.sortBehaviour') }}
                </label>
                <div class="input-group margin-bottom">
                    <select class="select select--content-spacing" v-model="selectedBehaviour">
                        <option v-for="(value, key) in SortingStyle" :value="value" :key="`sort-behaviour--${key}`">
                            {{ t(`translations.enums.sortingStyle.${key}`) }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="input-group">
                <label>
                    {{ t('translations.pages.manager.online.modals.sort.sortDirection') }}
                </label>
                <div class="input-group margin-bottom">
                    <select class="select select--content-spacing" v-model="selectedDirection">
                        <option v-for="(value, key) in SortDirection" :value="value" :key="`sort-direction--${key}`">
                            {{ t(`translations.enums.sortDirection.${key}`) }}
                        </option>
                    </select>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="closeModal">
                {{ t('translations.pages.manager.online.modals.sort.close') }}
            </button>
        </template>
    </ModalCard>
</template>

<style scoped lang="scss">

</style>
