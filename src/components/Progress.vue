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

<script lang='ts'>
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class Progress extends Vue {
    @Prop({default: 100})
    max: number | undefined;

    @Prop()
    value: number | undefined;

    @Prop({default: ''})
    className: string | undefined;
}

</script>

<style lang="scss" scoped>
    .indent-container {
        margin: 0.5em;
    }
</style>