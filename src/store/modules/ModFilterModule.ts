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
            state.filterDateCreatedFrom = null;
            state.filterDateCreatedTo = null;
            state.filterDateUpdatedFrom = null;
            state.filterDateUpdatedTo = null;
            state.categoryFilterMode = CategoryFilterMode.OR;
            state.selectedCategories = [];
        },

        selectCategory: function(state: State, category: string) {
            state.selectedCategories = [...state.selectedCategories, category];
        },

        setAllowNsfw: function(state: State, value: boolean) {
            state.allowNsfw = value;
        },

        setfilterDateCreatedFrom: function(state: State, value: string | null) {
            state.filterDateCreatedFrom = value ? new Date(value) : null;
        },

        setfilterDateCreatedTo: function(state: State, value: string | null) {
            state.filterDateCreatedTo = value ? new Date(value) : null;
        },

        setfilterDateUpdatedFrom: function(state: State, value: string | null) {
            state.filterDateUpdatedFrom = value ? new Date(value) : null;
        },

        setfilterDateUpdatedTo: function(state: State, value: string | null) {
            state.filterDateUpdatedTo = value ? new Date(value) : null;
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
