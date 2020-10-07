<template>
    <a v-if="target === 'file'" @click="selectFile()" class='target-link'>
        <slot></slot>
    </a>
    <a v-else-if="target !== null" @click="openLink()" class='target-link'>
        <slot></slot>
    </a>
    <router-link v-else-if="target === null" tag="div" :to="url">
        <a class='target-link'>
            <slot></slot>
        </a>
    </router-link>
</template>

<script lang='ts'>
    import Vue from 'vue';
    import { Component, Prop } from 'vue-property-decorator'
    import { ipcRenderer, shell } from 'electron';

    @Component
    export default class Link extends Vue {

        @Prop({default: ''})
        url: string | undefined;

        @Prop({default: null})
        target: string | undefined;

        openLink() {
            ipcRenderer.send('open-link', this.url);
        }

        selectFile() {
            shell.showItemInFolder(this.url!);
        }
    }
</script>
