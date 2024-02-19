import Vue from 'vue';
import Vuex, { ActionContext } from 'vuex';

import ModalsModule from './modules/ModalsModule';
import ModFilterModule from './modules/ModFilterModule';
import ProfileModule from './modules/ProfileModule';
import { FolderMigration } from '../migrations/FolderMigration';
import Game from '../model/game/Game';
import GameManager from '../model/game/GameManager';
import R2Error from '../model/errors/R2Error';
import ThunderstoreMod from '../model/ThunderstoreMod';
import ThunderstorePackages from '../r2mm/data/ThunderstorePackages';
import ManagerSettings from '../r2mm/manager/ManagerSettings';

Vue.use(Vuex);

export interface State {
    activeGame: Game;
    apiConnectionError: string;
    deprecatedMods: Map<string, boolean>;
    dismissedUpdateAll: boolean;
    isMigrationChecked: boolean;
    thunderstoreModList: ThunderstoreMod[];
    _settings: ManagerSettings | null;
}

type Context = ActionContext<State, State>;

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export const store = {
    state: {
        activeGame: GameManager.defaultGame,
        thunderstoreModList: [],
        dismissedUpdateAll: false,
        isMigrationChecked: false,
        apiConnectionError: "",
        deprecatedMods: new Map<string, boolean>(),

        // Access through getters to ensure the settings are loaded.
        _settings: null,
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
        },
        async setActiveGame({commit}: Context, game: Game) {
            commit('setActiveGame', game);
            commit('setSettings', await ManagerSettings.getSingleton(game));
        }
    },
    mutations: {
        setActiveGame(state: State, game: Game) {
            state.activeGame = game;
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
        },
        setSettings(state: State, settings: ManagerSettings) {
            state._settings = settings;
        }
    },
    getters: {
        settings(state: State) {
            if (state._settings === null) {
                throw new R2Error(
                    'Accessing unset settings from Vuex store',
                    'getters.settings was called before actions.setActiveGame'
                );
            }

            if (state._settings.getContext().global.lastSelectedGame !== state.activeGame.internalFolderName) {
                throw new R2Error(
                    'Mismatch between active game and settings stored in Vuex store',
                    'Active game should be updated only via setActiveGame action'
                );
            }

            return state._settings;
        }
    },
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
