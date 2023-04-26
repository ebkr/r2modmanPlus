<template>
    <modal v-show="isOpen" :open="isOpen" :show-close="false">
        <template v-slot:title>
            <p class="card-header-title">Filter mod categories</p>
        </template>
        <template v-slot:body>
            <div class="input-group">
                <label>Categories</label>
                <select class="select select--content-spacing" @change="selectCategory($event)">
                    <option selected disabled>
                        Select a category
                    </option>
                    <option v-for="(key, index) in unselectedCategories" :key="`category--${key}-${index}`">
                        {{ key }}
                    </option>
                </select>
            </div>
            <br/>
            <div class="input-group">
                <label>Selected categories:</label>
                <div class="field has-addons" v-if="selectedCategories.length > 0">
                    <div class="control" v-for="(key, index) in selectedCategories" :key="`${key}-${index}`">
                        <span class="block margin-right">
                            <a href="#" @click="unselectCategory(key)">
                                <span class="tags has-addons">
                                    <span class="tag">{{ key }}</span>
                                    <span class="tag is-danger">
                                        <i class="fas fa-times"></i>
                                    </span>
                                </span>
                            </a>
                        </span>
                    </div>
                </div>
                <div class="field has-addons" v-else>
                    <span class="tags">
                        <span class="tag">No categories selected</span>
                    </span>
                </div>
            </div>
            <hr/>
            <div>
                <div class="datepicker-container">
                    <div class="datepicker-row">
                        <span>Creation date</span>
                        <span>Update date</span>
                    </div>
                    <div class="datepicker-row">
                        <q-date v-model="filterDateCreated" range minimal class="datepicker-dark"/>
                        <q-date v-model="filterDateUpdated" range minimal class="datepicker-dark"/>
                    </div>
                </div>
                <br/>
                <br/>
            </div>
            <hr/>
            <div>

                <div>
                    <input
                        v-model="allowNsfw"
                        id="nsfwCheckbox"
                        class="is-checkradio has-background-color"
                        type="checkbox"
                        :class="[{'is-dark': !isDarkTheme, 'is-white': isDarkTheme}]"
                    >
                    <label for="nsfwCheckbox">Allow NSFW (potentially explicit) mods</label>
                </div>
                <div>
                    <input
                        v-model="showDeprecatedPackages"
                        id="showDeprecatedCheckbox"
                        class="is-checkradio has-background-color"
                        type="checkbox"
                        :class="[{'is-dark': !isDarkTheme, 'is-white': isDarkTheme}]"
                    >
                    <label for="showDeprecatedCheckbox">Show deprecated mods</label>
                </div>
            </div>
            <br/>
            <div>
                <div v-for="(key, index) in categoryFilterValues" :key="`cat-filter-${key}-${index}`">
                    <input
                        name="categoryFilterCondition"
                        type="radio"
                        :id="`cat-filter-${key}-${index}`"
                        :value=key
                        :checked="index === 0 ? true : undefined" v-model="categoryFilterMode"
                    />
                    <label :for="`cat-filter-${key}-${index}`">
                        <span class="margin-right margin-right--half-width" />
                        {{ key }}
                    </label>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="close">
                Apply filters
            </button>
        </template>
    </modal>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { Modal } from '../../components/all';
import CategoryFilterMode from '../../model/enums/CategoryFilterMode';
import GameManager from '../../model/game/GameManager';
import ManagerSettings from '../../r2mm/manager/ManagerSettings';
import { date } from "quasar";

@Component({
    components: { Modal }
})
export default class CategoryFilterModal extends Vue {
    settings: ManagerSettings = new ManagerSettings();

    get allowNsfw(): boolean {
        return this.$store.state.modFilters.allowNsfw;
    }

    set allowNsfw(value: boolean) {
        this.$store.commit("modFilters/setAllowNsfw", value);
    }

    get filterDateCreated(): { from: string | null, to: string | null } | null {
        return {
            from: date.formatDate(this.$store.state.modFilters.filterDateCreatedFrom, 'YYYY/MM/DD'),
            to: date.formatDate(this.$store.state.modFilters.filterDateCreatedTo, 'YYYY/MM/DD'),
        };
    }

    set filterDateCreated(value: { from: string | null, to: string | null } | null) {
        this.$store.commit("modFilters/setfilterDateCreatedFrom", value ? value.from : value);
        this.$store.commit("modFilters/setfilterDateCreatedTo", value ? value.to : value);
    }

    get filterDateUpdated(): { from: string | null, to: string | null } | null {
        return {
            from: date.formatDate(this.$store.state.modFilters.filterDateUpdatedFrom, 'YYYY/MM/DD'),
            to: date.formatDate(this.$store.state.modFilters.filterDateUpdatedTo, 'YYYY/MM/DD'),
        };
    }

    set filterDateUpdated(value: { from: string | null, to: string | null } | null) {
        this.$store.commit("modFilters/setfilterDateUpdatedFrom", value ? value.from : value);
        this.$store.commit("modFilters/setfilterDateUpdatedTo", value ? value.to : value);
    }

    get categoryFilterMode(): CategoryFilterMode {
        return this.$store.state.modFilters.categoryFilterMode;
    }

    set categoryFilterMode(value: CategoryFilterMode) {
        this.$store.commit("modFilters/setCategoryFilterMode", value);
    }

    get categoryFilterValues() {
        return Object.values(CategoryFilterMode);
    }

    get showDeprecatedPackages(): boolean {
        return this.$store.state.modFilters.showDeprecatedPackages;
    }

    set showDeprecatedPackages(value: boolean) {
        this.$store.commit("modFilters/setShowDeprecatedPackages", value);
    }

    close() {
        this.$store.commit("closeCategoryFilterModal");
    }

    async created() {
        this.settings = await ManagerSettings.getSingleton(GameManager.activeGame);
    }

    get isDarkTheme(): boolean {
        return this.settings.getContext().global.darkTheme;
    }

    get isOpen(): boolean {
        return this.$store.state.modals.isCategoryFilterModalOpen;
    }

    selectCategory(event: Event) {
        if (!(event.target instanceof HTMLSelectElement)) {
            return;
        }

        this.$store.commit("modFilters/selectCategory", event.target.value);
        event.target.selectedIndex = 0;
    }

    get selectedCategories(): string[] {
        return this.$store.state.modFilters.selectedCategories;
    }

    unselectCategory(category: string) {
        this.$store.commit("modFilters/unselectCategory", category);
    }

    get unselectedCategories(): string[] {
        return this.$store.getters["modFilters/unselectedCategories"];
    }

    get disabledDates() {
        return { from: new Date() };
    }

    get highlightedCreatedDates() {
        
        const highlighted = Object();
        highlighted.from = this.$store.state.modFilters.filterDateCreatedFrom
        highlighted.to = this.$store.state.modFilters.filterDateCreatedTo
        return { from: new Date() };
    }
}
</script>
