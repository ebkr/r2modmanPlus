import Vue from 'vue';
import Vuex, { ActionContext } from 'vuex';

import ErrorModule from './modules/ErrorModule';
import ModalsModule from './modules/ModalsModule';
import ModFilterModule from './modules/ModFilterModule';
import ProfileModule from './modules/ProfileModule';
import { TsModsModule } from './modules/TsModsModule';
import { FolderMigration } from '../migrations/FolderMigration';
import Game from '../model/game/Game';
import GameManager from '../model/game/GameManager';
import R2Error from '../model/errors/R2Error';
import ManagerSettings from '../r2mm/manager/ManagerSettings';

Vue.use(Vuex);

export interface State {
    activeGame: Game;
    apiConnectionError: string;
    dismissedUpdateAll: boolean;
    isMigrationChecked: boolean;
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
        dismissedUpdateAll: false,
        isMigrationChecked: false,
        apiConnectionError: "",

        // Access through getters to ensure the settings are loaded.
        _settings: null,
    },
    actions: {
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
        dismissUpdateAll(state: State) {
            state.dismissedUpdateAll = true;
        },
        setMigrationChecked(state: State) {
            state.isMigrationChecked = true;
        },
        setApiConnectionError(state: State, err: string) {
            state.apiConnectionError = err;
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
        error: ErrorModule,
        modals: ModalsModule,
        modFilters: ModFilterModule,
        profile: ProfileModule,
        tsMods: TsModsModule,
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
