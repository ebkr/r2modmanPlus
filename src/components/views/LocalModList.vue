<template>
    <div class="pane">
        <div class="search-and-sort">
            <SearchAndSort />
        </div>
        <DisableModModal />
        <UninstallModModal />
        <AssociatedModsModal />

        <slot name="above-list"></slot>

        <div class="mod-list-content">
            <div class="draggable-content">
                <draggable v-model='draggableList' group="local-mods" handle=".handle"
                           @start="drag=$store.getters['profile/canSortMods']"
                           @end="drag=false"
                           :force-fallback="true"
                           :scroll-sensitivity="100">
                    <local-mod-card
                        v-for='(mod, index) in draggableList'
                        :key="`local-${profile.getProfileName()}-${mod.getName()}-${index}`"
                        :mod="mod" />
                </draggable>
            </div>
        </div>

        <slot name="below-list"></slot>
    </div>
</template>

<script lang="ts" setup>
import Draggable from 'vuedraggable';
import R2Error from '../../model/errors/R2Error';
import { ImmutableProfile } from '../../model/Profile';
import AssociatedModsModal from './LocalModList/AssociatedModsModal.vue';
import DisableModModal from './LocalModList/DisableModModal.vue';
import UninstallModModal from './LocalModList/UninstallModModal.vue';
import LocalModCard from './LocalModList/LocalModCard.vue';
import SearchAndSort from './LocalModList/SearchAndSort.vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import { computed } from 'vue';

const store = getStore<State>();

const profile = computed<ImmutableProfile>(() => store.getters['profile/activeProfile'].asImmutableProfile());
const draggableList = computed({
    get() {
        return store.getters['profile/visibleModList'];
    },
    set(newList: string) {
        try {
            store.dispatch(
                'profile/saveModListToDisk',
                {mods: newList, profile: profile.value}
            );
        } catch (e) {
            store.commit('error/handleError', R2Error.fromThrownValue(e));
        }
    }
});
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
