import { GetterTree } from 'vuex';

import { State as RootState } from '../index';
import ManifestV2 from '../../model/ManifestV2';
import { SortDirection } from '../../model/real_enums/sort/SortDirection';
import { SortLocalDisabledMods } from '../../model/real_enums/sort/SortLocalDisabledMods';
import { SortNaming } from '../../model/real_enums/sort/SortNaming';
import ModListSort from '../../r2mm/mods/ModListSort';
import SearchUtils from '../../utils/SearchUtils';

interface State {
    order?: SortNaming;
    direction?: SortDirection;
    disabledPosition?: SortLocalDisabledMods;
    searchQuery: string;
}

/**
 * State for LocalModList, i.e. list for mods in a single profile.
 */
export default {
    namespaced: true,

    state: (): State => ({
        order: undefined,
        direction: undefined,
        disabledPosition: undefined,
        searchQuery: '',
    }),

    getters: <GetterTree<State, RootState>>{
        orderedModList(state, _getters, rootState): ManifestV2[] {
            // Theoretically sorters can be undefined to avoid having to
            // mix ManagerSettings singleton to VueX store.
            if (!state.order || !state.direction || !state.disabledPosition) {
                return [...rootState.localModList];
            }

            return ModListSort.sortLocalModList(
                rootState.localModList,
                state.direction,
                state.disabledPosition,
                state.order
            );
        },

        visibleModList(state, getters, rootState): ManifestV2[] {
            const mods: ManifestV2[] = getters.orderedModList;

            if (!state.searchQuery) {
                return mods;
            }

            const searchKeys = SearchUtils.makeKeys(state.searchQuery);
            return mods.filter(
                (mod) => SearchUtils.isSearched(searchKeys, mod.getName(), mod.getDescription())
            );
        },

        canSortMods(state): boolean {
            return state.order === SortNaming.CUSTOM
                && state.direction === SortDirection.STANDARD
                && state.disabledPosition === SortLocalDisabledMods.CUSTOM
                && state.searchQuery.length === 0;
        },
    },

    mutations: {
        initialize(
            state: State,
            values: [SortNaming, SortDirection, SortLocalDisabledMods]
        ) {
            state.order = values[0];
            state.direction = values[1];
            state.disabledPosition = values[2];
        },

        setOrder(state: State, value: SortNaming) {
            state.order = value;
        },

        setDirection(state: State, value: SortDirection) {
            state.direction = value;
        },

        setDisabledPosition(state: State, value: SortLocalDisabledMods) {
            state.disabledPosition = value;
        },

        setSearchQuery(state: State, value: string) {
            state.searchQuery = value.trim();
        },
    },
}
