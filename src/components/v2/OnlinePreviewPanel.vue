<script lang="ts" setup>
import ThunderstoreMod from '../../model/ThunderstoreMod';
import { computed, ref, watch } from 'vue';
import MarkdownRender from './MarkdownRender.vue';
import { valueToReadableDate } from '../../utils/DateUtils';
import OnlineModList from '../views/OnlineModList.vue';
import useStore from '../../store';
import { getCombosByDependencyStrings } from '../../r2mm/manager/PackageDexieStore';
import { ExternalLink } from '../all';
import R2Error from '../../model/errors/R2Error';
import { getFullDependencyList, InstallMode } from '../../utils/DependencyUtils';

const store = useStore();

interface ModPreviewPanelProps {
    mod: ThunderstoreMod;
}

const props = defineProps<ModPreviewPanelProps>();
const readme = ref<string | null>(null);
const readmeError = ref<R2Error | null>(null);
const changelog = ref<string | null>(null);
const changelogError = ref<R2Error | null>(null);
const activeTab = ref<"README" | "CHANGELOG" | "Dependencies">("README");
const loadingPanel = ref<boolean>(true);
const dependencies = ref<ThunderstoreMod[]>([]);

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

</script>

<template>
    <div class="c-preview-panel">
        <div class="c-preview-panel__header">
            <h1 class="title">{{ mod.getName() }}</h1>
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
</template>

<style lang="scss" scoped>
.c-preview-panel {
    height: calc(100vh - 2.75rem);
    display: flex;
    flex-flow: column;
    margin: 1rem;
    width: 500px;
    color: var(--v2-primary-text-color);

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
    }
}

.button-group {
    padding-top: 1rem;
    display: flex;
    flex-grow: 0;
    gap: 0.5rem;
}
</style>
