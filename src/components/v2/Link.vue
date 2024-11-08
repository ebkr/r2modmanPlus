<template>
    <component  :is="tag" v-if="target === 'file'" @click="selectFile()" class='c-link' data-semantic="file-selection">
        <slot></slot>
    </component>
    <component  :is="tag" v-else-if="target != null" @click="openLink()" class='c-link' data-semantic="external-link">
        <slot></slot>
    </component>
    <component  :is="tag" v-else class='c-link' data-semantic="visual-indicator">
        <slot></slot>
    </component>
</template>

<script lang="ts" setup>
import LinkProvider from '../../providers/components/LinkProvider';

interface LinkProps {
    url: string;
    target?: string;
    tag: string;
}

const linkProps = withDefaults(defineProps<LinkProps>(), {
    tag: "a"
})

function openLink() {
    LinkProvider.instance.openLink(linkProps.url);
}

function selectFile() {
    LinkProvider.instance.selectFile(linkProps.url);
}
</script>

<style lang="scss" scoped>
    .c-link {
        color: var(--v2-link-text-color);

        &:focus, &:hover, &:active {
            color: var(--v2-link-active-text-color);
        }
    }
</style>
