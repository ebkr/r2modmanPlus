<template>
    <section :class="['hero', heroType]">
        <div class="hero-body">
            <div class="container">
                <h1 class="title">
                    {{title}}
                </h1>
                <h2 class="subtitle">
                    {{subtitle}}
                </h2>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class Hero extends Vue {
    @Prop({default: ''})
    heroType: string | undefined;

    @Prop({default: ''})
    title: string | undefined;

    @Prop({default: ''})
    subtitle: string | undefined;
}
</script>