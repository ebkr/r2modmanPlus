<script setup lang="ts">

import { getStore } from '@r2/providers/generic/store/StoreProvider';
import { State } from '@r2/store';
import { useConcerningPackageComposable } from '@r2/components/composables/ConcerningPackageComposable';

const store = getStore<State>();
const { hasConcerningPackages } = useConcerningPackageComposable();

function addUnlinkedFilter() {
    store.commit('profile/scopeLocalModListToUnlinkedPackages');
}
</script>

<template>
    <div class="notification is-concern margin-right" v-show="hasConcerningPackages">
        <span>You have packages that can no longer be found on Thunderstore.</span> <a href="#" @click.stop.prevent="addUnlinkedFilter">Click here to review packages.</a>
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
