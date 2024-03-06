import { ActionTree, GetterTree } from 'vuex';

import { State as RootState } from '../index';
import R2Error from '../../model/errors/R2Error';
import ManifestV2 from '../../model/ManifestV2';
import Profile from "../../model/Profile";
import { SortDirection } from '../../model/real_enums/sort/SortDirection';
import { SortLocalDisabledMods } from '../../model/real_enums/sort/SortLocalDisabledMods';
import { SortNaming } from '../../model/real_enums/sort/SortNaming';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ConflictManagementProvider from '../../providers/generic/installing/ConflictManagementProvider';
import ThunderstoreDownloaderProvider from '../../providers/ror2/downloading/ThunderstoreDownloaderProvider';
import ProfileInstallerProvider from '../../providers/ror2/installing/ProfileInstallerProvider';
import ManagerSettings from '../../r2mm/manager/ManagerSettings';
import ModListSort from '../../r2mm/mods/ModListSort';
import ProfileModList from '../../r2mm/mods/ProfileModList';
import SearchUtils from '../../utils/SearchUtils';

interface State {
    activeProfile: Profile | null;
    modList: ManifestV2[];
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
        activeProfile: null,
        modList: [],
        order: undefined,
        direction: undefined,
        disabledPosition: undefined,
        searchQuery: '',
    }),

    getters: <GetterTree<State, RootState>>{
        activeProfile(state) {
            if (state.activeProfile !== null) {
                return state.activeProfile;
            }

            console.warn("Called profile/activeProfile but profile is not set. Falling back to Profile provider.");
            const profile = Profile.getActiveProfile();

            if (profile !== undefined) {
                return profile;
            }

            console.warn("Called Profile.getActiveProfile but profile is not set. Falling back to Default profile.");
            return new Profile('Default');
        },

        activeProfileOrThrow(state): Profile {
            // Sanity check before attempting to alter the profile state.
            if (state.activeProfile === null) {
                throw new R2Error(
                    'No active profile found',
                    'Unable to modify mod list state when active profile is not set.'
                )
            }

            return state.activeProfile;
        },

        activeProfileName(_state, getters) {
            return getters.activeProfile.getProfileName();
        },

        modsWithUpdates(state, _getters, rootState): ThunderstoreCombo[] {
            return ThunderstoreDownloaderProvider.instance.getLatestOfAllToUpdate(
                state.modList,
                rootState.thunderstoreModList
            );
        },

        visibleModList(state, _getters, rootState): ManifestV2[] {
            let mods = [...state.modList];

            if (state.searchQuery) {
                const searchKeys = SearchUtils.makeKeys(state.searchQuery);
                mods = mods.filter(
                    (mod) => SearchUtils.isSearched(searchKeys, mod.getName(), mod.getDescription())
                );
            }

            if (!state.order || !state.direction || !state.disabledPosition) {
                console.warn("Called profile/visibleModList before settings were loaded. Did you forget to call loadOrderingSettings action?");
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
        // Use updateActiveProfile action to ensure the persistent
        // settings are updated.
        setActiveProfile(state: State, profileName: string) {
            // Stores the active profile in Profile.ts.
            const profile = new Profile(profileName);

            state.activeProfile = profile;
        },

        // Avoid calling this directly, prefer updateModList action to
        // ensure TSMM specific code gets called.
        setModList(state: State, list: ManifestV2[]) {
            state.modList = list;
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
            {dispatch, getters},
            params: {
                mods: ManifestV2[],
                onProgress?: (mod: ManifestV2) => void,
            }
        ) {
            const profile = getters.activeProfileOrThrow;
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

                // Update mod list status to mods.yml.
                const updatedList = await ProfileModList.updateMods(mods, profile, (mod) => mod.disable());
                if (updatedList instanceof R2Error) {
                    throw updatedList;
                } else {
                    lastSuccessfulUpdate = updatedList;
                }
            } finally {
                // Update mod list stored in Vuex.
                if (lastSuccessfulUpdate !== undefined) {
                    dispatch('updateModList', lastSuccessfulUpdate);
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

        async loadLastSelectedProfile({commit, rootGetters}): Promise<string> {
            const profileName = rootGetters['settings'].getContext().gameSpecific.lastSelectedProfile;
            commit('setActiveProfile', profileName);
            return profileName;
        },

        async loadOrderingSettings({commit, rootGetters}) {
            const settings: ManagerSettings = rootGetters['settings'];
            commit('setOrder', settings.getInstalledSortBy());
            commit('setDirection', settings.getInstalledSortDirection());
            commit('setDisabledPosition', settings.getInstalledDisablePosition());
        },

        async updateActiveProfile({commit, rootGetters}, profileName: string) {
            commit('setActiveProfile', profileName);
            rootGetters['settings'].setProfile(profileName);
        },

        async updateDirection({commit, rootGetters}, value: SortDirection) {
            commit('setDirection', value);
            rootGetters['settings'].setInstalledSortDirection(value);
        },

        async updateDisabledPosition({commit, rootGetters}, value: SortLocalDisabledMods) {
            commit('setDisabledPosition', value);
            rootGetters['settings'].setInstalledDisablePosition(value);
        },

        async updateModList({commit}, modList: ManifestV2[]) {
            commit('setModList', modList);
        },

        async updateOrder({commit, rootGetters}, value: SortNaming) {
            commit('setOrder', value);
            rootGetters['settings'].setInstalledSortBy(value);
        },
    },
}
