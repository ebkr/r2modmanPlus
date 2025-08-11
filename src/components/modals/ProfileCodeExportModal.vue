<script lang="ts" setup>
import ModalCard from '../ModalCard.vue';
import {computed, ref} from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import {useI18n} from "vue-i18n";
import InteractionProvider from "../../providers/ror2/system/InteractionProvider";

const store = getStore<State>();
const { t } = useI18n();

const isOpen = computed(() => store.state.modals.isProfileCodeExportModalOpen);
const exportCode = computed(() => store.state.profileExport.exportCode);

const isCopied = ref<boolean>(false);
const exportCodeText = computed(() => isCopied.value ? 'Copied to clipboard' : exportCode.value);

function copyCode() {
    InteractionProvider.instance.copyToClipboard(exportCode.value);
    isCopied.value = true;
    setTimeout(() => {
        isCopied.value = false;
    }, 1000);
}

function closeModal() {
    store.commit("closeProfileCodeExportModal");
}
</script>

<template>
    <ModalCard id="profile-exported-modal" :is-active="isOpen" @close-modal="closeModal" :can-close="true">
        <template v-slot:header>
            <h2 class='modal-title'>
                {{ t('translations.pages.manager.modals.codeExport.title') }}
            </h2>
        </template>
        <template v-slot:body>
            <p>
                {{ t('translations.pages.manager.modals.codeExport.description') }}
            </p>
            <code class="code">
                <code>{{ exportCodeText }}</code>
                <a href="#" @click="copyCode">
                    <i class="fas fa-copy"></i>
                </a>
            </code>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="closeModal">
                {{ t('translations.pages.manager.modals.codeExport.done') }}
            </button>
        </template>
    </ModalCard>

</template>
