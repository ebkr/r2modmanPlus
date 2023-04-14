import { GetterTree } from 'vuex';

import { State as RootState } from '../index';
import CategoryFilterMode from '../../model/enums/CategoryFilterMode';

interface State {
    allowNsfw: boolean;
    filterDateCreatedFrom: Date | null;
    filterDateCreatedTo: Date | null;
    filterDateUpdatedFrom: Date | null;
    filterDateUpdatedTo: Date | null;
    categoryFilterMode: CategoryFilterMode;
    selectedCategories: string[];
    showDeprecatedPackages: boolean;
}

export default {
    namespaced: true,

    state: (): State => ({
        allowNsfw: false,
        filterDateCreatedFrom: null,
        filterDateCreatedTo: null,
        filterDateUpdatedFrom: null,
        filterDateUpdatedTo: null,
        categoryFilterMode: CategoryFilterMode.OR,
        selectedCategories: [],
        showDeprecatedPackages: false
    }),

    getters: <GetterTree<State, RootState>>{
        allCategories (_state, _getters, rootState) {
            const categories = Array.from(
                new Set(
                    rootState.thunderstoreModList
                        .map((mod) => mod.getCategories())
                        .flat()
                )
            );
            categories.sort();
            return categories;
        },

        unselectedCategories (state, getters) {
            const categories: string[] = getters.allCategories;
            return categories.filter((c: string) => !state.selectedCategories.includes(c));
        }
    },

    mutations: {
        reset: function(state: State) {
            state.allowNsfw = false;
            state.filterDateCreatedFrom = new Date();
            state.filterDateCreatedTo = new Date();
            state.filterDateUpdatedFrom = new Date();
            state.filterDateUpdatedTo = new Date();
            state.categoryFilterMode = CategoryFilterMode.OR;
            state.selectedCategories = [];
        },

        selectCategory: function(state: State, category: string) {
            state.selectedCategories = [...state.selectedCategories, category];
        },

        setAllowNsfw: function(state: State, value: boolean) {
            state.allowNsfw = value;
        },

        setfilterDateCreatedFrom: function(state: State, value: Date | null) {
            state.filterDateCreatedFrom = value;
        },

        setfilterDateCreatedTo: function(state: State, value: Date | null) {
            state.filterDateCreatedTo = value;
        },

        setfilterDateUpdatedFrom: function(state: State, value: Date | null) {
            state.filterDateUpdatedFrom = value;
        },

        setfilterDateUpdatedTo: function(state: State, value: Date | null) {
            state.filterDateUpdatedTo = value;
        },

        setCategoryFilterMode: function(state: State, value: CategoryFilterMode) {
            state.categoryFilterMode = value;
        },

        unselectCategory: function(state: State, category: string) {
            state.selectedCategories = state.selectedCategories.filter((c) => c !== category);
        },

        setShowDeprecatedPackages: function(state: State, value: boolean) {
            state.showDeprecatedPackages = value;
        },
    },
}
