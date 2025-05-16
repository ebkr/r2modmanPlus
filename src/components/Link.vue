<template>
    <component  :is="tag" v-if="target === 'file'" @click.stop="selectFile()" class='target-link' data-semantic="file-selection">
        <slot></slot>
    </component>
    <component  :is="tag" v-else-if="target !== null" @click.stop="openLink()" class='target-link' data-semantic="external-link">
        <slot></slot>
    </component>
    <component  :is="tag" class='target-link' v-else-if="target === null" data-semantic="visual-indicator">
        <slot></slot>
    </component>
</template>

<script lang='ts'>
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import LinkProvider from '../providers/components/LinkProvider';

@Component
    export default class Link extends Vue {

        @Prop({default: ''})
        url: string | undefined;

        @Prop({default: null})
        target: string | undefined;

        @Prop({default: 'a'})
        tag: string | undefined;

        openLink() {
            LinkProvider.instance.openLink(this.url!);
        }

        selectFile() {
            LinkProvider.instance.selectFile(this.url!)
        }
    }
</script>
