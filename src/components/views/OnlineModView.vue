<template>
    <div class="split-pane" :class="[{'split-pane--with-active-second-pane': previewMod !== null}]">
        <div id="online-view">
            <div id="controls">
                <div class="inherit-background-colour non-selectable">
                    <div class="is-shadowless is-square">
                        <div class="no-padding-left card-header-title">
                            <div class="input-group input-group--flex margin-right">
                                <label for="thunderstore-search-filter">Search</label>
                                <DeferredInput
                                    :modelValue="searchFilter"
                                    @update:modelValue="$event => (searchFilter = $event)"
                                    id="thunderstore-search-filter"
                                    class="input"
                                    type="text"
                                    placeholder="Search"
                                    autocomplete="off"
                                />
                            </div>
                            <div class="input-group">
                                <div class="input-group input-group--flex">
                                    <label for="thunderstore-category-filter">&nbsp;</label>
                                    <button
                                        id="thunderstore-category-filter"
                                        class="button"
                                        @click="store.commit('openOnlineSortModal')"
                                    >
                                        Sort
                                    </button>
                                </div>
                            </div>
                            &nbsp;
                            <div class="input-group">
                                <div class="input-group input-group--flex">
                                    <label for="thunderstore-category-filter">&nbsp;</label>
                                    <button
                                        id="thunderstore-category-filter"
                                        class="button"
                                        @click="store.commit('openCategoryFilterModal')"
                                    >
                                        Filter
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="view-content">
                <ModListUpdateBanner />
                <OnlineModList
                    :local-mod-list="localModList"
                    :paged-mod-list="pagedThunderstoreModList"
                    :selected-mod="previewMod"
                    @selected-mod="toggleModPreview"
                    :read-only="false"
                />
                <div class="in-mod-list" v-if="getPaginationSize() > 1">
                    <p class="notification margin-right">
                        Use the numbers below to change page
                    </p>
                </div>
                <div class="in-mod-list" v-else-if="getPaginationSize() === 0">
                    <p class="notification margin-right">
                        {{store.state.tsMods.mods.length ? "No mods matching search found": "No mods available"}}
                    </p>
                </div>
            </div>
            <div id="pagination">
                <PaginationButtons
                    :current-page="pageNumber"
                    :page-count="getPaginationSize()"
                    :context-size="3"
                    :on-click="updatePageNumber"
                />
            </div>
        </div>
        <div id="mod-preview">
            <template v-if="previewMod !== null">
                <OnlinePreviewPanel :mod="previewMod" @close="() => previewMod = null"/>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import ManifestV2 from '../../model/ManifestV2';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import OnlineModListProvider from '../../providers/components/loaders/OnlineModListProvider';
import PaginationButtons from "../navigation/PaginationButtons.vue";
import { DeferredInput } from "../all";
import ModListUpdateBanner from "../ModListUpdateBanner.vue";
import OnlinePreviewPanel from '../v2/OnlinePreviewPanel.vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import { computed, ref, watch, onMounted, defineAsyncComponent } from 'vue';
import { useModFilters } from '../composables/ModFiltersComposable';

const store = getStore<State>();
const { filteredMods, searchFilter } = useModFilters();

const PAGE_SIZE = 40;

const pagedThunderstoreModList = ref<ThunderstoreMod[]>([]);
const pageNumber = ref<number>(1);
const previewMod = ref<ThunderstoreMod | null>(null);

const OnlineModList = defineAsyncComponent(() => OnlineModListProvider.provider());

const localModList = computed<ManifestV2[]>(() => store.state.profile.modList);

function getPaginationSize() {
    return Math.ceil(filteredMods.value.length / PAGE_SIZE);
}

function changePage() {
    pagedThunderstoreModList.value = filteredMods.value.slice(
        (pageNumber.value - 1) * PAGE_SIZE,
        pageNumber.value * PAGE_SIZE
    );
}

watch(pageNumber, changePage);

watch(searchFilter, () => {
    pageNumber.value = 1;
});

watch(filteredMods, changePage);

onMounted(changePage);

function updatePageNumber(page: number) {
    pageNumber.value = page;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function toggleModPreview(mod: ThunderstoreMod) {
    if (previewMod.value === mod) {
        previewMod.value = null;
    } else {
        previewMod.value = mod;
    }
}
</script>

<style lang="scss" scoped>
#online-view {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-x: hidden;

    #controls {
        flex: 0;
    }

    #pagination {
        flex: 0;
    }

    #view-content {
        flex-grow: 1;
        overflow-y: auto;
        padding-right: 1rem;
        height: 100%;
    }
}

#mod-preview {
    flex: 0;
    display: none;
}

.split-pane {
    display: flex;
    overflow-y: hidden;
    max-height: 100%;
    width: 100%;
    flex: 1;

    &--with-active-second-pane {
        #mod-preview {
            display: flex;
            flex: 0;
        }
    }
}
</style>
