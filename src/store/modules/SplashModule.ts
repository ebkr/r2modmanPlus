import RequestItem from 'src/model/requests/RequestItem';
import { ActionTree } from 'vuex';
import { State as RootState } from 'src/store';
import type { PackageListIndex } from 'src/store/modules/TsModsModule';

interface State {
    requests: RequestItem[];
    splashText: string;
}

/**
 * State for Profiles, i.e. list for profiles in a single game/community.
 */
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
        }
    },
    actions: <ActionTree<State, RootState>>{
        setSplashText({ state }, splashText: string) {
            state.splashText = splashText;
        },
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

            // TODO - Move to next screen (name: profiles)
        },
        async fetchPackageListIndex({state, dispatch}): Promise<PackageListIndex | undefined> {
             state.splashText = 'Checking for mod list updates from Thunderstore';

            try {
                return await dispatch('tsMods/fetchPackageListIndex', null, {root: true});
            } catch (e) {
                console.error('SplashModule failed to fetch mod list index from API.', e);
                return undefined;
            } finally {
                const requestItem = await dispatch('getRequestItem', 'PackageListIndex') as RequestItem;
                requestItem.setProgress(100);
            }
        },
        async doesGameHaveLocalCache({state, dispatch}): Promise<boolean> {
            state.splashText = 'Checking for mod list in local cache';
            let hasCache = false;

            try {
                hasCache = await dispatch('tsMods/gameHasCachedModList', null, {root: true});
            } catch (e) {
                console.error('SplashMixin failed to check mod list in local cache', e);
            }

            if (hasCache) {
                const packageListIndex = await dispatch('getRequestItem', 'PackageListIndex') as RequestItem;
                packageListIndex.setProgress(100);
                const packageListChunks = await dispatch('getRequestItem', 'PackageListChunks') as RequestItem;
                packageListChunks.setProgress(100);
            }

            return hasCache;
        },
        async fetchPackageListChunksIfUpdated({state, dispatch}, packageListIndex?: PackageListIndex): Promise<boolean> {
            // Skip loading chunks if loading index failed.
            if (!packageListIndex) {
                return false;
            }

            state.splashText = 'Loading latest mod list from Thunderstore';

            const progressCallback = async (progress: number) => {
                const packageListChunks = await dispatch('getRequestItem', 'PackageListChunks');
                packageListChunks.setProgress(progress);
            };

            try {
                return await dispatch(
                    'tsMods/fetchAndCachePackageListChunks',
                    {packageListIndex, progressCallback},
                    {root: true}
                );
            } catch (e) {
                console.error('SplashMixin failed to fetch mod list from API.', e);
                return false;
            } finally {
                await progressCallback(100);
            }
        },
        async pruneRemovedMods(
            { state, dispatch },
            packageListIndex?: PackageListIndex,
            areAllChunksProcessedSuccessfully?: boolean
        ): Promise<void> {
            // Deletion depends on all mods in the persistent cache having a fresh
            // timestamp, which isn't the case if one or more chunks failed to be
            // downloaded or processed.
            if (!packageListIndex || !areAllChunksProcessedSuccessfully) {
                return;
            }

            state.splashText = 'Pruning removed mods from local cache';

            try {
                await dispatch('tsMods/pruneRemovedModsFromCache', packageListIndex.dateFetched, {root: true});
            } catch (e) {
                console.error('SplashMixin failed to delete outdated mods from local cache.', e);
            }
        },
        async triggerStoreModListUpdate({state, dispatch}): Promise<void> {
            state.splashText = 'Processing the mod list';

            try {
                await dispatch('tsMods/updateMods', null, {root: true});
            } catch (e) {
                console.error('Updating the store mod list by SplashMixin failed.', e);
            } finally {
                const vuex = await dispatch('getRequestItem', 'Vuex');
                vuex.setProgress(100);
            }
        }
    }
}
