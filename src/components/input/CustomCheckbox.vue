<template>
    <label class="v2-checkbox" :class="{ 'v2-checkbox--disabled': disabled }">
        <input
            class="v2-checkbox__native"
            type="checkbox"
            :checked="modelValue"
            :disabled="disabled"
            :aria-label="ariaLabel || undefined"
            @change="onChange"
        />
        <span class="v2-checkbox__box" aria-hidden="true">
            <svg class="v2-checkbox__check" viewBox="0 0 16 16" fill="none">
                <path
                    d="M3.5 8.5l3 3 6-6.5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </span>
        <span
            v-if="label || $slots.default"
            class="v2-checkbox__label"
            :aria-hidden="ariaLabel ? 'true' : undefined">
            <slot>{{ label }}</slot>
        </span>
    </label>
</template>

<script lang="ts" setup>

export type CustomCheckboxProps = {
    modelValue: boolean;
    label?: string;
    ariaLabel?: string;
    disabled?: boolean;
}

const props = withDefaults(defineProps<CustomCheckboxProps>(), {
    label: '',
    ariaLabel: '',
    disabled: false,
});

const emits = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>();

function onChange(event: Event) {
    if (props.disabled) {
        return;
    }
    const target = event.target as HTMLInputElement;
    emits('update:modelValue', target.checked);
}

</script>

<style lang="scss" scoped>
.v2-checkbox {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
    color: var(--v2-primary-text-color, #222);

    --v2-checkbox-accent: var(--v2-hero-background-color, #3f8ecf);
}

.v2-checkbox__native {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.v2-checkbox__box {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1.15rem;
    height: 1.15rem;
    border: 2px solid var(--input-border-color, var(--border, #e1e1e1));
    border-radius: 4px;
    background-color: var(--input-background-color, var(--background, #fff));
    transition: background-color 0.12s ease, border-color 0.12s ease;
}

.v2-checkbox__check {
    width: 100%;
    height: 100%;
    color: var(--v2-hero-text-color, #fff);
    opacity: 0;
    transform: scale(0.6);
    transition: opacity 0.12s ease, transform 0.12s ease;
}

.v2-checkbox__label {
    font-size: 0.9rem;
    line-height: 1.2;
}

// Checked / indeterminate state.
.v2-checkbox__native:checked + .v2-checkbox__box,
.v2-checkbox__native:indeterminate + .v2-checkbox__box {
    background-color: var(--v2-checkbox-accent);
    border-color: var(--v2-checkbox-accent);

    .v2-checkbox__check {
        opacity: 1;
        transform: scale(1);
    }
}

.v2-checkbox__native:focus-visible + .v2-checkbox__box {
    border-color: var(--input-focus-border-color, #3273dc);
    box-shadow: 0 0 0 0.125em rgba(72, 95, 199, 0.25);
}

.v2-checkbox:hover:not(.v2-checkbox--disabled) .v2-checkbox__box {
    border-color: var(--v2-checkbox-accent);
}

.v2-checkbox--disabled {
    cursor: not-allowed;
    opacity: 0.5;
}
</style>
