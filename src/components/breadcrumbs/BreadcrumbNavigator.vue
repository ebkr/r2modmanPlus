<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { Breadcrumb } from './Breadcrumb';

const router = useRouter();

const steps = computed<Breadcrumb[]>(() => {
    return (router.currentRoute.value.meta.breadcrumbs || []) as Breadcrumb[];
});
</script>

<template>
    <div v-if="steps.length >= 2" class="non-selectable">
        <span v-for="(step, index) in steps">
            <span class="separator" v-if="index !== 0">/</span>
            <template v-if="step.isActive">
                <span class="breadcrumb breadcrumb--active">{{ step.name() }}</span>
            </template>
            <template v-else>
                <router-link :to="step.path" class="breadcrumb">{{ step.name() }}</router-link>
            </template>
<!--            <span class="separator">/</span>-->
        </span>
    </div>
</template>

<style lang="scss" scoped>
.separator {
    margin: 0 0.5em;
    color: var(--border-active, #4a4a4a);
}

.breadcrumb {
    font-size: 0.75rem;
    &--active {
        color: var(--text-secondary, #6b6464);
    }
}
</style>
