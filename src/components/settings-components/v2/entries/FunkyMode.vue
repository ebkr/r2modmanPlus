<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getStore } from '../../../../providers/generic/store/StoreProvider';
import { State } from '../../../../store';
import ManagerSettings from '../../../../r2mm/manager/ManagerSettings';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';

const store = getStore<State>();
const settings = ref<ManagerSettings | null>(null);
const funkyModeEnabled = ref<boolean>(false);

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
    <SettingsViewWrapper>
        <template #title>Enable funky mode</template>
        <template #description>
            Adds a more colourful, playful flair to the manager. Purely cosmetic.
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

<style scoped lang="scss">
.switch {
    position: relative;
}
</style>
