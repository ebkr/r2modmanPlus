<template>
    <div>
        <div class="inherit-background-colour sticky-top sticky-top--search non-selectable">
            <div class="is-shadowless is-square">
                <div class="no-padding-left card-header-title">
                    <div class="input-group input-group--flex margin-right">
                        <label for="thunderstore-search-filter">Search</label>
                        <input
                            v-model="thunderstoreSearchFilter"
                            id="thunderstore-search-filter"
                            class="input"
                            type="text"
                            placeholder="Search for a mod"
                        />
                    </div>
                    <div class="input-group margin-right">
                        <label for="thunderstore-sort">Sort</label>
                        <select v-model="sortingStyleModel"
                                id="thunderstore-sort"
                                class="select select--content-spacing margin-right margin-right--half-width"
                        >
                            <option v-for="(key) in getSortOptions()" v-bind:key="key">{{key}}</option>
                        </select>
                        <select v-model="sortingDirectionModel"
                                class="select select--content-spacing"
                                :disabled="sortingStyleModel === 'Default'"
                        >
                            <option v-for="(key) in getSortDirections()" v-bind:key="key">{{key}}</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <div class="input-group input-group--flex">
                            <label for="thunderstore-category-filter">Additional filters</label>
                            <button
                                id="thunderstore-category-filter"
                                class="button"
                                @click="$store.commit('openCategoryFilterModal')"
                            >
                                Edit filters
                            </button>
                        </div>
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
                No mods matching search criteria found
            </p>
        </div>
        <br/>
        <div class="pagination">
            <div class="smaller-font">
                <a v-for="index in getPaginationSize()" :key="`pagination-${index}`"
                    :class="['pagination-link', {'is-current': index === pageNumber}]"
                    @click="updatePageNumber(index)">
                    {{index}}
                </a>
            </div>
        </div>
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
import debounce from 'lodash.debounce';
import SearchUtils from '../../utils/SearchUtils';

@Component({
    components: {
        OnlineModList: OnlineModListProvider.provider,
    }
})

export default class OnlineModView extends Vue {
    readonly pageSize = 140;
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
    onThunderstoreFilterUpdate = debounce(this.performThunderstoreFilterUpdate, 150);

    performThunderstoreFilterUpdate() {
        this.pageNumber = 1;
        this.filterThunderstoreModList();
    }

    @Watch("$store.state.modFilters.allowNsfw")
    @Watch("$store.state.modFilters.filterDateCreatedFrom")
    @Watch("$store.state.modFilters.filterDateCreatedTo")
    @Watch("$store.state.modFilters.filterDateUpdatedFrom")
    @Watch("$store.state.modFilters.filterDateUpdatedTo")
    @Watch("$store.state.modFilters.categoryFilterMode")
    @Watch("$store.state.modFilters.selectedCategories")
    @Watch("$store.state.modFilters.showDeprecatedPackages")
    filterThunderstoreModList() {
        const filterDateCreatedFrom = this.$store.state.modFilters.filterDateCreatedFrom;
        const filterDateCreatedTo = this.$store.state.modFilters.filterDateCreatedTo;
        const filterDateUpdatedFrom = this.$store.state.modFilters.filterDateUpdatedFrom;
        const filterDateUpdatedTo = this.$store.state.modFilters.filterDateUpdatedTo;
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
        if (filterDateCreatedFrom) {
            this.searchableThunderstoreModList = this.searchableThunderstoreModList.filter((mod: ThunderstoreMod) => ((filterDateCreatedFrom.getTime() <= mod.getDateCreatedUnix())))
        }
        if (filterDateCreatedTo) {
            this.searchableThunderstoreModList = this.searchableThunderstoreModList.filter((mod: ThunderstoreMod) => ((filterDateCreatedTo.getTime() >= mod.getDateCreatedUnix())))
        }
        if (filterDateUpdatedFrom) {
            this.searchableThunderstoreModList = this.searchableThunderstoreModList.filter((mod: ThunderstoreMod) => ((filterDateUpdatedFrom.getTime() <= mod.getDateUpdatedUnix())))
        }
        if (filterDateUpdatedTo) {
            this.searchableThunderstoreModList = this.searchableThunderstoreModList.filter((mod: ThunderstoreMod) => ((filterDateUpdatedTo.getTime() >= mod.getDateUpdatedUnix())))
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
        const sortDescending = this.sortingDirectionModel == SortingDirection.STANDARD;
        const sortedList = [...this.thunderstoreModList];
        sortedList.sort((a: ThunderstoreMod, b: ThunderstoreMod) => {
            let result: boolean;
            switch (this.sortingStyleModel) {
                case SortingStyle.LAST_UPDATED:
                    result = sortDescending ? a.getDateUpdated() < b.getDateUpdated() : a.getDateUpdated() > b.getDateUpdated();
                    break;
                case SortingStyle.ALPHABETICAL:
                    result = sortDescending ? a.getName().localeCompare(b.getName()) > 0 : a.getName().localeCompare(b.getName()) < 0;
                    break;
                case SortingStyle.DOWNLOADS:
                    result = sortDescending ? a.getDownloadCount() < b.getDownloadCount() : a.getDownloadCount() > b.getDownloadCount();
                    break;
                case SortingStyle.RATING:
                    result = sortDescending ? a.getRating() < b.getRating() : a.getRating() > b.getRating();
                    break;
                case SortingStyle.DEFAULT:
                    result = true;
                    break;
                default:
                    result = true;
                    break;
            }
            return result ? 1 : -1;
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
        this.sortThunderstoreModList();
    }
};
</script>
