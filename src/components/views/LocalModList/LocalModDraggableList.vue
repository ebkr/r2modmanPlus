<template>
    <draggable v-model='draggableList'
               group="local-mods"
               handle=".handle"
               @start="drag=store.getters['profile/canSortMods']"
               @end="drag=false"
               :force-fallback="true"
               :scroll-sensitivity="100"
               item-key="id">
        <template #item="{element}">
            <local-mod-card
                :mod="element" />
        </template>
    </draggable>
</template>
<script setup lang="ts">
import Draggable from 'vuedraggable';
import LocalModCard from './LocalModCard.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import ManifestV2 from '../../../model/ManifestV2';
import R2Error from '../../../model/errors/R2Error';
import { ImmutableProfile } from '../../../model/Profile';


const store = getStore<State>();

const profile = computed<ImmutableProfile>(() => store.getters['profile/activeProfile'].asImmutableProfile());

// Hack to workaround draggable issue where the VueX update is slightly delayed, which causes a jumping effect.
const internalVisibleList = ref<ManifestV2[]>([]);
const visibleModList = computed(() => store.getters['profile/visibleModList']);
watch(visibleModList, (newList) => internalVisibleList.value = newList);
onMounted(() => {
    internalVisibleList.value = store.getters['profile/visibleModList'];
})

const draggableList = computed({
    get() {
        return internalVisibleList.value;
    },
    set(newList: ManifestV2[]) {
        internalVisibleList.value = newList;
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
