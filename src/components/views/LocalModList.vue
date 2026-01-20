<template>
    <div class="pane">
        <div class="search-and-sort">
            <SearchAndSort />
        </div>
        <DisableModModal />
        <UninstallModModal />
        <AssociatedModsModal />

        <ManagerUpdateBanner/>

        <slot name="above-list"></slot>

        <div class="mod-list-content">
            <div class="draggable-content">
                <Suspense>
                    <LocalModDraggableList/>

                    <template #fallback>
                        <SkeletonLocalModCard :mod="mod" v-for="mod of visibleModList"/>
                    </template>
                </Suspense>
            </div>
        </div>

        <slot name="below-list"></slot>
    </div>
</template>

<script lang="ts" setup>
import AssociatedModsModal from './LocalModList/AssociatedModsModal.vue';
import DisableModModal from './LocalModList/DisableModModal.vue';
import UninstallModModal from './LocalModList/UninstallModModal.vue';
import SearchAndSort from './LocalModList/SearchAndSort.vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import { computed, defineAsyncComponent } from 'vue';
import SkeletonLocalModCard from './LocalModList/SkeletonLocalModCard.vue';
import ManagerUpdateBanner from '../banner/ManagerUpdateBanner.vue';

const store = getStore<State>();

const LocalModDraggableList = defineAsyncComponent(() => import('./LocalModList/LocalModDraggableList.vue'));

const visibleModList = computed(() => store.getters['profile/visibleModList']);
</script>

<style lang="scss" scoped>
.pane {
    display: flex;
    flex-direction: column;
    width: 100%;

    .mod-list-content {
        flex: 1;
        overflow-y: auto;
        padding-right: 1rem;
    }
}
</style>
