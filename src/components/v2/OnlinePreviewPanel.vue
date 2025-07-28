<script lang="ts" setup>
import ThunderstoreMod from '../../model/ThunderstoreMod';
import { computed, ref, watch, watchEffect } from 'vue';
import MarkdownRender from './MarkdownRender.vue';
import { valueToReadableDate } from '../../utils/DateUtils';
import OnlineModList from '../views/OnlineModList.vue';
import useStore from '../../store';
import { getCombosByDependencyStrings } from '../../r2mm/manager/PackageDexieStore';
import { ExternalLink } from '../all';
import R2Error from '../../model/errors/R2Error';
import { getFullDependencyList, InstallMode } from '../../utils/DependencyUtils';
import debounce from 'lodash.debounce';

const store = useStore();

interface ModPreviewPanelProps {
    mod: ThunderstoreMod;
}

const props = defineProps<ModPreviewPanelProps>();
const emits = defineEmits<{
    (e: 'close'): void
}>();

const readme = ref<string | null>(null);
const readmeError = ref<R2Error | null>(null);
const changelog = ref<string | null>(null);
const changelogError = ref<R2Error | null>(null);
const activeTab = ref<"README" | "CHANGELOG" | "Dependencies">("README");
const loadingPanel = ref<boolean>(true);
const dependencies = ref<ThunderstoreMod[]>([]);

const maxPanelWidth = ref(getMaxPanelWidth());

function getMaxPanelWidth(): number {
    return window.outerWidth - document.getElementsByClassName("nav-column")[0].scrollWidth;
}

function setActiveTab(tab: "README" | "CHANGELOG" | "Dependencies") {
    activeTab.value = tab;
}

function fetchDataFor(mod: ThunderstoreMod, type: "readme" | "changelog"): Promise<string> {
    return fetch(`https://thunderstore.io/api/cyberstorm/package/${mod.getOwner()}/${mod.getName()}/latest/${type}/`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`No ${type} available for ${mod.getName()}`)
            }
            return res.json();
        })
        .then(res => res.html);
}

function fetchReadme(modToLoad: ThunderstoreMod) {
    // TODO - Make sure that this is null on fetch failure.
    readmeError.value = null;
    readme.value = null;
    return fetchDataFor(props.mod, "readme").then(res => {
        if (props.mod === modToLoad) {
            if (res && res.trim().length > 0) {
                readme.value = res;
            } else {
                readme.value = null;
            }
        }
    }).catch(e => {
        if (props.mod === modToLoad) {
            readmeError.value = e;
        }
    });
}

function fetchChangelog(modToLoad: ThunderstoreMod) {
    changelogError.value = null;
    changelog.value = null;
    return fetchDataFor(props.mod, "changelog").then(res => {
        if (props.mod === modToLoad) {
            if (res && res.trim().length > 0) {
                changelog.value = res;
            } else {
                changelog.value = null;
            }
        }
    }).catch(e => {
        if (props.mod === modToLoad) {
            changelogError.value = e;
        }
    });
}

function fetchAll(modToLoad: ThunderstoreMod) {
    setActiveTab("README");
    loadingPanel.value = true;

    fetchReadme(modToLoad)
        .then(() => {
            if (props.mod === modToLoad) {
                loadingPanel.value = false;
            }
        });

    buildDependencies(modToLoad).then(value => dependencies.value = value);
    fetchChangelog(modToLoad);
}

async function buildDependencies(mod: ThunderstoreMod) {
    const modCombo = await getCombosByDependencyStrings(
        store.state.activeGame,
        [mod.getLatestDependencyString()]
    );
    const modAndDependencies = await getFullDependencyList(
        modCombo,
        store.state.activeGame,
        [],
        InstallMode.INSTALL_SPECIFIC
    );
    return modAndDependencies
        .filter(value => value.getMod().getFullName() !== mod.getFullName())
        .map(value => value.getMod());
}

fetchAll(props.mod);
watch(() => props.mod, (newValue) => {
    fetchAll(newValue);
});

function getReadableDate(date: string): string {
    return valueToReadableDate(new Date(date));
}

function getReadableCategories(mod: ThunderstoreMod) {
    return mod.getCategories().join(", ") || "None";
}

const markdownToRender = computed(() => {
    switch (activeTab.value) {
        case "README": return readme.value;
        case 'CHANGELOG': return changelog.value;
        default: return null;
    }
});

function showDownloadModal(mod: ThunderstoreMod) {
    store.commit("openDownloadModVersionSelectModal", mod);
}


const previewPanelWidth = ref(500);
watchEffect(() => {
    const varWidth = previewPanelWidth.value;
    const root = document.querySelector(':root')!;
    root.style.setProperty('--preview-panel-width', varWidth);
    maxPanelWidth.value = getMaxPanelWidth();
});

const resizeDebounce = debounce((event: DragEvent) => {
    // Require conditional as on-release this is reset.
    if (event.clientX > 0) {
        previewPanelWidth.value = window.innerWidth - event.clientX;
    }
}, 1);

function dragStart(event: DragEvent) {
    event.target.style.opacity = 0;
}

