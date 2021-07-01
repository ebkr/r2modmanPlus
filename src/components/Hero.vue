<template>
    <section :class="['hero', heroType]" ref="section">
        <div class="hero-body non-selectable">
            <div class="container">
                <h1 class="title" ref="title">
                    {{title}}
                </h1>
                <h2 class="subtitle" ref="subtitle">
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
