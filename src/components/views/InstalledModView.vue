<template>
    <div class="installed-view">
        <div v-if="localModList.length === 0" class="relative-position full-height--minus-em" id="no-mods-installed-info">
            <div class="absolute-center text-center top">
                <div class="margin-right">
                    <div>
                        <i class="fas fa-exclamation fa-5x"></i>
                    </div>
                    <br/>
                    <h3 class="title is-4">
                        {{ t('translations.pages.manager.installed.noModsInstalled.title') }}
                    </h3>
                    <h4 class="subtitle is-5">
                        {{ t('translations.pages.manager.installed.noModsInstalled.content') }}
                    </h4>
                </div>
            </div>
        </div>
        <template v-else-if="localModList.length > 0">
            <LocalModList>
                <template v-slot:above-list v-if="numberOfModsWithUpdates > 0 && !dismissedUpdateAll">
                    <div class="margin-bottom">
                        <div class="notification is-warning margin-right">
                            <span>
                                {{ t('translations.pages.manager.installed.updatableModsBanner.text', numberOfModsWithUpdates, { named: { numberOfModsWithUpdates: numberOfModsWithUpdates } }) }}
                                <a @click="store.commit('openUpdateAllModsModal')">
                                    {{ t('translations.pages.manager.installed.updatableModsBanner.updateAction') }}
                                </a>
                            </span>
                            <a class="float-right cursor-pointer" @click="store.commit('profile/dismissUpdateAll')">
                                <i class="fas fa-times" />
                            </a>
                        </div>
                    </div>
                </template>
            </LocalModList>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue';

import ManifestV2 from '../../model/ManifestV2';
import LocalModListProvider from '../../providers/components/loaders/LocalModListProvider';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import { useI18n } from 'vue-i18n';

const store = getStore<State>();
const { t } = useI18n();

// const LocalModList = computed(() => LocalModListProvider.provider);
const LocalModList = defineAsyncComponent(() => LocalModListProvider.provider());

const dismissedUpdateAll = computed<boolean>(() => store.state.profile.dismissedUpdateAll);
const localModList = computed<ManifestV2[]>(() => store.state.profile.modList);
const numberOfModsWithUpdates = computed<number>(() => store.getters['profile/modsWithUpdates'].length);
</script>

<style lang="scss" scoped>
.installed-view {
    display: flex;
    flex: 1;
    width: 100%;
}

#no-mods-installed-info {
    width: 100%;
}
</style>