function dragEnd(event: DragEvent) {
    event.target.style.opacity = 1;
}

</script>

<template>
    <div class="c-panel-window">
        <div class="c-drag-pane" @drag.prevent.stop="resizeDebounce" @dragstart="dragStart" @dragend="dragEnd" draggable="true">
            <i class="fas fa-grip-lines-vertical drag-item"></i>
        </div>
        <div class="c-preview-panel" :style="`width: calc(${previewPanelWidth}px - 2.5rem + 5px); max-width: ${maxPanelWidth}px`">
            <div class="c-preview-panel__header">
                <button class="close-button button" @click="() => emits('close')">
                <i class="fas fa-times"/>
            </button>
            <h1 class="title">
                {{ mod.getName() }}
            </h1>
                <h2 class="subtitle">
                    By {{ mod.getOwner() }}
                </h2>
                <div class="margin-top margin-bottom">
                    <p class="description">{{ mod.getDescription() }}</p>
                </div>
                <p class='card-timestamp'><strong>Downloads:</strong> {{mod.getDownloadCount()}}</p>
                <p class='card-timestamp'><strong>Likes:</strong> {{mod.getRating()}}</p>
                <p class='card-timestamp'><strong>Last updated:</strong> {{getReadableDate(mod.getDateUpdated())}}</p>
                <p class='card-timestamp'><strong>Categories:</strong> {{getReadableCategories(mod)}}</p>
            </div>
            <div class="sticky-top inherit-background-colour sticky-top--no-shadow sticky-top--opaque no-margin sticky-top--no-padding">
                <div class="button-group">
                    <button class="button is-info" @click="showDownloadModal(mod)">Download</button>
                    <ExternalLink tag="button" class="button" :url="props.mod.getPackageUrl()">View online</ExternalLink>
                    <ExternalLink v-if="props.mod.getDonationLink()" tag="button" class="button" :url="props.mod.getDonationLink()">Donate</ExternalLink>
                </div>
                <div class="tabs margin-top">
                    <ul>
                        <li :class="{'is-active': activeTab === 'README'}"><a @click="setActiveTab('README')">README</a></li>
                        <li :class="{'is-active': activeTab === 'CHANGELOG'}"><a @click="setActiveTab('CHANGELOG')">CHANGELOG</a></li>
                        <li :class="{'is-active': activeTab === 'Dependencies'}"><a @click="setActiveTab('Dependencies')">Dependencies ({{ dependencies.length }})</a></li>
                    </ul>
                </div>
            </div>
            <div class="c-preview-panel__content">
                <template v-if="loadingPanel">
                    <div class="notification">
                        <div class="container">
                            <p>Fetching {{ activeTab }} for {{ props.mod.getFullName() }}</p>
                        </div>
                    </div>
                </template>
                <template v-else-if="activeTab === 'Dependencies'">
                    <template v-if="dependencies.length > 0">
                        <OnlineModList :paged-mod-list="dependencies" :read-only="true" />
                    </template>
                    <template v-else>
                        <div class="notification">
                            <div class="container">
                                <p>{{ props.mod.getName() }} has no dependencies</p>
                            </div>
                        </div>
                    </template>
                </template>
                <template v-else-if="activeTab === 'README'">
                    <template v-if="readmeError !== null">
                        <div class="notification is-danger">
                            <h2 class="title is-6">Unable to fetch README for {{ props.mod.getFullName() }}</h2>
                            <p>{{ readmeError.message }}</p>
                        </div>
                    </template>
                    <template v-else-if="markdownToRender !== null">
                        <MarkdownRender :markdown="markdownToRender" />
                    </template>
                </template>
                <template v-else-if="activeTab === 'CHANGELOG'">
                    <template v-if="changelogError !== null">
                        <div class="notification is-danger">
                            <h2 class="title is-6">Unable to fetch CHANGELOG for {{ props.mod.getFullName() }}</h2>
                            <p>{{ changelogError.message }}</p>
                        </div>
                    </template>
                    <template v-else-if="markdownToRender !== null">
                        <MarkdownRender :markdown="markdownToRender" />
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.c-panel-window {
    display: flex;
    flex-direction: row;
    max-width: 80vw;
}

.c-drag-pane {
    height: 100%;
    background-color: transparent;
    cursor: col-resize;
    display: flex;
    align-items: center;
    padding-left: 1rem;
    user-select: none !important;
}

.c-drag-pane:active {
    cursor: none;
}

.c-preview-panel {
    height: calc(100vh - 2.75rem);
    display: flex;
    flex-flow: column;
    margin: 1rem;
    color: var(--v2-primary-text-color);
    min-width: 350px;

    &__container {
        flex: 0;
    }

    &__content {
        flex: 1;
        padding: 1rem;
        display: block;
        height: max-content;
        overflow-y: auto;
        overflow-x: hidden;
        max-width: 100%;
    }
}

.button-group {
    padding-top: 1rem;
    display: flex;
    flex-grow: 0;
    gap: 0.5rem;
}

.close-button {
    float: right;
}
</style>
