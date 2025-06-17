<template>
    <div class="indent-container">
        <template v-if="value !== undefined">
            <progress :class="['progress', 'is-small', className]" :max='max' :value='value'>{{value}}%</progress>
        </template>
        <template v-if="value === undefined">
            <progress :class="['progress', 'is-small', className]" :max='max'>{{max}}%</progress>
        </template>
    </div>
</template>

<script lang='ts' setup>
type ProgressProps = {
    max?: number;
    value?: number;
    className?: string[];
}

const props = withDefaults(defineProps<ProgressProps>(), {
    max: 100,
    value: undefined,
    className: []
});
</script>

<style lang="scss" scoped>
    .indent-container {
        margin: 0.5em;
    }
</style>
