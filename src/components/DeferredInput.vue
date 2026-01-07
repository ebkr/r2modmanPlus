<script lang="ts" setup>
import debounce from 'lodash.debounce';

type DeferredInputProps = {
    delay?: number;
    modelValue: string;
}

const props = withDefaults(defineProps<DeferredInputProps>(), {
    delay: 250,
});

const emits = defineEmits<{
    (e: 'update:modelValue', value: string): void,
}>();

const debounceExecutor = debounce(emitChange, props.delay);

function emitChange(value: string): void {
    emits('update:modelValue', value);
}
</script>

<template>
    <input class="input" :value="modelValue" @input="e => debounceExecutor(e.target.value)" />
</template>
