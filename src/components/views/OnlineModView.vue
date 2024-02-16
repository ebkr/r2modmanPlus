<template>
    <div>
        <div class="inherit-background-colour sticky-top sticky-top--search non-selectable">
            <div class="is-shadowless is-square">
                <div class="no-padding-left card-header-title">
                    <div class="input-group input-group--flex margin-right">
                        <label for="thunderstore-search-filter">Search</label>
                        <DeferredInput
                            v-model="thunderstoreSearchFilter"
                            id="thunderstore-search-filter"
                            class="input"
                            type="text"
                            placeholder="Search for a mod"
                        />
                    </div>
                    <div class="input-group margin-right">
                        <label for="thunderstore-sort">Sort</label>
                        <div class="sort-container"> <!-- This div wraps the selector and the icon -->
                            <select v-model="sortingStyleModel"
                                    id="thunderstore-sort"
                                    class="select select--content-spacing margin-right--half-width"
                                    @change="sortThunderstoreModList"
                            >
                                <option v-for="(key) in getSortOptions()" :key="key">{{ key }}</option>
                            </select>
                            <div class="icon-container"> <!-- New div to center the icon vertically -->
                                <i :class="['fas', 'fa-caret-up', 'sorting-icon', { 'rotated': sortingDirectionModel === 'REVERSE' }]"
                                @click="toggleSortingDirection"
                                class="icon--margin-right"
                                :style="{ cursor: sortingStyleModel !== 'Default' ? 'pointer' : 'not-allowed' }"
                                ></i>
                            </div>
                        </div>
                    </div>
                    <div class="input-group category-filter-container">
                        <label for="thunderstore-category-filter">Filters</label>
                        <button
                            id="thunderstore-category-filter"
                            class="button category-filter"
                            @click="$store.commit('openCategoryFilterModal')"
                        >
                            <i class="fas fa-filter" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <OnlineModList
            :local-mod-list="localModList"
            :paged-mod-list="pagedThunderstoreModList"
            @error="$emit('error', $event)"
        />
        <div class="in-mod-list" v-if="getPaginationSize() > 1">
            <p class="notification margin-right">
                Use the numbers below to change page
            </p>
        </div>
        <div class="in-mod-list" v-else-if="getPaginationSize() === 0">
            <p class="notification margin-right">
                No mods with that name found
            </p>
        </div>
        <br/>
        <PaginationButtons
            :current-page="pageNumber"
            :page-count="getPaginationSize()"
            :context-size="3"
            :on-click="updatePageNumber"
        />
    </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Vue, Watch } from 'vue-property-decorator';

import CategoryFilterMode from '../../model/enums/CategoryFilterMode';
import SortingDirection from '../../model/enums/SortingDirection';
import SortingStyle from '../../model/enums/SortingStyle';
import ManifestV2 from '../../model/ManifestV2';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import OnlineModListProvider from '../../providers/components/loaders/OnlineModListProvider';
import ArrayUtils from '../../utils/ArrayUtils';
import SearchUtils from '../../utils/SearchUtils';
import PaginationButtons from "../navigation/PaginationButtons.vue";
import { DeferredInput } from "../all";

@Component({
    components: {
        DeferredInput,
        OnlineModList: OnlineModListProvider.provider,
        PaginationButtons,
    }
})

export default class OnlineModView extends Vue {
    readonly pageSize = 40;
    pagedThunderstoreModList: ThunderstoreMod[] = [];
    pageNumber = 1;
    searchableThunderstoreModList: ThunderstoreMod[] = [];
    sortedThunderstoreModList: ThunderstoreMod[] = [];
    sortingDirectionModel = SortingDirection.STANDARD;
    sortingStyleModel = SortingStyle.DEFAULT;
    thunderstoreSearchFilter = "";

    get localModList(): ManifestV2[] {
        return this.$store.state.localModList;
    }

    get thunderstoreModList(): ThunderstoreMod[] {
        return this.$store.state.thunderstoreModList;
    }

    getPaginationSize() {
        return Math.ceil(this.searchableThunderstoreModList.length / this.pageSize);
    }

    getSortDirections() {
        return Object.values(SortingDirection);
    }

    getSortOptions() {
        return Object.values(SortingStyle);
    }

    @Watch("pageNumber")
    changePage() {
        this.pagedThunderstoreModList = this.searchableThunderstoreModList.slice(
            (this.pageNumber - 1) * this.pageSize,
            this.pageNumber * this.pageSize
        );
    }

    @Watch("thunderstoreSearchFilter")
    performThunderstoreFilterUpdate() {
        this.pageNumber = 1;
        this.filterThunderstoreModList();
    }

