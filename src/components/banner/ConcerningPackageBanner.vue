<script setup lang="ts">

import { getStore } from '@r2/providers/generic/store/StoreProvider';
import { useI18n } from 'vue-i18n';
import { State } from '@r2/store';
import { useConcerningPackageComposable } from '@r2/components/composables/ConcerningPackageComposable';


const { t } = useI18n();

const store = getStore<State>();
const { hasConcerningPackages } = useConcerningPackageComposable();

function addUnlinkedFilter() {
    store.commit('profile/scopeLocalModListToUnlinkedPackages');
}
</script>

<template>
    <div class="notification is-concern margin-right" v-show="hasConcerningPackages">
        <span>{{ t('translations.banners.concerningPackage.text') }}</span> <a href="#" @click.stop.prevent="addUnlinkedFilter">{{ t('translations.banners.concerningPackage.action') }}</a>
    </div>
</template>

<style scoped lang="scss">
.is-concern {
    background-color: var(--notification-concern-background-color);
    color: var(--notification-concern-text-color);
}

.notification {
    margin-bottom: 0.5rem;
}
</style>
