<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import Game from '../../../model/game/Game';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../composables/SettingSearchComposable';
import { getLaunchType, LaunchType } from '../../../model/real_enums/launch/LaunchType';
import { LaunchTypeModalOpen } from '../../modals/launch-type/LaunchTypeRefs';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const activeGame = computed<Game>(() => store.state.activeGame);
const launchType = ref<LaunchType>(LaunchType.AUTO);

const { isVisible } = useSettingSearch(() => props.searchTerm, () => [
    'Change launch behaviour',
    'Set launch mode',
    'Proton',
    'Native',
    'Auto',
    launchType.value,
]);

async function refreshLaunchType() {
    launchType.value = await getLaunchType(activeGame.value);
}

onMounted(refreshLaunchType);
watch(activeGame, refreshLaunchType);

watch(LaunchTypeModalOpen, (open) => {
    if (!open) {
        refreshLaunchType();
    }
});

function openLaunchTypeModal() {
    LaunchTypeModalOpen.value = true;
}
</script>

<template>
    <SettingsViewWrapper >
        <template #title>Change launch behaviour</template>
        <template #description>
            <p>Select a specific launch behaviour. You can tell the manager that a game is explicitly using either Native or Proton.</p>
            <p>The current launch behaviour is set to: <strong>{{ launchType }}</strong>.</p>
        </template>
        <button class="button" @click="openLaunchTypeModal">Change launch behaviour</button>
    </SettingsViewWrapper>
</template>
