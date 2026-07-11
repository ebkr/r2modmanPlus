<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getStore } from '../../../../providers/generic/store/StoreProvider';
import { State } from '../../../../store';
import ManagerSettings from '../../../../r2mm/manager/ManagerSettings';
import ThemeManager from '../../../../r2mm/manager/ThemeManager';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';

const store = getStore<State>();
const settings = ref<ManagerSettings | null>(null);
const theme = ref<'light' | 'dark'>('dark');

onMounted(async () => {
    settings.value = await ManagerSettings.getSingleton(store.state.activeGame);
    theme.value = settings.value.getContext().global.darkTheme ? 'dark' : 'light';
});

async function setTheme(value: 'light' | 'dark') {
    theme.value = value;
    const dark = value === 'dark';
    if (settings.value && settings.value.getContext().global.darkTheme !== dark) {
        await settings.value.toggleDarkTheme();
    }
    await ThemeManager.apply();
    document.documentElement.classList.toggle('html--dark', dark);
}
</script>

<template>
    <SettingsViewWrapper>
        <template #title>Theme</template>
        <template #description>
            Choose between a light or dark appearance for the manager.
        </template>
        <select
            class="select"
            :value="theme"
            @change="setTheme(($event.target as HTMLSelectElement).value as 'light' | 'dark')"
        >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </SettingsViewWrapper>
</template>
