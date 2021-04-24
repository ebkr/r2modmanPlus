import Vue from 'vue';
import Vuex from 'vuex';

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
            dismissedUpdateAll: false,
            apiConnectionError: ""
        },
        actions: {
            updateModList({ commit }, modList) {
                commit('setLocalModList', modList);
            },
            updateThunderstoreModList({ commit }, modList) {
                commit('setThunderstoreModList', modList);
            },
            dismissUpdateAll({commit}) {
                commit('dismissUpdateAll');
            },
            updateApiConnectionError({commit}, err) {
                commit('setApiConnectionError', err);
            }
        },
        mutations: {
            setLocalModList(state, list) {
                state.localModList = list;
            },
            setThunderstoreModList(state, list) {
                state.thunderstoreModList = list;
            },
            dismissUpdateAll(state) {
                state.dismissedUpdateAll = true;
            },
            setApiConnectionError(state, err) {
                state.apiConnectionError = err;
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
