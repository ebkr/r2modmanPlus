<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import ModalCard from '../../components/ModalCard.vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import ManifestV2 from '../../model/ManifestV2';

const { t } = useI18n();

const store = getStore<State>();

const isOpen = computed(() => store.state.modals.isDependencyStringsModalOpen);
const localModList = computed<ManifestV2[]>(() => store.state.profile.modList);

function close() {
    store.commit('closeDependencyStringsModal');
}
</script>

<template>
    <ModalCard id="dependency-strings-modal" v-show="isOpen" :is-active="isOpen" @close-modal="close">
        <template v-slot:header>
            <h2 class="modal-title">{{ t('translations.modals.dependencyStrings.title') }}</h2>
        </template>
        <template v-slot:body>
            <ul>
                <li v-for="(mod, index) in localModList" :key="`dep-str-${index}`">
                    {{ mod.getName() }}-{{ mod.getVersionNumber().toString() }}
                </li>
            </ul>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="close">{{ t('translations.modals.dependencyStrings.close') }}</button>
        </template>
    </ModalCard>
</template>
