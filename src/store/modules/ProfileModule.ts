import { ActionTree, GetterTree } from 'vuex';

import { CachedMod } from './TsModsModule';
import { State as RootState } from '../index';
import ManagerInformation from '../../_managerinf/ManagerInformation';
import R2Error from '../../model/errors/R2Error';
import ManifestV2 from '../../model/ManifestV2';
import Profile, { ImmutableProfile } from "../../model/Profile";
import { SortDirection } from '../../model/real_enums/sort/SortDirection';
import { SortLocalDisabledMods } from '../../model/real_enums/sort/SortLocalDisabledMods';
import { SortNaming } from '../../model/real_enums/sort/SortNaming';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import ConflictManagementProvider from '../../providers/generic/installing/ConflictManagementProvider';
import GameDirectoryResolverProvider from '../../providers/ror2/game/GameDirectoryResolverProvider';
import ProfileInstallerProvider from '../../providers/ror2/installing/ProfileInstallerProvider';
import ManagerSettings from '../../r2mm/manager/ManagerSettings';
import * as PackageDb from '../../r2mm/manager/PackageDexieStore';
import ModListSort from '../../r2mm/mods/ModListSort';
import ProfileModList from '../../r2mm/mods/ProfileModList';
import SearchUtils from '../../utils/SearchUtils';

interface State {
    activeProfile: Profile | null;
    expandedByDefault: boolean;
    funkyMode: boolean;
    modList: ManifestV2[];
    order?: SortNaming;
    direction?: SortDirection;
    disabledPosition?: SortLocalDisabledMods;
    searchQuery: string;
    dismissedUpdateAll: boolean;
}

/**
 * State for LocalModList, i.e. list for mods in a single profile.
 */
