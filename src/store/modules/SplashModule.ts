import RequestItem from '../../model/requests/RequestItem';
import { ActionTree } from 'vuex';
import { State as RootState } from "../../store";
import type { PackageListIndex } from './TsModsModule';

interface State {
    requests: RequestItem[];
    splashText: string;
}

export type UpdateRequestItemBody = {
    requestName: string,
    value: number,
}

export const SplashModule = {
    namespaced: true,

    state: (): State => ({
        requests: [],
        splashText: '',
    }),
    mutations: {
        resetRequestProgresses(state: State) {
            state.requests.forEach((request) => request.setProgress(0));
        },
        initialiseRequests(state: State) {
            state.requests = [
                new RequestItem('UpdateCheck', 0),
                new RequestItem('PackageListIndex', 0),
                new RequestItem('PackageListChunks', 0),
                new RequestItem('Vuex', 0)
            ];
        },
        setSplashText(state: State, splashText: string) {
            state.splashText = splashText;
        },
        updateRequestItem(state: State, body: UpdateRequestItemBody) {
            const item = state.requests.find((ri) => ri.getName() === body.requestName);

            if (item === undefined) {
                throw new Error(`Unknown RequestItem "${body.requestName}"`);
            }

            item.setProgress(body.value);
        }
    },
    actions: <ActionTree<State, RootState>>{
        setSplashText({ commit }, splashText: string) {
            commit('setSplashText', splashText);
        },
        /**
         * @deprecated in favour of updateRequestItem to prevent raw mutation of a Vuex item.
         * @param state
         * @param requestName
         */
        getRequestItem({state}, requestName: string): RequestItem {
            const item = state.requests.find((ri) => ri.getName() === requestName);

            if (item === undefined) {
                throw new Error(`Unknown RequestItem "${requestName}"`);
            }

            return item;
        },
        async getThunderstoreMods({commit, dispatch}) {
            commit('tsMods/startThunderstoreModListUpdate', null, {root: true});
            const hasPriorCache = await dispatch('doesGameHaveLocalCache');

            if (!hasPriorCache) {
                const packageListIndex = await dispatch('fetchPackageListIndex');
                const areAllChunksProcessedSuccessfully = await dispatch('fetchPackageListChunksIfUpdated', packageListIndex);
                await dispatch('pruneRemovedMods', packageListIndex, areAllChunksProcessedSuccessfully);
            }

            await dispatch('triggerStoreModListUpdate');
            commit('tsMods/finishThunderstoreModListUpdate', null, {root: true});

            if (hasPriorCache) {
                // We want this to trigger in the background to ensure that the user gets an up-to-date modlist as soon as possible.
                dispatch('tsMods/syncPackageList', null, {root: true});
            }
        },
        async fetchPackageListIndex({commit, dispatch}): Promise<PackageListIndex | undefined> {
             commit('setSplashText', 'Checking for mod list updates from Thunderstore');

            try {
                return await dispatch('tsMods/fetchPackageListIndex', null, {root: true});
            } catch (e) {
                console.error('SplashModule failed to fetch mod list index from API.', e);
                return undefined;
            } finally {
                commit('updateRequestItem', {
                    requestName: 'PackageListIndex',
                    value: 100
                } as UpdateRequestItemBody);
            }
        },
        async doesGameHaveLocalCache({dispatch, commit}): Promise<boolean> {
            commit('setSplashText', 'Checking for mod list in local cache');
            let hasCache = false;

            try {
                hasCache = await dispatch('tsMods/gameHasCachedModList', null, {root: true});
            } catch (e) {
                console.error('SplashModule failed to check mod list in local cache', e);
            }

            if (hasCache) {
                commit('updateRequestItem', {
                    requestName: 'PackageListIndex',
                    value: 100
                } as UpdateRequestItemBody);
                commit('updateRequestItem', {
                    requestName: 'PackageListChunks',
                    value: 100
                } as UpdateRequestItemBody);
            }

            return hasCache;
        },
        async fetchPackageListChunksIfUpdated({ commit, dispatch }, packageListIndex?: PackageListIndex): Promise<boolean> {
            // Skip loading chunks if loading index failed.
            if (!packageListIndex) {
                return false;
            }

            commit('setSplashText', 'Loading latest mod list from Thunderstore');

            const progressCallback = async (progress: number) => {
                commit('updateRequestItem', {
                    requestName: 'PackageListChunks',
                    value: progress
                } as UpdateRequestItemBody);
            };

            try {
                return await dispatch(
                    'tsMods/fetchAndCachePackageListChunks',
                    {packageListIndex, progressCallback},
                    {root: true}
                );
            } catch (e) {
                console.error('SplashModule failed to fetch mod list from API.', e);
                return false;
            } finally {
                await progressCallback(100);
            }
        },
        async pruneRemovedMods(
            { commit, dispatch },
            packageListIndex?: PackageListIndex,
            areAllChunksProcessedSuccessfully?: boolean
        ): Promise<void> {
            // Deletion depends on all mods in the persistent cache having a fresh
            // timestamp, which isn't the case if one or more chunks failed to be
            // downloaded or processed.
            if (!packageListIndex || !areAllChunksProcessedSuccessfully) {
                return;
            }

            commit('setSplashText', 'Pruning removed mods from local cache');

            try {
                await dispatch('tsMods/pruneRemovedModsFromCache', packageListIndex.dateFetched, {root: true});
            } catch (e) {
                console.error('SplashModule failed to delete outdated mods from local cache.', e);
            }
        },
        async triggerStoreModListUpdate({ commit, dispatch }): Promise<void> {
            commit('setSplashText', 'Processing the mod list');

            try {
                await dispatch('tsMods/updateMods', null, {root: true});
            } catch (e) {
                console.error('Updating the store mod list by SplashModule failed.', e);
            } finally {
                commit('updateRequestItem', {
                    requestName: 'Vuex',
                    value: 100
                } as UpdateRequestItemBody);
            }
        }
    }
}
