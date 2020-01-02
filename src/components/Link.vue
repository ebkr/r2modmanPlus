<template>
    <a v-if="target !== null" @click="openLink()">
        <slot></slot>
    </a>
    <router-link v-else-if="target === null" tag="div" :to="url">
        <a>
            <slot></slot>
        </a>
    </router-link>
</template>

<script lang='ts'>
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator'
import { ipcRenderer } from 'electron';

@Component
export default class Hero extends Vue {

    @Prop({default: ''})
    url: string | undefined;

    @Prop({default: null})
    target: string | undefined;

    openLink() {
        ipcRenderer.send('open-link', this.url);
    }
}
</script>