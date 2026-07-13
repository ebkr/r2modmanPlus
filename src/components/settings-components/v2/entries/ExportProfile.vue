<script lang="ts" setup>
import { computed, ref } from 'vue';
import { getStore } from '../../../../providers/generic/store/StoreProvider';
import { State } from '../../../../store';
import R2Error from '../../../../model/errors/R2Error';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from 'src/components/composables/SettingSearchComposable';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const activeExport = ref<'file' | 'code' | null>(null);
const isExporting = computed(() => activeExport.value !== null);

const { isVisible } = useSettingSearch(() => props.searchTerm, [
    'Export profile',
    'As file',
    'As code',
]);

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
        <template #title>Export profile</template>
        <template #description>
            Export your mod list and configs to share with friends and get an identical profile quickly and easily.
        </template>
        <div class="export-profile-setting">
            <button
                class="button"
                :class="{ 'is-loading': activeExport === 'file' }"
                :disabled="isExporting"
                @click="exportProfile('file', 'profileExport/exportProfileAsFile')"
            >
                As a file
            </button>
            <button
                class="button"
                :class="{ 'is-loading': activeExport === 'code' }"
                :disabled="isExporting"
                @click="exportProfile('code', 'profileExport/exportProfileAsCode')"
            >
                As a code
            </button>
        </div>
    </SettingsViewWrapper>
</template>

<style lang="scss" scoped>
.export-profile-setting {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}
</style>
