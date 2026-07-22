<script setup lang="ts">
import { computed } from 'vue';
import ModalCard from '@r2/components/ModalCard.vue';
import { State } from '@r2/store';
import { getStore } from '@r2/providers/generic/store/StoreProvider';
import ManifestV2 from '@r2/model/ManifestV2';
import { useModManagementComposable } from 'components/composables/ModManagementComposable';

const store = getStore<State>();

const { uninstallMod } = useModManagementComposable();

const isOpen = computed(() => store.state.modals.isVulnerableModReviewModalOpen);
const modToReview = computed<ManifestV2 | null>(() => store.state.modals.vulnerableModToReview);

function close() {
    store.commit('closeVulnerableModReviewModal');
}

async function removeMod() {
    await uninstallMod(modToReview.value!);
    close();
}
</script>

<template>
    <ModalCard id="review-package-modal" v-if="isOpen && modToReview" :is-active="isOpen" :can-close="true" @close-modal="close">
        <template v-slot:header>
            <h2 class="modal-title">Review {{ modToReview.getName() }}</h2>
        </template>
        <template v-slot:body>
            <p class="notification is-warning">It is generally recommended to remove mods that have been removed from Thunderstore.</p>
            <div>
                <hr/>
                <p class="margin-bottom">This mod was originally downloaded using the Online section however no longer appears in the package cache.</p>
                <p class="margin-bottom">When a mod is no longer in the package cache, it means that it has been removed from Thunderstore.</p>
                <p>Other people will be unable to import this mod if the profile is exported.</p>
            </div>
        </template>
        <template v-slot:footer>
            <button class="button">
                Mark version as safe
            </button>
            <button class="button is-danger" @click="removeMod">
                Remove mod
            </button>
        </template>
    </ModalCard>
</template>

<style scoped lang="scss">

</style>
