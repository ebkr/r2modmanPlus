<template>
    <div>
        <details :open="isOpen" @toggle="isOpen = ($event.target as HTMLDetailsElement).open">
            <summary class="section-toggle">
                <h3 class="section-header">
                    {{ title }} <span class="tag is-inactive-link">{{ count }}</span>
                    <i :class="['fas', isOpen ? 'fa-angle-down' : 'fa-angle-right']"></i>
                </h3>
            </summary>
            <div v-if="$slots.default" class="margin-top">
                <slot/>
            </div>
        </details>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

type Props = {
    title: string;
    count: number;
    defaultOpen?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    defaultOpen: true
});

const isOpen = ref(props.defaultOpen);
</script>

<style scoped lang="scss">
.section-header {
    color: var(--v2-primary-text-color);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0;
}

.section-toggle {
    cursor: pointer;
    display: block;
}
</style>
