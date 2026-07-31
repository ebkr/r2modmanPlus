<script lang="ts" setup>
import { computed, ref } from 'vue';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../composables/SettingSearchComposable';
import { useI18n } from 'vue-i18n';
import CacheUtil from '../../../r2mm/mods/CacheUtil';
import R2Error from '../../../model/errors/R2Error';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const cacheEnabled = computed<boolean>(() => !store.state.download.ignoreCache);
const isCleaning = ref<boolean>(false);

const { t } = useI18n();

const { isVisible } = useSettingSearch(() => props.searchTerm, 'translations.pages.settings.entries.modCache.searchTerms');

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
        <template #title>{{ t('translations.pages.settings.entries.modCache.title') }}</template>
        <template #description>
            {{ t('translations.pages.settings.entries.modCache.description') }}
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
                    {{ cacheEnabled ? t('translations.pages.settings.entries.modCache.enabled') : t('translations.pages.settings.entries.modCache.disabled') }}
                </label>
                <p class="setting-hint" @click.stop.prevent>{{ cacheEnabled ? t('translations.pages.settings.entries.modCache.enabledHint') : t('translations.pages.settings.entries.modCache.disabledHint') }}</p>
                <p class="setting-hint" v-if="!cacheEnabled" @click.stop.prevent>{{ t('translations.pages.settings.entries.modCache.stillWritten') }}</p>
            </div>
            <div class="setting-row">
                <button
                    class="button"
                    :class="{ 'is-loading': isCleaning }"
                    :disabled="isCleaning"
                    @click="cleanCache"
                >
                    {{ t('translations.pages.settings.entries.modCache.action') }}
                </button>
                <span class="setting-hint">{{ t('translations.pages.settings.entries.modCache.actionDescription') }}</span>
            </div>
        </div>
    </SettingsViewWrapper>
</template>
