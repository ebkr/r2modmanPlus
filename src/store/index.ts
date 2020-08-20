import Vue from 'vue';
import Vuex from 'vuex';
import ModListSort from '../r2mm/mods/ModListSort';
import { SortDirection } from '../model/real_enums/sort/SortDirection';
import { SortDeprecatedFilter } from '../model/real_enums/sort/SortDeprecatedFilter';
import { SortLocalDisabledMods } from '../model/real_enums/sort/SortLocalDisabledMods';
import { SortNaming } from '../model/real_enums/sort/SortNaming';

// import example from './module-example'

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function(/* { ssrContext } */) {
    const Store = new Vuex.Store({
        state: {
            localModList: [],
            thunderstoreModList: [],
        },
        actions: {
            updateModList({ commit }, modList) {
                commit('setLocalModList', modList);
            },
            updateThunderstoreModList({ commit }, modList) {
                commit('setThunderstoreModList', modList);
            }
        },
        mutations: {
            setLocalModList(state, list) {
                state.localModList = list;
            },
            setThunderstoreModList(state, list) {
                state.thunderstoreModList = list;
            }
        },
        modules: {
            // example
        },

        // enable strict mode (adds overhead!)
        // for dev mode only
        strict: process.env.DEV === 'true'
    });

    return Store;
}
