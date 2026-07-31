<script lang="ts" setup>
import { computed } from 'vue';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import SettingsViewWrapper from '../../../SettingsViewWrapper.vue';
import { useSettingSearch } from 'components/composables/SettingSearchComposable';
import { useI18n } from 'vue-i18n';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const cacheEnabled = computed<boolean>(() => !store.state.download.ignoreCache);

const { t } = useI18n();

const { isVisible } = useSettingSearch(() => props.searchTerm, 'translations.pages.settings.entries.downloadCache.searchTerms');

async function toggleCache() {
    await store.dispatch('download/toggleIgnoreCache');
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>{{ t('translations.pages.settings.entries.downloadCache.title') }}</template>
        <template #description>
            {{ t('translations.pages.settings.entries.downloadCache.description') }}
        </template>
        <div class="field" @click.prevent.stop="toggleCache">
            <input
                id="toggle-download-cache"
                type="checkbox"
                :class="['switch', { 'is-info': cacheEnabled }]"
                :checked="cacheEnabled"
            />
            <label for="toggle-download-cache">{{ cacheEnabled ? t('translations.pages.settings.entries.downloadCache.enabled') : t('translations.pages.settings.entries.downloadCache.disabled') }}</label>
        </div>
    </SettingsViewWrapper>
</template>

<style scoped lang="scss">
.switch {
    position: relative;
}
</style>
