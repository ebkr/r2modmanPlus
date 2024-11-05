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

<script lang="ts" setup>
export interface HeroProps {
    title: string;
    subtitle: string;
    heroType?: string;
}

const heroProps = defineProps<HeroProps>();
</script>
