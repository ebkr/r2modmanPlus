<script lang="ts" setup>
import { computed, ref } from 'vue';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import R2Error from '../../../model/errors/R2Error';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../composables/SettingSearchComposable';
import { useI18n } from 'vue-i18n';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const activeExport = ref<'file' | 'code' | null>(null);
const isExporting = computed(() => activeExport.value !== null);

const { t } = useI18n();

const { isVisible } = useSettingSearch(() => props.searchTerm, 'translations.pages.settings.entries.exportProfile.searchTerms');

async function exportProfile(as: 'file' | 'code', action: string) {
    if (isExporting.value) {
        return;
    }
    activeExport.value = as;
    try {
        await store.dispatch(action);
    } catch (e) {
        store.commit('error/handleError', R2Error.fromThrownValue(e));
    } finally {
        activeExport.value = null;
    }
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>{{ t('translations.pages.settings.entries.exportProfile.title') }}</template>
        <template #description>
            {{ t('translations.pages.settings.entries.exportProfile.description') }}
        </template>
        <div class="setting-row">
            <button
                class="button"
                :class="{ 'is-loading': activeExport === 'file' }"
                :disabled="isExporting"
                @click="exportProfile('file', 'profileExport/exportProfileAsFile')"
            >
                {{ t('translations.pages.settings.entries.exportProfile.asFile') }}
            </button>
            <button
                class="button"
                :class="{ 'is-loading': activeExport === 'code' }"
                :disabled="isExporting"
                @click="exportProfile('code', 'profileExport/exportProfileAsCode')"
            >
                {{ t('translations.pages.settings.entries.exportProfile.asCode') }}
            </button>
        </div>
    </SettingsViewWrapper>
</template>
