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
            <LocalModCard
                :version="installedVersions.get(element.name)"
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
import {getCombosByDependencyStrings} from "../../../r2mm/manager/PackageDexieStore";
import ThunderstoreVersion from "../../../model/ThunderstoreVersion";
import { useVulnerablePackageComposable } from '@r2/components/composables/VulnerablePackageComposable';

const store = getStore<State>();

const { isVulnerablePackage } = useVulnerablePackageComposable();

const profile = computed<ImmutableProfile>(() => store.getters['profile/activeProfile'].asImmutableProfile());

// Hack to workaround draggable issue where the VueX update is slightly delayed, which causes a jumping effect.
const internalVisibleList = ref<ManifestV2[]>([]);
const visibleModList = computed(() => store.getters['profile/visibleModList']);

function applyVisibleList() {
    const newModList = visibleModList.value;
    const modList = store.state.profile.modList;
    if (store.state.profile.filters.has('Unlinked')) {
        internalVisibleList.value = modList.filter(value => isVulnerablePackage(value));
    } else {
        internalVisibleList.value = newModList;
    }
}

watch([visibleModList, store.state.profile.filters], applyVisibleList);
onMounted(applyVisibleList);

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

const activeGame = computed(() => store.state.activeGame);
const modList = computed(() => store.state.profile.modList);

const installedVersions = ref<Map<string, ThunderstoreVersion>>(new Map());

async function updateInstalledVersions() {
    const dependenciesStrings = modList.value.map(value => `${value.getName()}-${value.getVersionNumber().toString()}`);
    const combos = await getCombosByDependencyStrings(activeGame.value, dependenciesStrings, false);
    installedVersions.value = new Map(combos.map(value => [value.getMod().getFullName(), value.getVersion()]));
}

onMounted(updateInstalledVersions);
watch(() => modList, updateInstalledVersions);
</script>