export default {
    namespaced: true,

    state: (): State => ({
        activeProfile: null,
        expandedByDefault: false,
        funkyMode: false,
        modList: [],
        order: undefined,
        direction: undefined,
        disabledPosition: undefined,
        searchQuery: '',
        dismissedUpdateAll: false,
    }),

    getters: <GetterTree<State, RootState>>{
        activeProfile(state) {
            if (state.activeProfile !== null) {
                return state.activeProfile;
            }

            console.debug("Called profile/activeProfile but profile is not set. Falling back to Profile provider.");
            const profile = Profile.getActiveProfile();

            if (profile !== undefined) {
                return profile;
            }

            console.debug("Called Profile.getActiveProfile but profile is not set. Falling back to Default profile.");
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

        // For easier access from other Vuex submodules.
        modList(state) {
            return state.modList;
        },

        // Swap the ManifestV2s to ThunderstoreMods as the latter knows the version number
        // of the latest version, which we need when showing how mods will be updated.
        modsWithUpdates(state, _getters, _rootState, rootGetters): ThunderstoreMod[] {
            return state.modList.map((mod): CachedMod => rootGetters['tsMods/cachedMod'](mod))
                                .filter(cachedMod => !cachedMod.isLatest && cachedMod.tsMod)
                                .map(cachedMod => cachedMod.tsMod!);
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
        reset(state: State) {
            state.modList = [];
            state.order = undefined;
            state.direction = undefined;
            state.disabledPosition = undefined;
            state.searchQuery = '';
            state.dismissedUpdateAll = false;
        },

        dismissUpdateAll(state: State) {
            state.dismissedUpdateAll = true;
        },

        // Use updateActiveProfile action to ensure the persistent
        // settings are updated.
        setActiveProfile(state: State, profileName: string) {
            // Stores the active profile in Profile.ts.
            const profile = new Profile(profileName);

            state.activeProfile = profile;
        },

        setExpandedByDefault(state: State, value: boolean) {
            state.expandedByDefault = value;
        },

        setFunkyMode(state: State, value: boolean) {
            state.funkyMode = value;
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
            const profile = getters.activeProfileOrThrow.asImmutableProfile();
            await dispatch('disableModsFromProfile', {...params, profile});
        },

        async disableModsFromProfile(
            {dispatch},
            params: {
                mods: ManifestV2[],
                profile: ImmutableProfile,
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
                    await dispatch('updateModList', lastSuccessfulUpdate);
                }
            }

            await dispatch('resolveConflicts', {mods: lastSuccessfulUpdate, profile});
        },

        async enableModsOnActiveProfile(
            {dispatch, getters},
            params: {
                mods: ManifestV2[],
                onProgress?: (mod: ManifestV2) => void,
            }
        ) {
            const profile = getters.activeProfileOrThrow.asImmutableProfile();
            await dispatch('enableModsOnProfile', {...params, profile});
        },

        async enableModsOnProfile(
            {dispatch},
            params: {
                mods: ManifestV2[],
                profile: ImmutableProfile,
                onProgress?: (mod: ManifestV2) => void,
            }
        ) {
            const {mods, profile, onProgress} = params;
            let lastSuccessfulUpdate: ManifestV2[] | undefined;

            try {
                // Enable mods on disk.
                for (const mod of mods) {
                    onProgress && onProgress(mod);

                    if (mod.isEnabled()) {
                        continue;
                    }

                    const err = await ProfileInstallerProvider.instance.enableMod(mod, profile);
                    if (err instanceof R2Error) {
                        throw err;
                    }
                }

                // Update mod list status to mods.yml.
                const updatedList = await ProfileModList.updateMods(mods, profile, (mod) => mod.enable());
                if (updatedList instanceof R2Error) {
                    throw updatedList;
                } else {
                    lastSuccessfulUpdate = updatedList;
                }
            } finally {
                // Update mod list stored in Vuex.
                if (lastSuccessfulUpdate !== undefined) {
                    await dispatch('updateModList', lastSuccessfulUpdate);
                }
            }

            await dispatch('resolveConflicts', {mods: lastSuccessfulUpdate, profile});
        },

        // Return ThunderstoreCombos pointing to the latest available version.
        async getCombosWithUpdates({getters, rootState}): Promise<ThunderstoreCombo[]> {
            const game = rootState.activeGame;
            const outdated = getters.modsWithUpdates.map((mod: ThunderstoreMod) => mod.getLatestDependencyString());
            const useLatestVersion = true;

            return await PackageDb.getCombosByDependencyStrings(game, outdated, useLatestVersion);
        },

        async generateTroubleshootingString({dispatch, getters, rootGetters, rootState}): Promise<string> {
            const steamDirectory = await GameDirectoryResolverProvider.instance.getSteamDirectory();
            const steamPath = steamDirectory instanceof R2Error ? '-' : steamDirectory;
            const gameDirectory = await GameDirectoryResolverProvider.instance.getDirectory(rootState.activeGame);
            const gamePath = gameDirectory instanceof R2Error ? '-' : gameDirectory;
            const packageCacheDate = await PackageDb.getLastPackageListUpdateTime(rootState.activeGame.internalFolderName);
            const packageCacheSize = await PackageDb.getPackageCount(rootState.activeGame.internalFolderName);
            const packageVuexState: string = await dispatch('tsMods/generateTroubleshootingString', null, {root: true});

            const content = `
                App: ${ManagerInformation.APP_NAME} v${ManagerInformation.VERSION}
                Game: ${rootState.activeGame.displayName} (${rootState.activeGame.activePlatform.storePlatform})
                Steam path: ${steamPath}
                Game path: ${gamePath}
                Profile path: ${getters.activeProfile.getProfilePath()}
                Custom launch arguments: ${rootGetters.settings.getContext().gameSpecific.launchParameters || '-'}
                Mod list in cache: ${packageCacheSize} mods, hash updated ${packageCacheDate || 'never'}
                Mod list in memory: ${packageVuexState}
            `;
            return content.replace(/(\n)\s+/g, '$1');  // Remove indentation but keep newlines
        },

        async loadLastSelectedProfile({commit, rootGetters}): Promise<string> {
            const profileName = rootGetters['settings'].getContext().gameSpecific.lastSelectedProfile;
            commit('setActiveProfile', profileName);
            return profileName;
        },

        async loadModCardSettings({commit, rootGetters}) {
            const settings: ManagerSettings = rootGetters['settings'];
            commit('setExpandedByDefault', settings.getContext().global.expandedCards);
            commit('setFunkyMode', settings.getContext().global.funkyModeEnabled);
        },

        async loadOrderingSettings({commit, rootGetters}) {
            const settings: ManagerSettings = rootGetters['settings'];
            commit('setOrder', settings.getInstalledSortBy());
            commit('setDirection', settings.getInstalledSortDirection());
            commit('setDisabledPosition', settings.getInstalledDisablePosition());
        },

        async resolveConflicts(
            {},
            params: {
                mods: ManifestV2[] | undefined,
                profile: ImmutableProfile,
            }
        ) {
            const {mods, profile} = params;
            if (mods === undefined) return;

            const err = await ConflictManagementProvider.instance.resolveConflicts(mods, profile);

            if (err instanceof R2Error) throw err;
        },

        async saveModListToDisk(
            {dispatch, getters},
            params: {
                mods: ManifestV2[],
                profile: ImmutableProfile,
            }
        ) {
            const {mods, profile} = params;

            // Sanity check against race conditions. E.g. using the text filter
            // disables ordering, but if the user is fast enough they can start
            // dragging a mod after writing into input. If the dragging is then
            // finished succesfully after the filter is applied, mods.yml would
            // be overwritten to contain only the visible, filtered mods.
            if (!getters['canSortMods']) {
                return;
            }

            ProfileModList.requestLock(async () => {
                const err = await ProfileModList.saveModList(profile, mods);
                if (err instanceof R2Error) {
                    throw err;
                }

                await dispatch('updateModList', mods);
                await dispatch('resolveConflicts', params);
            });
        },

        // This will be called by background processes and will fail silently
        // if problems are encountered.
        async tryLoadModListFromDisk({dispatch, state}) {
            if (state.activeProfile === null) {
                return;
            }

            const modList = await ProfileModList.getModList(state.activeProfile.asImmutableProfile());

            if (!(modList instanceof R2Error)) {
                await dispatch('updateModList', modList);
            }
        },

        async uninstallModsFromActiveProfile(
            {dispatch, getters},
            params: {
                mods: ManifestV2[],
                onProgress?: (mod: ManifestV2) => void,
            }
        ) {
            const profile = getters.activeProfileOrThrow.asImmutableProfile();
            await dispatch('uninstallModsFromProfile', {...params, profile});
        },

        async uninstallModsFromProfile(
            {dispatch},
            params: {
                mods: ManifestV2[],
                profile: ImmutableProfile,
                onProgress?: (mod: ManifestV2) => void,
            }
        ) {
            const {mods, profile, onProgress} = params;
            let lastSuccessfulUpdate: ManifestV2[] | undefined;

            try {
                for (const mod of mods) {
                    onProgress && onProgress(mod);

                    // Remove mods from disk.
                    const err = await ProfileInstallerProvider.instance.uninstallMod(mod, profile);
                    if (err instanceof R2Error) {
                        throw err;
                    }

                    // Update mod list status to mods.yml.
                    // TODO: can performance be improved by implementing
                    // a .removeMods(mods, profile) and calling it once outside the loop?
                    const updatedList = await ProfileModList.removeMod(mod, profile);
                    if (updatedList instanceof R2Error) {
                        throw updatedList;
                    } else {
                        lastSuccessfulUpdate = updatedList;
                    }
                }
            } finally {
                // Update mod list stored in Vuex.
                if (lastSuccessfulUpdate !== undefined) {
                    await dispatch('updateModList', lastSuccessfulUpdate);
                }
            }

            await dispatch('resolveConflicts', {mods: lastSuccessfulUpdate, profile});
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

        /*** Read profiles mod list from mods.yml in profile directory. */
        async updateModListFromFile({dispatch, getters}) {
            const profile: Profile = getters['activeProfile'];
            const mods = await ProfileModList.getModList(profile.asImmutableProfile());

            if (mods instanceof R2Error) {
                throw mods;
            }

            await dispatch('updateModList', mods);
        },

        async updateOrder({commit, rootGetters}, value: SortNaming) {
            commit('setOrder', value);
            rootGetters['settings'].setInstalledSortBy(value);
        },
    },
}
