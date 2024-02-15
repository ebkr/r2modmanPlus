import { ActionTree, GetterTree } from 'vuex';

import { State as RootState } from '../index';
import R2Error from '../../model/errors/R2Error';
import ManifestV2 from '../../model/ManifestV2';
import Profile from "../../model/Profile";
import { SortDirection } from '../../model/real_enums/sort/SortDirection';
import { SortLocalDisabledMods } from '../../model/real_enums/sort/SortLocalDisabledMods';
import { SortNaming } from '../../model/real_enums/sort/SortNaming';
import ConflictManagementProvider from '../../providers/generic/installing/ConflictManagementProvider';
import ProfileInstallerProvider from '../../providers/ror2/installing/ProfileInstallerProvider';
import ModListSort from '../../r2mm/mods/ModListSort';
import ProfileModList from '../../r2mm/mods/ProfileModList';
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
        visibleModList(state, _getters, rootState): ManifestV2[] {
            let mods = [...rootState.localModList];

            if (state.searchQuery) {
                const searchKeys = SearchUtils.makeKeys(state.searchQuery);
                mods = mods.filter(
                    (mod) => SearchUtils.isSearched(searchKeys, mod.getName(), mod.getDescription())
                );
            }

            // Theoretically sorters can be undefined to avoid having to
            // mix ManagerSettings singleton to VueX store.
            if (!state.order || !state.direction || !state.disabledPosition) {
                return mods;
            }

            return ModListSort.sortLocalModList(
                mods,
                state.direction,
                state.disabledPosition,
                state.order
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

    actions: <ActionTree<State, RootState>>{
        async disableModsFromActiveProfile(
            {dispatch},
            params: {
                mods: ManifestV2[],
                onProgress?: (mod: ManifestV2) => void,
            }
        ) {
            // TODO: manage active profile in Vuex.
            const profile = Profile.getActiveProfile();

            // Sanity check.
            if (profile === undefined) {
                throw new R2Error(
                    'No active profile found',
                    'Unable to disable mods when active profile is not set.'
                )
            }

            await dispatch('disableModsFromProfile', {...params, profile});
        },

        async disableModsFromProfile(
            {dispatch},
            params: {
                mods: ManifestV2[],
                profile: Profile,
                onProgress?: (mod: ManifestV2) => void,
            }
        ) {
            const {mods, profile, onProgress} = params;
            let lastSuccessfulUpdate: ManifestV2[] | undefined;

            try {
                // Disable mods on disk.
                for (const mod of mods) {
                    onProgress && onProgress(mod);

                    if (!mod.isEnabled()) {
                        continue;
                    }

                    const err = await ProfileInstallerProvider.instance.disableMod(mod, profile);
                    if (err instanceof R2Error) {
                        throw err;
                    }
                }

                // Update mod list status to mods.yml and Vuex.
                const updatedList = await ProfileModList.updateMods(mods, profile, (mod) => mod.disable());
                if (updatedList instanceof R2Error) {
                    throw updatedList;
                } else {
                    lastSuccessfulUpdate = updatedList;
                }
            } finally {
                if (lastSuccessfulUpdate !== undefined) {
                    dispatch('updateModList', lastSuccessfulUpdate, {root: true});
                }
            }

            // IDK but sounds important.
            if (lastSuccessfulUpdate !== undefined) {
                const err = await ConflictManagementProvider.instance.resolveConflicts(
                    lastSuccessfulUpdate,
                    profile
                );
                if (err instanceof R2Error) {
                    throw err;
                }
            }
        },
    },
}
