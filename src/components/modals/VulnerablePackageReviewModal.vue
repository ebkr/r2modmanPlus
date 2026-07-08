<script setup lang="ts">
import { computed } from 'vue';
import ModalCard from '@r2/components/ModalCard.vue';
import { State } from '@r2/store';
import { getStore } from '@r2/providers/generic/store/StoreProvider';
import ManifestV2 from '@r2/model/ManifestV2';
import { useModManagementComposable } from 'components/composables/ModManagementComposable';
import R2Error from '@r2/model/errors/R2Error';
import ProfileModList from '@r2/r2mm/mods/ProfileModList';

const store = getStore<State>();

const { uninstallMod } = useModManagementComposable();

const isOpen = computed(() => store.state.modals.isVulnerableModReviewModalOpen);
const modToReview = computed<ManifestV2 | null>(() => store.state.modals.vulnerableModToReview);
const profile = computed(() => store.getters['profile/activeProfile']);

function close() {
    store.commit('closeVulnerableModReviewModal');
}

async function removeMod() {
    await uninstallMod(modToReview.value!);
    close();
}

async function trustPackage() {
    const mods = await ProfileModList.getModList(profile.value.asImmutableProfile());
    if (mods instanceof R2Error) {
        console.error(mods);
        store.commit('error/handleError', mods);
        return;
    }
    const mod = mods.find(value => value.getName() === modToReview.value?.getName());
    if (mod) {
        mod.setTrustedPackage(true);
    }
    try {
        const err = await ProfileModList.saveModList(profile.value.asImmutableProfile(), mods);
        if (err instanceof R2Error) {
            store.commit('error/handleError', err);
            return;
        }
        await store.dispatch('profile/updateModList', mods);
    } catch (e) {
        store.commit('error/handleError', R2Error.fromThrownValue(e));
    } finally {
        close();
    }
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
            <button class="button" @click.stop.prevent="trustPackage">
                Mark version as safe
            </button>
            <button class="button is-danger" @click.stop.prevent="removeMod">
                Remove mod
            </button>
        </template>
    </ModalCard>
</template>

<style scoped lang="scss">

</style>
