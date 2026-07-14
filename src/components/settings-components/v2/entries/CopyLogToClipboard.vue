<script lang="ts" setup>
import { computed, ref } from 'vue';
import { getStore } from '../../../../providers/generic/store/StoreProvider';
import { State } from '../../../../store';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../../composables/SettingSearchComposable';
import FsProvider from '../../../../providers/generic/file/FsProvider';
import path from '../../../../providers/node/path/path';
import InteractionProvider from '../../../../providers/ror2/system/InteractionProvider';
import { PackageLoader } from '../../../../model/schema/ThunderstoreSchema';
import R2Error from '../../../../model/errors/R2Error';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const activeGame = computed(() => store.state.activeGame);
const profile = computed(() => store.getters['profile/activeProfile']);
const isCopying = ref<boolean>(false);

const { isVisible } = useSettingSearch(() => props.searchTerm, [
    'Copy log file contents to clipboard',
    'LogOutput',
    'LogOutput.txt',
    'Discord',
]);

async function copyLogToClipboard() {
    isCopying.value = true;
    try {
        const fs = FsProvider.instance;
        let logOutputPath = "";
        switch (activeGame.value.packageLoader) {
            case PackageLoader.BEPINEX:
            case PackageLoader.BEPISLOADER:
                logOutputPath = path.join(profile.value.getProfilePath(), "BepInEx", "LogOutput.log");
                break;
            case PackageLoader.MELONLOADER:
                logOutputPath = path.join(profile.value.getProfilePath(), "MelonLoader", "Latest.log");
                break;
            case PackageLoader.RETURN_OF_MODDING:
                logOutputPath = path.join(profile.value.getProfilePath(), "ReturnOfModding", "LogOutput.log");
                break;
            case PackageLoader.GDWEAVE:
                logOutputPath = path.join(profile.value.getProfilePath(), "GDWeave", "GDWeave.log");
                break;
            case PackageLoader.UMM:
                logOutputPath = path.join(profile.value.getProfilePath(), "UMM", "Core", "Log.txt");
                break;
            case PackageLoader.RIVET:
                logOutputPath = path.join(profile.value.getProfilePath(), "Rivet", "RivetLoader.log");
                break;
        }
        const text = (await fs.readFile(logOutputPath)).toString();
        if (text.length >= 1992) {
            InteractionProvider.instance.copyToClipboard(text);
        } else {
            InteractionProvider.instance.copyToClipboard("```\n" + text + "\n```");
        }
    } catch (e) {
        store.commit('error/handleError', R2Error.fromThrownValue(e, 'Failed to copy the log to the clipboard'));
    } finally {
        isCopying.value = false;
    }
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>Copy log to clipboard</template>
        <template #description>
            Copy the contents of the log file to your clipboard, formatted for Discord.
        </template>
        <button
            class="button"
            :class="{ 'is-loading': isCopying }"
            :disabled="isCopying"
            @click="copyLogToClipboard"
        >
            Copy log to clipboard
        </button>
    </SettingsViewWrapper>
</template>
