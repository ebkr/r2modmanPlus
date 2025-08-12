<template>
    <div class="split-pane" :class="[{'split-pane--with-active-second-pane': previewMod !== null}]">
        <div id="online-view">
            <div id="controls">
                <div class="inherit-background-colour non-selectable">
                    <div class="is-shadowless is-square">
                        <div class="no-padding-left card-header-title">
                            <div class="input-group input-group--flex margin-right">
                                <label for="thunderstore-search-filter">
                                    {{ t('translations.pages.manager.online.topbar.search.label') }}
                                </label>
                                <DeferredInput
                                    :modelValue="thunderstoreSearchFilter"
                                    @update:modelValue="$event => (thunderstoreSearchFilter = $event)"
                                    id="thunderstore-search-filter"
                                    class="input"
                                    type="text"
                                    :placeholder="t('translations.pages.manager.online.topbar.search.placeholder')"
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
                                        {{ t('translations.pages.manager.online.topbar.sort') }}
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
                                        {{ t('translations.pages.manager.online.topbar.filter') }}
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
                        {{ t('translations.pages.manager.online.navigation.changePageInfo') }}
                    </p>
                </div>
                <div class="in-mod-list" v-else-if="getPaginationSize() === 0">
                    <p class="notification margin-right">
                        {{ t(`translations.pages.manager.online.navigation.${thunderstoreModList.length ? 'noFoundMods' : 'noMods'}`) }}
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
import SortingDirection from '../../model/enums/SortingDirection';
import SortingStyle from '../../model/enums/SortingStyle';
import ManifestV2 from '../../model/ManifestV2';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import OnlineModListProvider from '../../providers/components/loaders/OnlineModListProvider';
import SearchUtils from '../../utils/SearchUtils';
import PaginationButtons from "../navigation/PaginationButtons.vue";
import { DeferredInput } from "../all";
import ModListUpdateBanner from "../ModListUpdateBanner.vue";
import OnlinePreviewPanel from '../v2/OnlinePreviewPanel.vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import { computed, ref, watch, onMounted, defineAsyncComponent } from 'vue';
import {useI18n} from "vue-i18n";

const store = getStore<State>();
const { t } = useI18n();

const PAGE_SIZE = 40;

const pagedThunderstoreModList = ref<ThunderstoreMod[]>([]);
const pageNumber = ref<number>(1);
const searchableThunderstoreModList = ref<ThunderstoreMod[]>([]);
const sortedThunderstoreModList = ref<ThunderstoreMod[]>([]);
const thunderstoreSearchFilter = ref<string>("");
const previewMod = ref<ThunderstoreMod | null>(null);

const OnlineModList = defineAsyncComponent(() => OnlineModListProvider.provider());

const localModList = computed<ManifestV2[]>(() => store.state.profile.modList);
const thunderstoreModList = computed<ThunderstoreMod[]>(() => store.state.tsMods.mods);

function getPaginationSize() {
    return Math.ceil(searchableThunderstoreModList.value.length / PAGE_SIZE);
}

function changePage() {
    pagedThunderstoreModList.value = searchableThunderstoreModList.value.slice(
        (pageNumber.value - 1) * PAGE_SIZE,
        pageNumber.value * PAGE_SIZE
    );
}

watch(pageNumber, changePage);

function filterThunderstoreModList() {
    const allowNsfw = store.state.modFilters.allowNsfw;
    const filterCategoriesToCompareOne = store.state.modFilters.selectedCategoriesCompareOne;
    const filterCategoriesToCompareAll = store.state.modFilters.selectedCategoriesCompareAll;
    const filterCategoriesToExclude = store.state.modFilters.selectedCategoriesToExclude;
    const showDeprecatedPackages = store.state.modFilters.showDeprecatedPackages;

    let searchableList = sortedThunderstoreModList.value;
    const searchKeys = SearchUtils.makeKeys(thunderstoreSearchFilter.value);
    if (searchKeys.length > 0) {
        searchableList = sortedThunderstoreModList.value.filter((x: ThunderstoreMod) => {
            return SearchUtils.isSearched(searchKeys, x.getFullName(), x.getDescription())
        });
    }
    if (!allowNsfw) {
        searchableList = searchableList.filter(mod => !mod.getNsfwFlag());
    }
    if (!showDeprecatedPackages) {
        searchableList = searchableList.filter(
            mod => !store.state.tsMods.deprecated.get(mod.getFullName())
        );
    }

    // Category filters
    if (filterCategoriesToExclude.length > 0) {
        searchableList = searchableList.filter((x: ThunderstoreMod) =>
            !filterCategoriesToExclude.some((category: string) => x.getCategories().includes(category)))
    }
    if (filterCategoriesToCompareOne.length > 0) {
        searchableList = searchableList.filter((x: ThunderstoreMod) =>
            filterCategoriesToCompareOne.some((category: string) => x.getCategories().includes(category)))
    }
    if (filterCategoriesToCompareAll.length > 0) {
        searchableList = searchableList.filter((x: ThunderstoreMod) =>
            filterCategoriesToCompareAll.every((category: string) => x.getCategories().includes(category)))
    }

    searchableThunderstoreModList.value = [...searchableList];

    // Update results
    changePage();
}

function sortThunderstoreModList() {
    const sortDescending = store.state.modFilters.sortDirection == SortingDirection.STANDARD;
    const sortedList = [...thunderstoreModList.value];
    sortedList.sort((a: ThunderstoreMod, b: ThunderstoreMod) => {
        let result: boolean;
        switch (store.state.modFilters.sortBehaviour) {
            case SortingStyle.LAST_UPDATED:
                result = a.getDateUpdated() < b.getDateUpdated();
                break;
            case SortingStyle.ALPHABETICAL:
                result = a.getName().localeCompare(b.getName()) > 0;
                break;
            case SortingStyle.DOWNLOADS:
                result = a.getDownloadCount() < b.getDownloadCount();
                break;
            case SortingStyle.RATING:
                result = a.getRating() < b.getRating();
                break;
            case SortingStyle.DEFAULT:
                result = true;
                break;
            default:
                result = true;
                break;
        }
        const sortOrder = result ? 1 : -1;
        return sortDescending ? sortOrder : -sortOrder;
    });
    sortedThunderstoreModList.value = sortedList;
    filterThunderstoreModList();
}

watch(thunderstoreSearchFilter, () => {
    pageNumber.value = 1;
    filterThunderstoreModList();
});

watch(() => [
    store.state.modFilters.allowNsfw,
    store.state.modFilters.selectedCategoriesCompareOne,
    store.state.modFilters.selectedCategoriesCompareAll,
    store.state.modFilters.selectedCategoriesToExclude,
    store.state.modFilters.showDeprecatedPackages,
], () => {
    filterThunderstoreModList();
});

watch(() => [
    store.state.modFilters.sortDirection,
    store.state.modFilters.sortBehaviour,
    thunderstoreModList.value,
], () => {
    sortThunderstoreModList();
})

function updatePageNumber(page: number) {
    pageNumber.value = page;
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto"
    });
}

function toggleModPreview(mod: ThunderstoreMod) {
    if (previewMod.value === mod) {
        previewMod.value = null;
    } else {
        previewMod.value = mod;
    }
}

onMounted(() => {
    sortThunderstoreModList();
});
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
