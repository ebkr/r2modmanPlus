<template>
    <div>
        <a class="section-toggle" @click="isOpen = !isOpen">
            <h3 class="section-header">
                {{ title }} <span class="tag is-inactive-link">{{ count }}</span>
                <i :class="['fas', isOpen ? 'fa-angle-down' : 'fa-angle-right']"></i>
            </h3>
        </a>
        <slot v-if="isOpen" />
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

const isOpen = ref(props.defaultOpen ?? true);
</script>

<style scoped lang="scss">
.section-header {
    color: var(--v2-primary-text-color);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.section-toggle {
    cursor: pointer;
    display: block;
}
</style>
