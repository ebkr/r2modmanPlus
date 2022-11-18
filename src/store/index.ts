import Vue from 'vue';
import Vuex from 'vuex';

import ModalsModule from './modules/ModalsModule';
import ModFilterModule from './modules/ModFilterModule';
import { FolderMigration } from '../migrations/FolderMigration';
import ManifestV2 from '../model/ManifestV2';
import ThunderstoreMod from '../model/ThunderstoreMod';
import ThunderstorePackages from '../r2mm/data/ThunderstorePackages';

Vue.use(Vuex);

export interface State {
    apiConnectionError: string;
    deprecatedMods: Map<string, boolean>;
    dismissedUpdateAll: boolean;
    isMigrationChecked: boolean;
    localModList: ManifestV2[];
    thunderstoreModList: ThunderstoreMod[];
}

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function(/* { ssrContext } */) {
    const Store = new Vuex.Store<State>({
        state: {
            localModList: [],
            thunderstoreModList: [],
            dismissedUpdateAll: false,
            isMigrationChecked: false,
            apiConnectionError: "",
            deprecatedMods: new Map<string, boolean>(),
        },
        actions: {
            updateModList({ commit }, modList) {
                commit('setLocalModList', modList);
            },
            updateThunderstoreModList({ commit }, modList) {
                commit('setThunderstoreModList', modList);
                commit('setDeprecatedMods', modList);
            },
            dismissUpdateAll({commit}) {
                commit('dismissUpdateAll');
            },
            updateApiConnectionError({commit}, err) {
                commit('setApiConnectionError', err);
            },
            async checkMigrations({commit, state}) {
                if (state.isMigrationChecked) {
                    return;
                }

                try {
                    await FolderMigration.runMigration();
                } catch (e) {
                    console.error(e);
                } finally {
                    commit('setMigrationChecked');
                }
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
            setMigrationChecked(state) {
                state.isMigrationChecked = true;
            },
            setApiConnectionError(state, err) {
                state.apiConnectionError = err;
            },
            setDeprecatedMods(state, err) {
                state.deprecatedMods = ThunderstorePackages.getDeprecatedPackageMap();
            }
        },
        modules: {
            modals: ModalsModule,
            modFilters: ModFilterModule,
        },

        // enable strict mode (adds overhead!)
        // for dev mode only
        strict: process.env.DEV === 'true'
    });

    return Store;
}
