<script lang="ts" setup>
import { computed, ref } from 'vue';
import { getStore } from '../../../../providers/generic/store/StoreProvider';
import { State } from '../../../../store';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../../composables/SettingSearchComposable';
import { SteamInstallationValidator } from '../../../../r2mm/manager/SteamInstallationValidator';
import R2Error from '../../../../model/errors/R2Error';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const activeGame = computed(() => store.state.activeGame);
const isValidating = ref<boolean>(false);

const { isVisible } = useSettingSearch(() => props.searchTerm, () => [
    `Reset ${activeGame.value.displayName} installation`,
    'Validate installation',
    'Verify integrity',
    'Corrupted files',
]);

async function validateSteamInstallation() {
    isValidating.value = true;
    const res = await SteamInstallationValidator.validateInstallation(activeGame.value);
    isValidating.value = false;
    if (res instanceof R2Error) {
        store.commit('error/handleError', res);
    } else {
        store.commit('openSteamInstallationValidationModal');
    }
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>Reset {{ activeGame.displayName }} installation</template>
        <template #description>
            Fix problems caused by corrupted files or files left over from manual modding attempts.
            This will delete all contents of the <code class="code">{{ activeGame.steamFolderName }}</code> folder and will
            verify files through Steam.
        </template>
        <button
            class="button"
            :class="{ 'is-loading': isValidating }"
            :disabled="isValidating"
            @click="validateSteamInstallation"
        >
            Reset installation
        </button>
    </SettingsViewWrapper>
</template>
