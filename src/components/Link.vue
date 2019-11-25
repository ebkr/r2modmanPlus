<template>
    <a v-if="target !== null" :href="link" :target="target">{{text}}</a>
    <router-link v-else-if="target === null" tag="div" :to="link">
        <a>{{text}}</a>
    </router-link>
</template>

<script lang='ts'>
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class Hero extends Vue {
    @Prop({default: ''})
    link: string | undefined;

    @Prop({default: null})
    target: string | undefined;

    @Prop({default: ''})
    text: string | undefined;
}
</script>