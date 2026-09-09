<template>
    <section :class="['c-hero', heroTypeClass]" ref="section">
        <div class="c-hero__container">
            <h1 class="c-hero__title" ref="title">
                {{ title }}
            </h1>
            <h2 class="c-hero__subtitle" ref="subtitle">
                {{ subtitle }}
            </h2>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface HeroProps {
    title: string;
    subtitle: string;
    heroType: 'primary' | 'warning';
}

const heroProps = withDefaults(defineProps<HeroProps>(), {
  heroType: 'primary'
});

const heroTypeClass = computed(() => {
    if (heroProps.heroType == undefined) {
        return '';
    }
    switch (heroProps.heroType) {
        case 'primary':
            return 'c-hero--primary';
        case 'warning':
            return 'c-hero--warning';
    }
});
</script>

<style lang="scss" scoped>
.c-hero {

    $root: &;
    padding: 3rem;

    &__container {
        max-width: 1344px;
        margin: 0 auto;
    }

    &__title {
        // Display as inline due to current CSS imports margins taking precedence.
        // This is solved by being wrapped in a div.
        display: block;
        user-select: none;
        font-size: 2rem;
        font-weight: 600;
        line-height: 1.125;
        word-break: break-word;
        margin-block-end: 0.83em;
        margin-bottom: 0;
    }

    &__subtitle {
        display: block;
        line-height: 1.5;
        font-size: 1.25rem;
    }

    &--primary {
        background-color: var(--v2-hero-background-color);
        color: var(--v2-hero-text-color);

        #{$root}__subtitle {
            color: var(--v2-hero-subtitle-text-color);
        }

    }

    &--warning {
        background-color: var(--v2-warning-background-color);
        color: var(--v2-warning-text-color);

        #{$root}__subtitle {
            color: var(--v2-warning-subtitle-text-color);
        }
    }
}

</style>
