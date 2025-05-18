import { GetterTree } from 'vuex';

import { State as RootState } from '../index';
import { SortDirection } from '../../model/real_enums/sort/SortDirection';
import SortingStyle from '../../model/enums/SortingStyle';

interface State {
    allowNsfw: boolean;
    selectedCategoriesCompareOne: string[];
    selectedCategoriesCompareAll: string[];
    selectedCategoriesToExclude: string[];
    showDeprecatedPackages: boolean;
    sortDirection: string;
    sortBehaviour: string;
}

/**
 * State for ModFilter, i.e. filters for mod listings.
 */
export default {
    namespaced: true,

    state: (): State => ({
        allowNsfw: false,
        selectedCategoriesCompareOne: [],
        selectedCategoriesCompareAll: [],
        selectedCategoriesToExclude: [],
        showDeprecatedPackages: false,
        sortDirection: SortDirection.STANDARD,
        sortBehaviour: SortingStyle.DEFAULT
    }),

    getters: <GetterTree<State, RootState>>{
        unselectedCategories (state, _getters, _rootState, rootGetters) {
            const categories: string[] = rootGetters['tsMods/categories'];
            const selectedCategories = [
                ...state.selectedCategoriesCompareOne,
                ...state.selectedCategoriesCompareAll,
                ...state.selectedCategoriesToExclude
            ]
            return categories.filter((c: string) => !selectedCategories.includes(c));
        }
    },

    mutations: {
        reset: function(state: State) {
            state.allowNsfw = false;
            state.selectedCategoriesCompareOne = [];
            state.selectedCategoriesCompareAll = [];
            state.selectedCategoriesToExclude = [];
            state.sortDirection = SortDirection.STANDARD;
            state.sortBehaviour = SortingStyle.DEFAULT;
        },

        selectCategoryToCompareOne: function(state: State, category: string) {
            state.selectedCategoriesCompareOne = [...state.selectedCategoriesCompareOne, category];
        },

        selectCategoryToCompareAll: function(state: State, category: string) {
            state.selectedCategoriesCompareAll = [...state.selectedCategoriesCompareAll, category];
        },

        selectCategoryToExclude: function(state: State, category: string) {
            state.selectedCategoriesToExclude = [...state.selectedCategoriesToExclude, category];
        },

        setAllowNsfw: function(state: State, value: boolean) {
            state.allowNsfw = value;
        },

        setSortBehaviour(state: State, sortBehaviour: string) {
            state.sortBehaviour = sortBehaviour;
        },

        setSortDirection(state: State, direction: keyof typeof SortDirection) {
            state.sortDirection = direction;
        },

        unselectCategory: function(state: State, category: string) {
            state.selectedCategoriesCompareOne = state.selectedCategoriesCompareOne.filter((c) => c !== category);
            state.selectedCategoriesCompareAll = state.selectedCategoriesCompareAll.filter((c) => c !== category);
            state.selectedCategoriesToExclude = state.selectedCategoriesToExclude.filter((c) => c !== category);
        },

        setShowDeprecatedPackages: function(state: State, value: boolean) {
            state.showDeprecatedPackages = value;
        },
    },
}
