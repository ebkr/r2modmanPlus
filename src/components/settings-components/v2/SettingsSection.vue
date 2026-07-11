<script lang="ts" setup>
import { provide, toRef } from 'vue';

const props = defineProps<{ name: string }>();

provide('settingsCategory', toRef(props, 'name'));
</script>

<template>
    <section>
        <slot></slot>
    </section>
</template>
