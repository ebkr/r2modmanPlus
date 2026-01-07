<script lang="ts" setup>

import LinkProvider from '../../providers/components/LinkProvider';

type InternalLinkProps = {
    url: string;
    tag?: string;
}

const props = withDefaults(defineProps<InternalLinkProps>(), {
   tag: 'a'
});

function openLink() {
    LinkProvider.instance.openLink(props.url);
}
</script>

<template>
    <component :is="tag" @click="openLink" class='c-link'><slot></slot></component>
</template>

<style lang="scss" scoped>
.c-link {
    color: var(--v2-link-text-color);

    &:focus, &:hover, &:active {
        color: var(--v2-link-active-text-color);
    }

    &.button {
        &:hover {
            color: var(--v2-link-text-color);
        }
    }
}
</style>
