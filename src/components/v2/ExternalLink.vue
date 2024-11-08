<script lang="ts" setup>

import LinkProvider from '../../providers/components/LinkProvider';

type InternalLinkProps = {
    url: string;
}

const props = defineProps<InternalLinkProps>();

function openLink() {
    LinkProvider.instance.openLink(props.url);
}
</script>

<template>
    <a @click="openLink" class='c-link'><slot></slot></a>
</template>

<style lang="scss" scoped>
.c-link {
    color: var(--v2-link-text-color);

    &:focus, &:hover, &:active {
        color: var(--v2-link-active-text-color);
    }
}
</style>
