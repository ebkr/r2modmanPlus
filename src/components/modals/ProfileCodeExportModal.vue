<script lang="ts" setup>
import ModalCard from '../ModalCard.vue';
import { computed } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';

const store = getStore<State>();
const isOpen = computed(() => store.state.modals.isProfileCodeExportModalOpen);

const exportCode = computed(() => store.state.profileExport.exportCode);

function closeModal() {
    store.commit("closeProfileCodeExportModal");
}
</script>

<template>
    <ModalCard id="profile-exported-modal" :is-active="isOpen" @close-modal="closeModal" :can-close="true">
        <template v-slot:header>
            <h2 class='modal-title'>{{ $t('ProfileCodeExportModal.profile_exported') }}</h2>
        </template>
        <template v-slot:body>
            <p>{{ $t('ProfileCodeExportModal.your_code') }} <strong>{{exportCode}}</strong> {{ $t('ProfileCodeExportModal.has_been_copied_to_your_clipbo') }} </p>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="closeModal"> {{ $t('ProfileCodeExportModal.done') }} </button>
        </template>
    </ModalCard>

</template>
