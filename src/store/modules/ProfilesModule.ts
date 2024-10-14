import FileUtils from "../../utils/FileUtils";
import R2Error from "../../model/errors/R2Error";
import { ActionTree } from "vuex";
import { State as RootState } from "../../store";
import Profile from "../../model/Profile";
import FsProvider from "../../providers/generic/file/FsProvider";
import path from "path";

interface State {
    profileList: string[];
}

/**
 * State for Profiles, i.e. list for profiles in a single game/community.
 */
export const ProfilesModule = {
    namespaced: true,

    state: (): State => ({
        profileList: ['Default'],
    }),
    mutations: {
        setProfileList(state: State, profileList: string[]) {
            state.profileList = profileList;
        },
        reset(state: State) {
            state.profileList = ['Default'];
        },
    },
    actions: <ActionTree<State, RootState>>{
        async addProfile({rootGetters, state, dispatch}, name: string) {
            try {
                await dispatch('setSelectedProfile', { profileName: name, prewarmCache: true });
                await dispatch('updateProfileList');
            } catch (e) {
                throw R2Error.fromThrownValue(e, 'Error whilst creating a profile');
            }
        },

        async removeSelectedProfile({rootGetters, state, dispatch}) {
            const activeProfile: Profile = rootGetters['profile/activeProfile'];
            const path = activeProfile.getProfilePath();
            const profileName = activeProfile.getProfileName();

            try {
                await FileUtils.emptyDirectory(path);
                await FsProvider.instance.rmdir(path);
            } catch (e) {
                throw R2Error.fromThrownValue(e, 'Error whilst deleting profile from disk');
            }

            state.profileList = state.profileList.filter((p: string) => p !== profileName || p === 'Default')
            await dispatch('setSelectedProfile', { profileName: 'Default', prewarmCache: true });
        },

        async setSelectedProfile({rootGetters, state, dispatch}, params: { profileName: string, prewarmCache: boolean }) {
            await dispatch('profile/updateActiveProfile', params.profileName, { root: true });

            if (params.prewarmCache) {
                await dispatch('profile/updateModListFromFile', null, { root: true });
                await dispatch('tsMods/prewarmCache', null, { root: true });
            }
        },

        async renameProfile({commit, rootGetters, state, dispatch}, params: { newName: string }) {
            const activeProfile: Profile = rootGetters['profile/activeProfile'];
            const oldName = activeProfile.getProfileName();

            try {
                await FsProvider.instance.rename(
                    path.join(Profile.getRootDir(), oldName),
                    path.join(Profile.getRootDir(), params.newName)
                );
            } catch (e) {
                throw R2Error.fromThrownValue(e, 'Error whilst renaming a profile on disk');
            }
            await dispatch('setSelectedProfile', { profileName: params.newName, prewarmCache: false });
            await dispatch('updateProfileList');
        },

        async updateProfileList({commit, rootGetters}) {
            const profilesDirectory = Profile.getRootDir();

            let profilesDirectoryContents = await FsProvider.instance.readdir(profilesDirectory);
            let promises = profilesDirectoryContents.map(async function(file) {
                return ((await FsProvider.instance.stat(path.join(profilesDirectory, file))).isDirectory() && file.toLowerCase() !== 'default' && file.toLowerCase() !== "_profile_update")
                    ? file : undefined;
            });
            Promise.all(promises).then((profileList) => {
                commit('setProfileList', ["Default", ...profileList.filter(file => file)].sort());
            })
        },
    }
}
