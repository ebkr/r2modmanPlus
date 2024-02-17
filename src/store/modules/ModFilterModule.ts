import { GetterTree } from 'vuex';

import { State as RootState } from '../index';
import CategoryFilterMode from '../../model/enums/CategoryFilterMode';

interface State {
    allowNsfw: boolean;
    categoryFilterMode: CategoryFilterMode;
    selectedCategories: string[];
    showDeprecatedPackages: boolean;
}

/**
 * State for OnlineModList, i.e. list for all the mods available on Thunderstore.
 */
export default {
    namespaced: true,

    state: (): State => ({
        allowNsfw: false,
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
            state.categoryFilterMode = CategoryFilterMode.OR;
            state.selectedCategories = [];
        },

        selectCategory: function(state: State, category: string) {
            state.selectedCategories = [...state.selectedCategories, category];
        },

        setAllowNsfw: function(state: State, value: boolean) {
            state.allowNsfw = value;
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
