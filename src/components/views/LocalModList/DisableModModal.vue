<script lang="ts" setup>
import { ModalCard } from '../../all';
import R2Error from '../../../model/errors/R2Error';
import ManifestV2 from '../../../model/ManifestV2';
import { LogSeverity } from '../../../providers/ror2/logging/LoggerProvider';
import Dependants from '../../../r2mm/mods/Dependants';
import { computed, ref } from 'vue';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';

const store = getStore<State>();

const modBeingDisabled = ref<string | null>(null);
const mod = computed(() => {
    if (store.state.modals.disableModModalMod === null) {
        throw new R2Error(
            'Error while opening DisableModModal',
            'Mod not provided'
        );
    }
    return store.state.modals.disableModModalMod;
})

const dependants = computed(() =>
    Dependants.getDependantList(mod.value, store.state.profile.modList));

const isLocked = computed(() => modBeingDisabled.value !== null);

const isOpen = computed(() =>
    store.state.modals.isDisableModModalOpen
    && store.state.modals.disableModModalMod !== null);

async function disableModIncludingDependants() {
    await disableMods([...dependants.value, mod.value]);
}

async function disableModExcludingDependants() {
    await disableMods([mod.value]);
}

async function disableMods(mods: ManifestV2[]) {
    const onProgress = (mod: ManifestV2) => modBeingDisabled.value = mod.getName();

    try {
        await store.dispatch(
            'profile/disableModsFromActiveProfile',
            { mods, onProgress }
        );
    } catch (e) {
        store.commit('error/handleError', {
            error: R2Error.fromThrownValue(e),
            severity: LogSeverity.ACTION_STOPPED
        });
    } finally {
        onClose();
        modBeingDisabled.value = null;
    }
}

function onClose() {
    store.commit('closeDisableModModal');
}
</script>

<template>
    <ModalCard id="disable-mod-modal" v-if="isOpen" :is-active="isOpen" :can-close="!isLocked" @close-modal="onClose">
        <template v-slot:header>
            <h2 class="modal-title">{{ $t('DisableModModal.disabling') }} {{mod.getName()}}</h2>
        </template>
        <template v-slot:body>
            <div class="max-height-100 is-flex is-flex-direction-column">
                <div class='notification is-warning'>
                    <p> {{ $t('DisableModModal.other_mods_depend_on_this_mod') }} <strong>{{ $t('DisableModModal.disable_all') }}</strong> {{ $t('DisableModModal.to_disable_dependent_mods_othe') }} </p>
                </div>
                <h3 class="subtitle mb-3">{{ $t('DisableModModal.mods_to_be_disabled') }}</h3>
                <div class="is-flex-shrink-1 overflow-auto code-snippet">
                    <ul class="list">
                        <li class="list-item">{{mod.getName()}}</li>
                        <li class="list-item" v-for='(mod) in dependants'
                            :key='`dependant-${mod.getName()}`'>
                            {{mod.getName()}}
                        </li>
                    </ul>
                </div>
                <div v-if="isLocked" class="mt-3">
                    <h3 class="subtitle mb-3">{{ $t('DisableModModal.disabling') }} {{modBeingDisabled}}</h3>
                    <progress class="progress is-small is-info"/>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <button class="button is-info"
                    :disabled="isLocked"
                    @click="disableModIncludingDependants"> {{ $t('DisableModModal.disable_all_recommended') }} </button>
            <button class="button"
                    :disabled="isLocked"
                    @click="disableModExcludingDependants"> {{ $t('DisableModModal.disable') }} {{mod.getName()}} {{ $t('DisableModModal.only') }} </button>
        </template>
    </ModalCard>
</template>

<style scoped lang="scss">

</style>
