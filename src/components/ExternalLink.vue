<template>
    <a v-if="target === 'file'" @click="selectFile()" class='target-link'>
        <slot></slot>
    </a>
    <a v-else-if="target !== null" @click="openLink()" class='target-link'>
        <slot></slot>
    </a>
    <router-link v-else-if="target === null" tag="div" :to="url" class='target-link'>
        <a>
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
    export default class ExternalLink extends Vue {

        @Prop({default: ''})
        url: string | undefined;

        @Prop({default: null})
        target: string | undefined;

        openLink() {
            ipcRenderer.send('open-link', this.url);
        }

        selectFile() {
            spawn('explorer.exe', [`${this.url}`]);
        }
    }
</script>