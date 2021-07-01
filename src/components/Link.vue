<template>
    <a v-if="target === 'file'" @click="selectFile()" class='target-link' data-semantic="file-selection">
        <slot></slot>
    </a>
    <a v-else-if="target !== null" @click="openLink()" class='target-link' data-semantic="external-link">
        <slot></slot>
    </a>
    <a class='target-link' v-else-if="target === null" data-semantic="visual-indicator">
        <slot></slot>
    </a>
</template>

<script lang='ts'>
    import Vue from 'vue';
    import { Component, Prop } from 'vue-property-decorator'
    import LinkProvider from '../providers/components/LinkProvider';

    @Component
    export default class Link extends Vue {

        @Prop({default: ''})
        url: string | undefined;

        @Prop({default: null})
        target: string | undefined;

        openLink() {
            LinkProvider.instance.openLink(this.url!);
        }

        selectFile() {
            LinkProvider.instance.selectFile(this.url!)
        }
    }
</script>
