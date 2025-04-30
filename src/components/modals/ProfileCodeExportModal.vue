<script lang="ts" setup>
import ModalCard from 'components/ModalCard.vue';
import { computed } from 'vue';
import useStore from '../../store';

const store = useStore();
const isOpen = computed(() => store.state.modals.isProfileCodeExportModalOpen);

const exportCode = computed(() => store.state.profileExport.exportCode);

function closeModal() {
    store.commit("closeProfileCodeExportModal");
}
</script>

<template>
    <ModalCard id="profile-exported-modal" :is-active="isOpen" @close-modal="closeModal" :can-close="true">
        <template v-slot:header>
            <h2 class='modal-title'>Profile exported</h2>
        </template>
        <template v-slot:body>
            <p>Your code: <strong>{{exportCode}}</strong> has been copied to your clipboard. Just give it to a
                friend!
            </p>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="closeModal">
                Done
            </button>
        </template>
    </ModalCard>

</template>
