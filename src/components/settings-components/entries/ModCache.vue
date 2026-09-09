<script lang="ts" setup>
import { computed, ref } from 'vue';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../composables/SettingSearchComposable';
import CacheUtil from '../../../r2mm/mods/CacheUtil';
import R2Error from '../../../model/errors/R2Error';
import { useCacheComposable } from '@r2/components/composables/CacheComposable';
import Game from '@r2/model/game/Game';
import FileUtils from '../../../utils/FileUtils';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const { getScope, refresh } = useCacheComposable();

const cacheEnabled = computed<boolean>(() => !store.state.download.ignoreCache);
const isCleaning = ref<boolean>(false);
const activeGame = computed<Game>(() => store.state.activeGame);

const cacheContent = computed(() => getScope(activeGame.value));
const cacheSize = computed<string>(() => FileUtils.humanReadableSize(cacheContent.value.cacheByteSize.value));
const cachePackageCount = computed<number>(() => cacheContent.value.cachePackageCount.value);

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
    }

    try {
        await refresh(activeGame.value);
    } catch (e) {
        store.commit('error/handleError', R2Error.fromThrownValue(e, 'Failed to read the mod cache'));
    }

    isCleaning.value = false;
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>Mod cache</template>
        <template #description>
            <p>Downloaded mods are kept in a cache so that they don't need to be downloaded again.</p>
            <p>Using <strong>{{ cacheSize }}</strong> across {{ cachePackageCount }} {{ cachePackageCount === 1 ? 'mod' : 'mods' }} for {{ activeGame.displayName }}.</p>
        </template>
        <div class="setting-column">
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
                <p class="setting-hint" @click.stop.prevent>{{ cacheEnabled ? 'Reusing cached downloads (recommended)' : 'Ignores the cache when downloading mods. Re-downloads each time.' }}</p>
                <p class="setting-hint" v-if="!cacheEnabled" @click.stop.prevent>Mods will still be written to the cache and will continue to use disk space.</p>
            </div>
            <div class="setting-row">
                <button
                    class="button"
                    :class="{ 'is-loading': isCleaning }"
                    :disabled="isCleaning"
                    @click="cleanCache"
                >
                    Optimize cache
                </button>
                <span class="setting-hint">Removes cached mods that aren't in any profile to free up storage space.</span>
            </div>
        </div>
    </SettingsViewWrapper>
</template>
