<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getStore } from '../../../../providers/generic/store/StoreProvider';
import { State } from '../../../../store';
import ManagerSettings from '../../../../r2mm/manager/ManagerSettings';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from 'src/components/composables/SettingSearchComposable';

const store = getStore<State>();
const settings = ref<ManagerSettings | null>(null);
const funkyModeEnabled = ref<boolean>(false);

const props = defineProps<{
    searchTerm?: string;
}>();

const { isVisible } = useSettingSearch(() => props.searchTerm, [
    'Enable funky mode',
    'Toggle',
]);

onMounted(async () => {
    settings.value = await ManagerSettings.getSingleton(store.state.activeGame);
    funkyModeEnabled.value = settings.value.getContext().global.funkyModeEnabled;
});

async function setFunkyMode(enabled: boolean) {
    funkyModeEnabled.value = enabled;
    await settings.value?.setFunkyMode(enabled);
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>Enable funky mode</template>
        <template #description>
        It's funky mode.
        </template>
        <div class="field" @click.prevent.stop="setFunkyMode(!funkyModeEnabled)">
            <input
                id="switch-funky-mode"
                type="checkbox"
                :class="['switch', { 'is-info': funkyModeEnabled }]"
                :checked="funkyModeEnabled"
            />
            <label for="switch-funky-mode">{{ funkyModeEnabled ? 'Enabled' : 'Disabled' }}</label>
        </div>
    </SettingsViewWrapper>
</template>
