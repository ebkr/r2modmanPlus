<script lang="ts" setup>
import { computed } from 'vue';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import SettingsViewWrapper from '../../../SettingsViewWrapper.vue';
import { useSettingSearch } from 'components/composables/SettingSearchComposable';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const cacheEnabled = computed<boolean>(() => !store.state.download.ignoreCache);

const { isVisible } = useSettingSearch(() => props.searchTerm, [
    'Toggle download cache',
    'Download cache',
    'Toggle',
]);

async function toggleCache() {
    await store.dispatch('download/toggleIgnoreCache');
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>Download cache</template>
        <template #description>
            When enabled, downloads will be skipped if an existing copy is already cache.
        </template>
        <div class="field" @click.prevent.stop="toggleCache">
            <input
                id="toggle-download-cache"
                type="checkbox"
                :class="['switch', { 'is-info': cacheEnabled }]"
                :checked="cacheEnabled"
            />
            <label for="toggle-download-cache">{{ cacheEnabled ? 'Enabled (recommended)' : 'Disabled' }}</label>
        </div>
    </SettingsViewWrapper>
</template>

<style scoped lang="scss">
.switch {
    position: relative;
}
</style>
