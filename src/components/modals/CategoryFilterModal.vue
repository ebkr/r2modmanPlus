<template>
    <modal v-show="isOpen" :open="isOpen" :show-close="false">
        <template v-slot:title>
            <p class="card-header-title">{{ $t('modals.filter.title') }}</p>
        </template>
        <template v-slot:body>
            <div>
                <CategorySelectorModal
                    title="Mods must contain at least one of these categories"
                    :selected-categories="selectedCategoriesCompareOne"
                    :selectable-categories="unselectedCategories"
                    @selected-category="selectCompareOneCategory"
                    @deselected-category="unselectCategory"
                />
                <hr/>
                <CategorySelectorModal
                    title="Mods must contain all of these categories"
                    :selected-categories="selectedCategoriesCompareAll"
                    :selectable-categories="unselectedCategories"
                    @selected-category="selectCompareAllCategory"
                    @deselected-category="unselectCategory"
                />
                <hr/>
                <CategorySelectorModal
                    title="Mods cannot contain any of these categories"
                    :selected-categories="selectedCategoriesToExclude"
                    :selectable-categories="unselectedCategories"
                    @selected-category="selectToExcludeCategory"
                    @deselected-category="unselectCategory"
                />
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
                    <label for="nsfwCheckbox">{{ $t('modals.filter.allowNsfw') }}</label>
                </div>
                <div>
                    <input
                        v-model="showDeprecatedPackages"
                        id="showDeprecatedCheckbox"
                        class="is-checkradio has-background-color"
                        type="checkbox"
                        :class="[{'is-dark': !isDarkTheme, 'is-white': isDarkTheme}]"
                    >
                    <label for="showDeprecatedCheckbox">{{ $t('modals.filter.showDeprecated') }}</label>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="close">
                {{ $t('modals.filter.apply') }}
            </button>
        </template>
    </modal>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { Modal } from '../../components/all';
import CategorySelectorModal from '../../components/modals/CategorySelectorModal.vue';

@Component({
    components: { CategorySelectorModal, Modal }
})
export default class CategoryFilterModal extends Vue {
    get allowNsfw(): boolean {
        return this.$store.state.modFilters.allowNsfw;
    }

    set allowNsfw(value: boolean) {
        this.$store.commit("modFilters/setAllowNsfw", value);
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

    get isDarkTheme(): boolean {
        return this.$store.getters["settings"].getContext().global.darkTheme;
    }

    get isOpen(): boolean {
        return this.$store.state.modals.isCategoryFilterModalOpen;
    }

    selectCompareOneCategory(event: Event) {
        if (!(event.target instanceof HTMLSelectElement)) {
            return;
        }

        this.$store.commit("modFilters/selectCategoryToCompareOne", event.target.value);
        event.target.selectedIndex = 0;
    }

    selectCompareAllCategory(event: Event) {
        if (!(event.target instanceof HTMLSelectElement)) {
            return;
        }

        this.$store.commit("modFilters/selectCategoryToCompareAll", event.target.value);
        event.target.selectedIndex = 0;
    }

    selectToExcludeCategory(event: Event) {
        if (!(event.target instanceof HTMLSelectElement)) {
            return;
        }

        this.$store.commit("modFilters/selectCategoryToExclude", event.target.value);
        event.target.selectedIndex = 0;
    }

    get selectedCategoriesCompareOne(): string[] {
        return this.$store.state.modFilters.selectedCategoriesCompareOne;
    }

    get selectedCategoriesCompareAll(): string[] {
        return this.$store.state.modFilters.selectedCategoriesCompareAll;
    }

    get selectedCategoriesToExclude(): string[] {
        return this.$store.state.modFilters.selectedCategoriesToExclude;
    }

    unselectCategory(category: string) {
        this.$store.commit("modFilters/unselectCategory", category);
    }

    get unselectedCategories(): string[] {
        return this.$store.getters["modFilters/unselectedCategories"];
    }
}
</script>
