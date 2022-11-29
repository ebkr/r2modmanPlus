import Vue from 'vue';
import Vuex, { ActionContext } from 'vuex';

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

type Context = ActionContext<State, State>;

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export const store = {
    state: {
        localModList: [],
        thunderstoreModList: [],
        dismissedUpdateAll: false,
        isMigrationChecked: false,
        apiConnectionError: "",
        deprecatedMods: new Map<string, boolean>(),
    },
    actions: {
        updateModList({ commit }: Context, modList: ManifestV2[]) {
            commit('setLocalModList', modList);
        },
        updateThunderstoreModList({ commit }: Context, modList: ThunderstoreMod[]) {
            commit('setThunderstoreModList', modList);
            commit('setDeprecatedMods', modList);
        },
        dismissUpdateAll({commit}: Context) {
            commit('dismissUpdateAll');
        },
        updateApiConnectionError({commit}: Context, err: string) {
            commit('setApiConnectionError', err);
        },
        async checkMigrations({commit, state}: Context) {
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
        setLocalModList(state: State, list: ManifestV2[]) {
            state.localModList = list;
        },
        setThunderstoreModList(state: State, list: ThunderstoreMod[]) {
            state.thunderstoreModList = list;
        },
        dismissUpdateAll(state: State) {
            state.dismissedUpdateAll = true;
        },
        setMigrationChecked(state: State) {
            state.isMigrationChecked = true;
        },
        setApiConnectionError(state: State, err: string) {
            state.apiConnectionError = err;
        },
        setDeprecatedMods(state: State) {
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
};

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default (/* { ssrContext } */) => new Vuex.Store<State>(store);
