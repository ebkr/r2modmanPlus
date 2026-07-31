<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import Game from '../../../model/game/Game';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { useSettingSearch } from '../../composables/SettingSearchComposable';
import { useI18n } from 'vue-i18n';
import { getLaunchType, LaunchType } from '../../../model/real_enums/launch/LaunchType';
import { LaunchTypeModalOpen } from '../../modals/launch-type/LaunchTypeRefs';

const store = getStore<State>();

const props = defineProps<{
    searchTerm?: string;
}>();

const activeGame = computed<Game>(() => store.state.activeGame);
const launchType = ref<LaunchType>(LaunchType.AUTO);

const { t } = useI18n();

const { isVisible } = useSettingSearch(() => props.searchTerm, 'translations.pages.settings.entries.changeLaunchBehaviour.searchTerms', () => [
    launchType.value,
]);

async function refreshLaunchType() {
    launchType.value = await getLaunchType(activeGame.value);
}

onMounted(refreshLaunchType);
watch(activeGame, refreshLaunchType);

watch(LaunchTypeModalOpen, (open) => {
    if (!open) {
        refreshLaunchType();
    }
});

function openLaunchTypeModal() {
    LaunchTypeModalOpen.value = true;
}
</script>

<template>
    <SettingsViewWrapper v-show="isVisible">
        <template #title>{{ t('translations.pages.settings.entries.changeLaunchBehaviour.title') }}</template>
        <template #description>
            <p>{{ t('translations.pages.settings.entries.changeLaunchBehaviour.description') }}</p>
            <p>{{ t('translations.pages.settings.entries.changeLaunchBehaviour.current') }} <strong>{{ launchType }}</strong>.</p>
        </template>
        <button class="button" @click="openLaunchTypeModal">{{ t('translations.pages.settings.entries.changeLaunchBehaviour.title') }}</button>
    </SettingsViewWrapper>
</template>
