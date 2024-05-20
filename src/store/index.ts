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
import { setQuickActionProvider } from '../r2mm/quick_actions/QuickActionProvider';
import { QuickActionsProviderImpl } from '../r2mm/quick_actions/QuickActionsProviderImpl';

setQuickActionProvider(() => new QuickActionsProviderImpl())

Vue.use(Vuex);

export interface State {
    activeGame: Game;
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
        isMigrationChecked: false,

        // Access through getters to ensure the settings are loaded.
        _settings: null,
    },
    actions: {
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

        async resetActiveGame({dispatch}: Context): Promise<ManagerSettings> {
            return await dispatch('setActiveGame', GameManager.defaultGame);
        },

        async setActiveGame({commit}: Context, game: Game): Promise<ManagerSettings> {
            // Some parts of the code base reads the active game from
            // this static class attribute for now. Ideally we wouldn't
            // need to track it on two separate places.
            GameManager.activeGame = game;
            commit('setActiveGame', game);

            // Return settings for the new active game. This comes handy
            // when accessing settings before user has selected the game
            // as the settings-getter might throw a sanity check error.
            const settings = await ManagerSettings.getSingleton(game);
            commit('setSettings', settings);
            return settings;
        }
    },
    mutations: {
        setActiveGame(state: State, game: Game) {
            state.activeGame = game;
        },
        setMigrationChecked(state: State) {
            state.isMigrationChecked = true;
        },
        setSettings(state: State, settings: ManagerSettings) {
            state._settings = settings;
        }
    },
    getters: {
        settings(state: State): ManagerSettings {
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
