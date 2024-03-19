import { ActionTree, GetterTree, MutationTree } from 'vuex';

import { State as RootState } from '../index';
import ManifestV2 from '../../model/ManifestV2';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import ConnectionProvider from '../../providers/generic/connection/ConnectionProvider';
import * as PackageDb from '../../r2mm/manager/PackageDexieStore';
import { Deprecations } from '../../utils/Deprecations';

interface CachedMod {
    tsMod: ThunderstoreMod | undefined;
    isLatest: boolean;
}

interface State {
    cache: Map<string, CachedMod>;
    deprecated: Map<string, boolean>;
    exclusions?: string[];
    mods: ThunderstoreMod[];
    modsLastUpdated?: Date;
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
        cache: new Map<string, CachedMod>(),
        deprecated: new Map<string, boolean>(),
        /*** Packages available through API that should be ignored by the manager */
        exclusions: [],
        /*** All mods available through API for the current active game */
        mods: [],
        /*** When was the mod list last refreshed from the API? */
        modsLastUpdated: undefined
    }),

    getters: <GetterTree<State, RootState>>{
        /** Vue components mostly process mods in ManifestV2 format,
         *  but sometimes need access to ThunderstoreMod format and
         *  related data too. Since filtering the whole mods list every
         *  time this happens slows down the LocalModList, cache the
         *  data in a Map.
         */
        cachedMod: (state) => (mod: ManifestV2): CachedMod => {
            const cacheKey = `${mod.getName()}-${mod.getVersionNumber()}`;

            if (state.cache.get(cacheKey) === undefined) {
                const tsMod = state.mods.find((m) => m.getFullName() === mod.getName());

                // Updating Vuex state directly instead of mutations is a bad
                // practice but everything seems to work here since we only
                // mutate the map instead of replacing it altogether.
                if (tsMod === undefined) {
                    state.cache.set(cacheKey, {tsMod: undefined, isLatest: true});
                } else {
                    const latestVersionNumber = tsMod.getLatestVersion().getVersionNumber();
                    const isLatest = mod.getVersionNumber().isEqualOrNewerThan(latestVersionNumber);
                    state.cache.set(cacheKey, {tsMod, isLatest});
                }
            }

            return state.cache.get(cacheKey) as CachedMod;
        },

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

        /*** Is the version of a mod defined by ManifestV2 the newest version? */
        isLatestVersion: (_state, getters) => (mod: ManifestV2): boolean => {
            return getters.cachedMod(mod).isLatest;
        },

        /*** Which locally installed mods have updates in Thunderstore? */
        modsWithUpdates: (state, getters) => (profileMods: ManifestV2[]) => {
            return profileMods
                .filter(mod => !getters.isLatestVersion(mod))
                .map((mod): ThunderstoreMod | undefined => getters.tsMod(mod))
                .filter((tsMod): tsMod is ThunderstoreMod => tsMod !== undefined)
                .map((tsMod) => {
                    const combo = new ThunderstoreCombo();
                    combo.setMod(tsMod);
                    combo.setVersion(tsMod.getLatestVersion());
                    return combo;
                });
        },

        /*** Return ThunderstoreMod representation of a ManifestV2 */
        tsMod: (_state, getters) => (mod: ManifestV2): ThunderstoreMod | undefined => {
            return getters.cachedMod(mod).tsMod;
        },

        undeprecatedModCount(state) {
            return [...state.deprecated].filter(([_, isDeprecated]) => !isDeprecated).length;
        }
    },

    mutations: <MutationTree<State>>{
        clearModCache(state) {
            state.cache.clear();
        },
        setMods(state, payload: ThunderstoreMod[]) {
            state.mods = payload;
        },
        setModsLastUpdated(state, payload: Date|undefined) {
            state.modsLastUpdated = payload;
        },
        setExclusions(state, payload: string[]) {
            state.exclusions = payload;
        },
        updateDeprecated(state, allMods: ThunderstoreMod[]) {
            state.deprecated = Deprecations.getDeprecatedPackageMap(allMods);
        }
    },

    actions: <ActionTree<State, RootState>>{
        async updateExclusions({commit}) {
            const exclusions = await ConnectionProvider.instance.getExclusions();
            commit('setExclusions', exclusions);
        },

        async updateMods({commit, rootState}) {
            const modList = await PackageDb.getPackagesAsThunderstoreMods(rootState.activeGame.internalFolderName);
            const updated = await PackageDb.getLastPackageListUpdateTime(rootState.activeGame.internalFolderName);
            commit('setMods', modList);
            commit('setModsLastUpdated', updated);
            commit('updateDeprecated', modList);
            commit('clearModCache');
        },

        /*** Save a mod list received from the Thunderstore API to IndexedDB */
        async updatePersistentCache(
            {dispatch, rootState, state},
            packages: {full_name: string}[]
        ) {
            if (state.exclusions === undefined) {
                await dispatch('updateExclusions');
            }

            const filtered = packages.filter((pkg) => !state.exclusions!.includes(pkg.full_name));
            const community = rootState.activeGame.internalFolderName;
            await PackageDb.updateFromApiResponse(community, filtered);
        }
    }
}
