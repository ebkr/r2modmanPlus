<script lang="ts" setup>
import { computed, ref } from 'vue';
import { getStore } from '../../../../providers/generic/store/StoreProvider';
import { State } from '../../../../store';
import R2Error from '../../../../model/errors/R2Error';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../../../components/composables/SettingSearchComposable';
import { useRouter } from 'vue-router';
import ManifestV2 from 'src/model/ManifestV2';

const store = getStore<State>();
const router = useRouter();
const isEnablingState = ref<boolean>(false);
const isDisablingState = ref<boolean>(false);

const props = defineProps<{
    searchTerm?: string;
}>();

const localModList = computed<ManifestV2[]>(() => store.state.profile.modList);

const { isVisible } = useSettingSearch(() => props.searchTerm, [
    'Change mod state',
    'Toggle',
    'Enable all mods',
    'Disable all mods',
]);

const numberEnabled = computed<number>(() => localModList.value.filter(mod => mod.isEnabled()).length);
const numberDisabled = computed<number>(() => localModList.value.length - numberEnabled.value);

const statusText = computed<string>(() => {
    if (numberEnabled.value === localModList.value.length) {
        return 'All of your mods are currently enabled.';
    }
    if (numberDisabled.value === localModList.value.length) {
        return 'All of your mods are currently disabled.';
    }
    return `You have ${numberDisabled.value} mod${numberDisabled.value > 1 ? 's' : ''} disabled.`;
});

async function enableAllMods() {
    isEnablingState.value = true;
    await store.dispatch(
        "profile/enableModsOnActiveProfile",
        {mods: localModList.value}
    );
    isEnablingState.value = false;
    await router.push({name: "manager.installed"});
}

async function disableAllMods() {
    isDisablingState.value = true;
    await store.dispatch(
        "profile/disableModsFromActiveProfile",
        {mods: localModList.value}
    );
    isDisablingState.value = false;
    await router.push({name: "manager.installed"});
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>Change mod state</template>
        <template #description>
        <p>Enable / disable all of the mods on your profile</p>
        <p>{{ statusText }}</p>
        </template>
        <div class="setting-row">
            <button
                class="button"
                :class="{ 'is-loading': isEnablingState }"
                :disabled="isEnablingState || isDisablingState"
                @click="enableAllMods"
            >
                Enable all mods
            </button>
            <button
                class="button"
                :class="{ 'is-loading': isDisablingState }"
                :disabled="isEnablingState || isDisablingState"
                @click="disableAllMods"
            >
                Disable all mods
            </button>
        </div>
    </SettingsViewWrapper>
</template>