    @Watch('sortingDirectionModel')
    onSortingDirectionChanged(newVal: string, oldVal: string) {
        if (newVal !== oldVal && this.sortingStyleModel !== 'Default') {
            this.sortThunderstoreModList();
        }
    }

    @Watch("$store.state.modFilters.allowNsfw")
    @Watch("$store.state.modFilters.categoryFilterMode")
    @Watch("$store.state.modFilters.selectedCategories")
    @Watch("$store.state.modFilters.showDeprecatedPackages")
    filterThunderstoreModList() {
        const allowNsfw = this.$store.state.modFilters.allowNsfw;
        const categoryFilterMode = this.$store.state.modFilters.categoryFilterMode;
        const filterCategories = this.$store.state.modFilters.selectedCategories;
        const showDeprecatedPackages = this.$store.state.modFilters.showDeprecatedPackages;

        this.searchableThunderstoreModList = this.sortedThunderstoreModList;
        const searchKeys = SearchUtils.makeKeys(this.thunderstoreSearchFilter);
        if (searchKeys.length > 0) {
            this.searchableThunderstoreModList = this.sortedThunderstoreModList.filter((x: ThunderstoreMod) => {
                return SearchUtils.isSearched(searchKeys, x.getFullName(), x.getVersions()[0].getDescription())
            });
        }
        if (!allowNsfw) {
            this.searchableThunderstoreModList = this.searchableThunderstoreModList.filter(mod => !mod.getNsfwFlag());
        }
        if (!showDeprecatedPackages) {
            this.searchableThunderstoreModList = this.searchableThunderstoreModList.filter(mod => !mod.isDeprecated());
        }
        if (filterCategories.length > 0) {
            this.searchableThunderstoreModList = this.searchableThunderstoreModList.filter((x: ThunderstoreMod) => {
                switch(categoryFilterMode) {
                    case CategoryFilterMode.OR:
                        return ArrayUtils.includesSome(x.getCategories(), filterCategories);
                    case CategoryFilterMode.AND:
                        return ArrayUtils.includesAll(x.getCategories(), filterCategories);
                    case CategoryFilterMode.EXCLUDE:
                        return !ArrayUtils.includesSome(x.getCategories(), filterCategories);
                }
            })
        }
        this.changePage();
    }

    @Watch("sortingDirectionModel")
    @Watch("sortingStyleModel")
    @Watch("thunderstoreModList")
    sortThunderstoreModList() {
        const sortAscending = this.sortingDirectionModel !== 'STANDARD';
        const sortedList = [...this.thunderstoreModList];
        sortedList.sort((a: ThunderstoreMod, b: ThunderstoreMod) => {
            // Initialize result with a default value
            let result = 0;

            switch (this.sortingStyleModel) {
                case SortingStyle.LAST_UPDATED:
                    // Make sure you have Date objects before calling getTime
                    const dateA = a.getDateUpdated() instanceof Date ? a.getDateUpdated() : new Date(a.getDateUpdated());
                    const dateB = b.getDateUpdated() instanceof Date ? b.getDateUpdated() : new Date(b.getDateUpdated());
                    result = (sortAscending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime());
                    break;
                case SortingStyle.DOWNLOADS:
                    // Make sure you have numbers before comparing
                    const downloadsA = Number(a.getDownloadCount());
                    const downloadsB = Number(b.getDownloadCount());
                    result = (sortAscending ? downloadsA - downloadsB : downloadsB - downloadsA);
                    break;
                case SortingStyle.RATING:
                    // Make sure you have numbers before comparing
                    const ratingA = Number(a.getRating());
                    const ratingB = Number(b.getRating());
                    result = (sortAscending ? ratingA - ratingB : ratingB - ratingA);
                    break;
                case SortingStyle.ALPHABETICAL:
                    result = a.getName().localeCompare(b.getName()) * (sortAscending ? -1 : 1);
                    break;
                // No need for a default case if all cases are covered
            }

            return result;
        });

        this.sortedThunderstoreModList = sortedList;
        this.filterThunderstoreModList();
    }

    updatePageNumber(page: number) {
        this.pageNumber = page;
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto"
        });
    }

    async created() {
        this.sortingDirectionModel = 'STANDARD'; // Ensuring the default sort is standard when component is created
        this.sortThunderstoreModList();
    }

    toggleSortingDirection() {
    if (this.sortingStyleModel !== 'Default') {
        this.sortingDirectionModel = this.sortingDirectionModel === 'STANDARD' ? 'REVERSE' : 'STANDARD';
        // Adding a key to force Vue to re-render the icon
        this.$forceUpdate(); // This will force the entire component to update, which can be helpful if Vue is not reactive enough
        this.sortThunderstoreModList();
    }
    }
};
</script>
