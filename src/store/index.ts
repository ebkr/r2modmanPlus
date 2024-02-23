import Vue from 'vue';
import Vuex, { ActionContext } from 'vuex';

import ModalsModule from './modules/ModalsModule';
import ModFilterModule from './modules/ModFilterModule';
import ProfileModule from './modules/ProfileModule';
import { FolderMigration } from '../migrations/FolderMigration';
import ThunderstoreMod from '../model/ThunderstoreMod';
import ThunderstorePackages from '../r2mm/data/ThunderstorePackages';

Vue.use(Vuex);

export interface State {
    apiConnectionError: string;
    deprecatedMods: Map<string, boolean>;
    dismissedUpdateAll: boolean;
    isMigrationChecked: boolean;
    thunderstoreModList: ThunderstoreMod[];
}

type Context = ActionContext<State, State>;

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export const store = {
    state: {
        thunderstoreModList: [],
        dismissedUpdateAll: false,
        isMigrationChecked: false,
        apiConnectionError: "",
        deprecatedMods: new Map<string, boolean>(),
    },
    actions: {
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
    getters: {},
    modules: {
        modals: ModalsModule,
        modFilters: ModFilterModule,
        profile: ProfileModule,
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
