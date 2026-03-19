<template>
    <VDropdown
        theme="activity-action"
        :triggers="['hover']"
        :popper-triggers="['hover']"
        :placement="placement"
        :distance="8"
        :delay="{ show: 0, hide: 200 }"
    >
        <slot />
        <template #popper>
            <slot name="popper" />
        </template>
    </VDropdown>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
    placement?: string
}>(), {
    placement: 'top-start'
});
</script>

<style lang="scss">
.v-popper--theme-activity-action {
    .v-popper__inner {
        background: var(--preview-panel-background-color);
        border: 1px solid var(--border, #e1e1e1);
        border-radius: 6px;
        padding: 0.25rem;
        min-width: 11rem;
        box-shadow: 0 4px 12px var(--shadow, #0000003b);
    }

    .v-popper__arrow-outer,
    .v-popper__arrow-inner {
        display: none;
    }
}
</style>
