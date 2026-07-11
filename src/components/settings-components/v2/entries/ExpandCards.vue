<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getStore } from '../../../../providers/generic/store/StoreProvider';
import { State } from '../../../../store';
import ManagerSettings from '../../../../r2mm/manager/ManagerSettings';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';

const store = getStore<State>();
const settings = ref<ManagerSettings | null>(null);
const expandedCards = ref<boolean>(false);

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
    <SettingsViewWrapper>
        <template #title>Expand cards by default</template>
        <template #description>
            Show mod cards fully expanded rather than collapsed when opening a mod list.
        </template>
        <div class="field" @click.prevent.stop="setExpanded(!expandedCards)">
            <input
                id="switch-expand-cards"
                type="checkbox"
                :class="['switch', { 'is-info': expandedCards }]"
                :checked="expandedCards"
            />
            <label for="switch-expand-cards">{{ expandedCards ? 'Expanded' : 'Collapsed' }}</label>
        </div>
    </SettingsViewWrapper>
</template>

<style scoped lang="scss">
.switch {
    position: relative;
}
</style>
