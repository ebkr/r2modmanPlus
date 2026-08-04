<script lang="ts" setup>
import { computed, ref } from 'vue';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import R2Error from '../../../model/errors/R2Error';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../composables/SettingSearchComposable';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import ManifestV2 from '../../../model/ManifestV2';

const store = getStore<State>();
const router = useRouter();
const isEnablingState = ref<boolean>(false);
const isDisablingState = ref<boolean>(false);

const props = defineProps<{
    searchTerm?: string;
}>();

const localModList = computed<ManifestV2[]>(() => store.state.profile.modList);

const { t } = useI18n();

const { isVisible } = useSettingSearch(() => props.searchTerm, 'translations.pages.settings.entries.modState.searchTerms');

const numberEnabled = computed<number>(() => localModList.value.filter(mod => mod.isEnabled()).length);
const numberDisabled = computed<number>(() => localModList.value.length - numberEnabled.value);

const statusText = computed<string>(() => {
    if (numberEnabled.value === localModList.value.length) {
        return t('translations.pages.settings.entries.modState.allEnabled');
    }
    if (numberDisabled.value === localModList.value.length) {
        return t('translations.pages.settings.entries.modState.allDisabled');
    }
    return t(
        'translations.pages.settings.entries.modState.someDisabled',
        numberDisabled.value,
        { named: { count: numberDisabled.value } }
    );
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
        <template #title>{{ t('translations.pages.settings.entries.modState.title') }}</template>
        <template #description>
        <p>{{ t('translations.pages.settings.entries.modState.description') }}</p>
        <p>{{ statusText }}</p>
        </template>
        <div class="setting-row">
            <button
                class="button"
                :class="{ 'is-loading': isEnablingState }"
                :disabled="isEnablingState || isDisablingState"
                @click="enableAllMods"
            >
                {{ t('translations.pages.settings.entries.modState.enableAll') }}
            </button>
            <button
                class="button"
                :class="{ 'is-loading': isDisablingState }"
                :disabled="isEnablingState || isDisablingState"
                @click="disableAllMods"
            >
                {{ t('translations.pages.settings.entries.modState.disableAll') }}
            </button>
        </div>
    </SettingsViewWrapper>
</template>
