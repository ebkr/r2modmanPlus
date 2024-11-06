<template>
    <section :class="['component__hero', heroTypeClass]" ref="section">
        <div class="hero-body non-selectable">
            <div class="container">
                <div>
                    <h1 class="hero__title" ref="title">
                        {{ title }}
                    </h1>
                </div>
                <h2 class="hero__subtitle" ref="subtitle">
                    {{ subtitle }}
                </h2>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface HeroProps {
    title: string;
    subtitle: string;
    heroType?: 'primary' | 'warning' | 'danger';
}

const heroProps = defineProps<HeroProps>();

const heroTypeClass = computed(() => {
    if (heroProps.heroType == undefined) {
        return '';
    }
    switch (heroProps.heroType) {
        case 'primary':
            return 'component__hero--primary';
        case 'warning':
            return 'component__hero--warning';
        case 'danger':
            return 'component__hero--danger';
    }
});
</script>

<style lang="scss" scoped>
.component__hero {

    &--primary {
        background-color: var(--r2-primary-color);
        color: var(--r2-primary-text-color);
    }

    &--warning {
        background-color: var(--r2-warning-color);
        color: var(--r2-warning-text-color);
    }

    .hero__title {
        // Display as inline due to current CSS imports margins taking precedence.
        // This is solved by being wrapped in a div.
        display: inline;
        user-select: none;
        font-size: 2rem;
        font-weight: 600;
        line-height: 1.125;
        word-break: break-word;
        margin-block-end: 0.83em;
    }

    .hero__subtitle {
        line-height: 1.5;
        font-size: 1.25rem;
        display: block;
    }
}

</style>
