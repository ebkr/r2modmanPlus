import { ActionTree, GetterTree, MutationTree } from 'vuex';

import { State as RootState } from '../index';
import ManifestV2 from '../../model/ManifestV2';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import ThunderstoreDownloaderProvider from '../../providers/ror2/downloading/ThunderstoreDownloaderProvider';
import ThunderstorePackages from '../../r2mm/data/ThunderstorePackages';


interface State {
    deprecated: Map<string, boolean>;
    mods: ThunderstoreMod[];
}

/**
 * For dealing with mods listed in communities, i.e. available through
 * the Thunderstore API. Mods received from the API are stored in
 * IndexedDB (via Dexie). For performance they're also stored in memory
 * by this Vuex store module.
 */
export const TsModsModule = {
    namespaced: true,

    state: (): State => ({
        deprecated: new Map<string, boolean>(),
        /*** All mods available through API for the current active game */
        mods: [],
    }),

    getters: <GetterTree<State, RootState>>{
        /*** Categories used by any mod listed in the community */
        categories(state) {
            const categories = Array.from(
                new Set(
                    state.mods.map((mod) => mod.getCategories()).flat()
                )
            );
            categories.sort();
            return categories;
        },

        /*** Which locally installed mods have updates in Thunderstore? */
        modsWithUpdates: (state) => (profileMods: ManifestV2[]) => {
            return ThunderstoreDownloaderProvider.instance.getLatestOfAllToUpdate(
                profileMods,
                state.mods
            );
        }
    },

    mutations: <MutationTree<State>>{
        setMods(state, payload: ThunderstoreMod[]) {
            state.mods = payload;
        },
        updateDeprecated(state) {
            state.deprecated = ThunderstorePackages.getDeprecatedPackageMap();
        }
    },

    actions: <ActionTree<State, RootState>>{
        updateMods({commit}, modList: ThunderstoreMod[]) {
            commit('setMods', modList);
            commit('updateDeprecated');
        }
    }
}
