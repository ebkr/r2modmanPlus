<script lang="ts" setup>
import { computed } from 'vue';
import markdownit from 'markdown-it';
import { markdownItTable } from 'markdown-it-table';
import LinkProvider from 'src/providers/components/LinkProvider';

interface MarkdownRenderProps {
    markdown: string;
}

const props = defineProps<MarkdownRenderProps>();

const markdownToRender = computed(() => {
    const md = markdownit("commonmark", {}) as any;
    md.use(markdownItTable)
    return md.render(props.markdown);
})

function captureClick(e: Event) {
    if (e.target && e.target instanceof HTMLElement) {
        if (e.target.tagName.toLowerCase() === "a") {
            if (e.target.getAttribute("href").startsWith("#")) {
                return e;
            } else {
                LinkProvider.instance.openLink(e.target.getAttribute("href")!);
            }
        }
    }
}
</script>

<template>
    <p class="markdown-body" v-html="markdownToRender" @click.prevent="captureClick"></p>
</template>

<style lang="scss" scoped>
    @import '~modern-normalize/modern-normalize.css';
    @import "~github-markdown-css/github-markdown.css";

    .markdown-body {
        padding: 1rem;
        overflow-y: auto;
    }
</style>
