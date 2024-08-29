<template>
    <div>
        <div class="inherit-background-colour sticky-top sticky-top--search non-selectable">
            <div class="is-shadowless is-square">
                <div class="page-padding card-header-title">
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
                                Filter categories
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <OnlineModList
            :local-mod-list="localModList"
            :paged-mod-list="pagedThunderstoreModList"
        />
        <div class="in-mod-list" v-if="getPaginationSize() > 1">
            <p class="notification">
                Use the numbers below to change page
            </p>
        </div>
        <div class="in-mod-list" v-else-if="getPaginationSize() === 0">
            <p class="notification">
                {{thunderstoreModList.length ? "No mods matching search found": "No mods available"}}
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
import SortingDirection from '../../model/enums/SortingDirection';
import SortingStyle from '../../model/enums/SortingStyle';
import ManifestV2 from '../../model/ManifestV2';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import OnlineModListProvider from '../../providers/components/loaders/OnlineModListProvider';
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
        return this.$store.state.profile.modList;
    }

    get thunderstoreModList(): ThunderstoreMod[] {
        return this.$store.state.tsMods.mods;
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

    @Watch("$store.state.modFilters.allowNsfw")
    @Watch("$store.state.modFilters.selectedCategoriesCompareOne")
    @Watch("$store.state.modFilters.selectedCategoriesCompareAll")
    @Watch("$store.state.modFilters.selectedCategoriesToExclude")
    @Watch("$store.state.modFilters.showDeprecatedPackages")
    filterThunderstoreModList() {
        const allowNsfw = this.$store.state.modFilters.allowNsfw;
        const filterCategoriesToCompareOne = this.$store.state.modFilters.selectedCategoriesCompareOne;
        const filterCategoriesToCompareAll = this.$store.state.modFilters.selectedCategoriesCompareAll;
        const filterCategoriesToExclude = this.$store.state.modFilters.selectedCategoriesToExclude;
        const showDeprecatedPackages = this.$store.state.modFilters.showDeprecatedPackages;

        let searchableList = this.sortedThunderstoreModList;
        const searchKeys = SearchUtils.makeKeys(this.thunderstoreSearchFilter);
        if (searchKeys.length > 0) {
            searchableList = this.sortedThunderstoreModList.filter((x: ThunderstoreMod) => {
                return SearchUtils.isSearched(searchKeys, x.getFullName(), x.getVersions()[0].getDescription())
            });
        }
        if (!allowNsfw) {
            searchableList = searchableList.filter(mod => !mod.getNsfwFlag());
        }
        if (!showDeprecatedPackages) {
            searchableList = searchableList.filter(
                mod => !this.$store.state.tsMods.deprecated.get(mod.getFullName())
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

        this.searchableThunderstoreModList = [...searchableList];

        // Update results
        this.changePage();
    }

    @Watch("sortingDirectionModel")
    @Watch("sortingStyleModel")
    @Watch("tsMods.mods")
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
