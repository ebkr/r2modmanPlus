import { ref, watch } from 'vue';

import { SortDirection } from '../../model/real_enums/sort/SortDirection';
import SortingStyle from '../../model/enums/SortingStyle';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import SearchUtils, { ExactSearchMatchRank } from '../../utils/SearchUtils';

const store = getStore<State>();

const searchFilter = ref('');
const sortedMods = ref<ThunderstoreMod[]>([]);
const filteredMods = ref<ThunderstoreMod[]>([]);
const filteredModCount = ref(0);

function runFilter() {
    let result = sortedMods.value as ThunderstoreMod[];

    const searchKeys = SearchUtils.makeKeys(searchFilter.value);
    if (searchKeys.length > 0) {
        result = result.filter(x => SearchUtils.isSearched(searchKeys, x.getFullName(), x.getDescription()));
    }

    if (!store.state.modFilters.allowNsfw) {
        result = result.filter(mod => !mod.getNsfwFlag());
    }

    if (!store.state.modFilters.showDeprecatedPackages) {
        result = result.filter(mod => !store.state.tsMods.deprecated.get(mod.getFullName()));
    }

    const filterExclude = store.state.modFilters.selectedCategoriesToExclude;
    const filterOne = store.state.modFilters.selectedCategoriesCompareOne;
    const filterAll = store.state.modFilters.selectedCategoriesCompareAll;

    if (filterExclude.length > 0) {
        result = result.filter(x => !filterExclude.some(c => x.getCategories().includes(c)));
    }
    if (filterOne.length > 0) {
        result = result.filter(x => filterOne.some(c => x.getCategories().includes(c)));
    }
    if (filterAll.length > 0) {
        result = result.filter(x => filterAll.every(c => x.getCategories().includes(c)));
    }

    if (store.state.modFilters.sortBehaviour === SortingStyle.RELEVANCE) {
        result = bumpExactMatches(result, searchFilter.value.trim().toLowerCase());
    }

    filteredMods.value = result;
    filteredModCount.value = result.length;
}

function bumpExactMatches(mods: ThunderstoreMod[], query: string): ThunderstoreMod[] {
    if (query.length === 0) {
        return mods;
    }

    const nameMatches: ThunderstoreMod[] = [];
    const authorMatches: ThunderstoreMod[] = [];
    const others: ThunderstoreMod[] = [];

    for (const mod of mods) {
        const rank = SearchUtils.getExactMatchRank(query, mod.getName(), mod.getFullName(), mod.getOwner());
        switch (rank) {
            case ExactSearchMatchRank.NAME:
                nameMatches.push(mod);
                break;
            case ExactSearchMatchRank.AUTHOR:
                authorMatches.push(mod);
                break;
            default:
                others.push(mod);
                break;
        }
    }

    if (nameMatches.length === 0 && authorMatches.length === 0) {
        return mods;
    }
    return [...nameMatches, ...authorMatches, ...others];
}

function runSort() {
    const sortDescending = store.state.modFilters.sortDirection === SortDirection.STANDARD;
    const sorted = [...store.state.tsMods.mods];
    sorted.sort((a, b) => {
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
            case SortingStyle.RELEVANCE:
                result = true;
                break;
        }
        const sortOrder = result ? 1 : -1;
        return sortDescending ? sortOrder : -sortOrder;
    });
    sortedMods.value = sorted;
    runFilter();
}

watch([
        () => store.state.modFilters.sortDirection,
        () => store.state.modFilters.sortBehaviour,
        () => store.state.tsMods.mods,
    ],
    runSort,
    { immediate: true }
);

watch([
        () => store.state.modFilters.allowNsfw,
        () => store.state.modFilters.selectedCategoriesCompareOne,
        () => store.state.modFilters.selectedCategoriesCompareAll,
        () => store.state.modFilters.selectedCategoriesToExclude,
        () => store.state.modFilters.showDeprecatedPackages,
        searchFilter,
    ],
    runFilter
);

function selectCategoryToCompareOne(event: Event) {
    if (!(event.target instanceof HTMLSelectElement)) return;
    store.commit("modFilters/selectCategoryToCompareOne", event.target.value);
    event.target.selectedIndex = 0;
}

function selectCategoryToCompareAll(event: Event) {
    if (!(event.target instanceof HTMLSelectElement)) return;
    store.commit("modFilters/selectCategoryToCompareAll", event.target.value);
    event.target.selectedIndex = 0;
}

function selectCategoryToExclude(event: Event) {
    if (!(event.target instanceof HTMLSelectElement)) return;
    store.commit("modFilters/selectCategoryToExclude", event.target.value);
    event.target.selectedIndex = 0;
}

function unselectCategory(category: string) {
    store.commit("modFilters/unselectCategory", category);
}

function resetFilter() {
    searchFilter.value = '';
}

export function useModFiltersComposable() {
    return {
        searchFilter,
        filteredMods,
        filteredModCount,
        selectCategoryToCompareOne,
        selectCategoryToCompareAll,
        selectCategoryToExclude,
        unselectCategory,
        resetFilter,
    };
}
