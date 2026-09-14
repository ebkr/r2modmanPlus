<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import ManagerSettings from '../../../r2mm/manager/ManagerSettings';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../composables/SettingSearchComposable';
import { useI18n } from 'vue-i18n';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const settings = ref<ManagerSettings | null>(null);
const expandedCards = ref<boolean>(false);

const { t } = useI18n();

const { isVisible } = useSettingSearch(() => props.searchTerm, 'translations.pages.settings.entries.expandCards.searchTerms');

onMounted(async () => {
    settings.value = await ManagerSettings.getSingleton(store.state.activeGame);
    expandedCards.value = settings.value.getContext().global.expandedCards;
});

async function setExpanded(expanded: boolean) {
    expandedCards.value = expanded;
    if (expanded) {
        await settings.value?.expandCards();
    } else {
        await settings.value?.collapseCards();
    }
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>{{ t('translations.pages.settings.entries.expandCards.title') }}</template>
        <template #description>
            {{ t('translations.pages.settings.entries.expandCards.description') }}
        </template>
        <div class="field" @click.prevent.stop="setExpanded(!expandedCards)">
            <input
                id="switch-expand-cards"
                type="checkbox"
                :class="['switch', { 'is-info': expandedCards }]"
                :checked="expandedCards"
            />
            <label for="switch-expand-cards">{{ expandedCards ? t('translations.pages.settings.entries.expandCards.expanded') : t('translations.pages.settings.entries.expandCards.collapsed') }}</label>
        </div>
    </SettingsViewWrapper>
</template>
