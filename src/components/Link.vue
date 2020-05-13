<template>
    <a v-if="target === 'file'" @click="selectFile()" :class='["target-link", extraClass]'>
        <slot></slot>
    </a>
    <a v-else-if="target !== null" @click="openLink()" :class='["target-link", extraClass]'>
        <slot></slot>
    </a>
    <router-link v-else-if="target === null" tag="div" :to="url">
        <a :class='["target-link", extraClass]'>
            <slot></slot>
        </a>
    </router-link>
</template>

<script lang='ts'>
    import Vue from 'vue';
    import { Component, Prop } from 'vue-property-decorator'
    import { ipcRenderer } from 'electron';
    import { spawn } from "child_process";

    @Component
    export default class Link extends Vue {

        @Prop({default: ''})
        extraClass: string | undefined;

        @Prop({default: ''})
        url: string | undefined;

        @Prop({default: null})
        target: string | undefined;

        openLink() {
            ipcRenderer.send('open-link', this.url);
        }

        selectFile() {
            spawn('powershell.exe', ['explorer', `/select,"${this.url}"`]);
        }
    }
</script>