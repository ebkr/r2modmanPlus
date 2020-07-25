import Vue from 'vue';
import Vuex from 'vuex';

// import example from './module-example'

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {
      list:[]
    },
    actions: {
      updateModList({commit},modList) {
        commit("setList",modList);
      }
    },
    mutations: {
      setList(state,list) {
        state.list = list;
      }
    },
    modules: {
      // example
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV === 'true',
  });

  return Store;
}