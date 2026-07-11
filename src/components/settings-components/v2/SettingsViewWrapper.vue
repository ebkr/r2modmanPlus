<script lang="ts" setup>
import { inject, ref, type Ref } from 'vue';

const category = inject<Ref<string>>('settingsCategory', ref(''));
</script>

<template>
    <div class="settings-entry">
        <p v-if="category" class="settings-entry__caption">{{ category }}</p>
        <p class="settings-entry__title">
            <slot name="title"></slot>
        </p>
        <p v-if="$slots.description" class="settings-entry__description">
            <slot name="description"></slot>
        </p>
        <div class="settings-entry__control">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.settings-entry {
    display: flex;
    flex-direction: column;
    padding: 1.1rem 0;
    border-bottom: 1px solid var(--border, #e1e1e1);

    &__caption {
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-secondary, #6b6464);
        margin-bottom: 0.2rem;
    }

    &__title {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text-strong, #363636);
        margin-bottom: 0.35rem;
        line-height: 1.35;
    }

    &__description {
        font-size: 0.9rem;
        color: var(--text-secondary, #6b6464);
        line-height: 1.45;
        margin-bottom: 0.6rem;
        max-width: 46rem;
    }

    &__control {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
}
</style>
