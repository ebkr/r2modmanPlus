<script lang="ts" setup>
import LinkProvider from '../../providers/components/LinkProvider';

// TODO - Rename `markdown` to `content`
interface MarkdownRenderProps {
    markdown: string;
}

const props = defineProps<MarkdownRenderProps>();

function capturePropagationParentLink(target: HTMLElement, originalEvent: Event) {
    if (target.tagName.toLowerCase() === "a") {
        const href = target.getAttribute("href") || "";
        if (!href.startsWith("#")) {
            originalEvent.preventDefault();
            LinkProvider.instance.openLink(target.getAttribute("href")!);
        }
    } else if (target.parentElement) {
        capturePropagationParentLink(target.parentElement, originalEvent);
    }
}

function captureClick(e: Event) {
    if (e.target && e.target instanceof HTMLElement) {
        capturePropagationParentLink(e.target, e);
    }
    return e;
}
</script>

<template>
    <p class="markdown-body" v-html="props.markdown" @click="captureClick"></p>
</template>

<style lang="scss">
    @import 'modern-normalize/modern-normalize.css';
    @import 'github-markdown-css/github-markdown.css';

    table th {
        color: inherit;
    }

    .markdown-body {
        color: var(--v2-primary-text-color);
        margin: 0 0px 0 auto;
        overflow-y: auto;
        height: max(200px, 100%);

        padding-right: 1rem;
        background-color: transparent;

        details {
            border-left: 5px solid var(--v2-primary-text-color);
            padding-left: 1rem;
        }

        table {

            tr:nth-child(odd) {
                background-color: var(--v2-table-row-background-color);
                color: var(--v2-table-row-text-color);
            }

            tr:nth-child(even) {
                background-color: var(--v2-table-row-alt-background-color);
                color: var(--v2-table-row-text-color);
            }

            th, td {
                border-color: var(--v2-table-row-border-color);
            }
        }

        pre {
            background-color: var(--v2-table-row-background-color);
            color: var(--v2-table-row-text-color);
            border: 1px solid var(--v2-table-row-border-color);
        }

        ul > li {
            list-style-type: disc;
        }

        ol > li {
            list-style: decimal;
        }
    }
</style>
