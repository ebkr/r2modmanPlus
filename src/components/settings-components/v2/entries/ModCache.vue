<script lang="ts" setup>
import { computed, ref } from 'vue';
import { getStore } from '../../../../providers/generic/store/StoreProvider';
import { State } from '../../../../store';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from 'src/components/composables/SettingSearchComposable';
import CacheUtil from '../../../../r2mm/mods/CacheUtil';
import R2Error from '../../../../model/errors/R2Error';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const cacheEnabled = computed<boolean>(() => !store.state.download.ignoreCache);
const isCleaning = ref<boolean>(false);

const { isVisible } = useSettingSearch(() => props.searchTerm, [
    'Mod cache',
    'Download cache',
    'Reuse cached downloads',
    'Toggle',
    'Clean mod cache',
    'Free space',
]);

async function toggleCache() {
    await store.dispatch('download/toggleIgnoreCache');
}

async function cleanCache() {
    isCleaning.value = true;
    try {
        await CacheUtil.clean();
    } catch (e) {
        store.commit('error/handleError', R2Error.fromThrownValue(e, 'Failed to clean the mod cache'));
    } finally {
        isCleaning.value = false;
    }
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>Mod cache</template>
        <template #description>
            Downloaded mods are kept in a cache so that they don't need to be downloaded again.
        </template>
        <div class="mod-cache-setting">
            <div class="field" @click.prevent.stop="toggleCache">
                <input
                    id="toggle-download-cache"
                    type="checkbox"
                    :class="['switch', { 'is-info': cacheEnabled }]"
                    :checked="cacheEnabled"
                />
                <label for="toggle-download-cache">
                    {{ cacheEnabled ? 'Enabled' : 'Disabled' }}
                </label>
                <div class="mod-cache-setting__hint" @click.stop.prevent>{{ cacheEnabled ? 'Reusing cached downloads (recommended)' : 'Re-downloading every time' }}</div>
            </div>
            <div class="mod-cache-setting__clean">
                <button
                    class="button"
                    :class="{ 'is-loading': isCleaning }"
                    :disabled="isCleaning"
                    @click="cleanCache"
                >
                    Clean cache
                </button>
                <span class="mod-cache-setting__hint">Removes cached mods that aren't in any profile to free up storage space.</span>
            </div>
        </div>
    </SettingsViewWrapper>
</template>

<style scoped lang="scss">
.mod-cache-setting {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex: 1;

    &__clean {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        flex-wrap: wrap;
    }

    &__hint {
        font-size: 0.85rem;
        color: var(--text-secondary, #6b6464);
    }
}

.switch {
    position: relative;
}
</style>
