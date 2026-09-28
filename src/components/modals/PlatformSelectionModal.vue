<script lang="ts" setup>
import { inject } from 'vue';
import { useI18n } from 'vue-i18n';
import ModalCard from '../ModalCard.vue';
import { Platform } from '../../model/schema/ThunderstoreSchema';
import EnumResolver from '../../model/enums/_EnumResolver';
import { gameSelectionKey } from '../composables/GameSelectionComposable';

defineProps<{
    isOpen: boolean;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'select-platform'): void;
}>();

const { t } = useI18n();

const {
    selectedGame,
    selectedPlatform,
} = inject(gameSelectionKey)!;

function getPlatformKey(platform: Platform) {
    return EnumResolver.from(Platform, platform);
}
</script>

<template>
    <ModalCard id="select-platform-modal" v-show="isOpen" :is-active="isOpen" @close-modal="emit('close')" class="z-max z-top">
        <template v-slot:header>
            <h2 class='modal-title'>{{ t('translations.modals.platform.header') }}</h2>
        </template>
        <template v-slot:body>
            <div v-if="selectedGame !== null">
                <div v-for="(platform, index) of selectedGame.storePlatformMetadata" :key="`${index}-${platform.storePlatform}`">
                    <input type="radio" :id="`${index}-${platform.storePlatform}`" :value="platform.storePlatform" v-model="selectedPlatform"/>
                    <label :for="`${index}-${platform.storePlatform}`"><span class="margin-right margin-right--half-width"/>{{ t(`translations.platforms.${getPlatformKey(platform.storePlatform)}`) }}</label>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <button class='button is-info' @click="emit('select-platform')">
                {{ t('translations.modals.platform.selectAction') }}
            </button>
        </template>
    </ModalCard>
</template>
