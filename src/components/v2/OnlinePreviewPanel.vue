<script lang="ts" setup>
import ThunderstoreMod from 'src/model/ThunderstoreMod';
import { ref, watch } from 'vue';
import GameManager from 'src/model/game/GameManager';
import MarkdownRender from 'components/v2/MarkdownRender.vue';
import { valueToReadableDate } from 'src/utils/DateUtils';

interface ModPreviewPanelProps {
    mod: ThunderstoreMod;
}

const activeGame = GameManager.activeGame;

const props = defineProps<ModPreviewPanelProps>();
let readme = ref<string | null>(null);

function fetchReadme(mod: ThunderstoreMod) {
    readme.value = null;
    fetch(`https://thunderstore.dev/api/experimental/package/${mod.getOwner()}/${mod.getName()}/${mod.getLatestVersion()}/readme/`)
        .then(res => {
            return res;
        })
        .then(res => res.json())
        .then(res => {
            console.log("README:", res)
            return res;
        })
        .then(res => readme.value = res.markdown);
}

fetchReadme(props.mod);
watch(() => props.mod, fetchReadme);

function getReadableDate(date: string): string {
    return valueToReadableDate(new Date(date));
}

function getReadableCategories(mod: ThunderstoreMod) {
    return mod.getCategories().join(", ");
}

</script>

<template>
    <div class="c-preview-panel">
        <div class="c-preview-panel__container">
            <h1 class="title">{{ mod.getName() }}</h1>
            <h2 class="subtitle">By {{ mod.getOwner() }}</h2>
            <p class='card-timestamp'><strong>Last updated:</strong> {{getReadableDate(mod.getDateUpdated())}}</p>
            <p class='card-timestamp'><strong>Categories:</strong> {{getReadableCategories(mod)}}</p>
            <div class="margin-top">
                <p class="description">{{ mod.getDescription() }}</p>
            </div>
            <div class="sticky-top inherit-background-colour sticky-top--no-shadow sticky-top--opaque no-margin sticky-top--no-padding">
                <div class="pad pad--top">
                    <button class="button is-info margin-right">Download</button>
                    <button class="button">Donate</button>
                </div>
                <div class="tabs margin-top">
                    <ul>
                        <li class="is-active"><a>README</a></li>
                        <li><a>CHANGELOG</a></li>
                        <li><a>Dependencies</a></li>
                    </ul>
                </div>
            </div>
            <template v-if="readme == null">
                <p>Loading README</p>
            </template>
            <template v-else-if="readme.trim().length === 0">
                <p>No README content</p>
            </template>
            <template v-else>
                <MarkdownRender :markdown="readme" />
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.c-preview-panel {
    position: sticky;
    top: 0;
    width: min(50vw, 600px);
    height: calc(100vh - 0.75rem);
    overflow-y: auto;

    &__container {
        margin: 1rem;
        padding: 1rem;
    }
}
</style>
