import { ActionContext, createStore } from 'vuex';

import ErrorModule from './modules/ErrorModule';
import { DownloadModule } from './modules/DownloadModule';
import ModalsModule from './modules/ModalsModule';
import ModFilterModule from './modules/ModFilterModule';
import ProfileModule from './modules/ProfileModule';
import ProfileExportModule from './modules/ProfileExportModule';
import { ProfilesModule } from './modules/ProfilesModule';
import { TsModsModule } from './modules/TsModsModule';
import { FolderMigration } from '../migrations/FolderMigration';
import Game from '../model/game/Game';
import GameManager from '../model/game/GameManager';
import R2Error from '../model/errors/R2Error';
import { getModLoaderPackageNames } from '../r2mm/installing/profile_installers/ModLoaderVariantRecord';
import ManagerSettings from '../r2mm/manager/ManagerSettings';
import { SplashModule } from './modules/SplashModule';

export interface State {
    activeGame: Game;
    isMigrationChecked: boolean;
    modLoaderPackageNames: string[];
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
        modLoaderPackageNames: [],

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

        async setActiveGame({commit, dispatch}: Context, game: Game): Promise<ManagerSettings> {
            // Some parts of the code base reads the active game from
            // this static class attribute for now. Ideally we wouldn't
            // need to track it on two separate places.
            GameManager.activeGame = game;
            commit('setActiveGame', game);

            const settings = await ManagerSettings.getSingleton(game);
            commit('setSettings', settings);
            commit('download/setIgnoreCacheVuexOnly', settings.getContext().global.ignoreCache);

            // Return settings for the new active game. This comes handy
            // when accessing settings before user has selected the game
            // as the settings-getter might throw a sanity check error.
            return settings;
        },

        async resetLocalState({commit, dispatch}: Context) {
            commit('profile/reset');
            commit('profiles/reset');
            commit('tsMods/reset');
            commit('modFilters/reset');
            commit('profileExport/reset');
            await dispatch('resetActiveGame');
        },
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
        },
        updateModLoaderPackageNames(state: State) {
            // The list is static and doesn't change during runtime.
            if (!state.modLoaderPackageNames.length) {
                state.modLoaderPackageNames = getModLoaderPackageNames();
            }
        }
    },
    getters: {
        isModLoader: (state: State) => (packageName: string): boolean => {
            return state.modLoaderPackageNames.includes(packageName);
        },

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
        download: DownloadModule,
        modals: ModalsModule,
        modFilters: ModFilterModule,
        profile: ProfileModule,
        profiles: ProfilesModule,
        tsMods: TsModsModule,
        profileExport: ProfileExportModule,
        splash: SplashModule,
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: import.meta.env.MODE === 'development1',
};

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
let singletonStore = createStore(store);

export default singletonStore;
