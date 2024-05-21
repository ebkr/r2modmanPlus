import FileUtils from "../../utils/FileUtils";
import R2Error from "../../model/errors/R2Error";
import { ActionTree } from "vuex";
import { State as RootState } from "../../store";
import Profile from "../../model/Profile";
import FsProvider from "../../providers/generic/file/FsProvider";

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
    },
    actions: <ActionTree<State, RootState>>{
        async removeSelectedProfile({rootGetters, state, dispatch}) {
            const activeProfile: Profile = rootGetters['profile/activeProfile'];
            const path = activeProfile.getPathOfProfile();
            const profileName = activeProfile.getProfileName();

            try {
                await FileUtils.emptyDirectory(path);
                await FsProvider.instance.rmdir(path);
            } catch (e) {
                throw R2Error.fromThrownValue(e, 'Error whilst deleting profile from disk');
            }

            state.profileList = state.profileList.filter((p: string) => p !== profileName ||p === 'Default')
            await dispatch('setSelectedProfile', { profileName: 'Default', prewarmCache: true });
        },

        async setSelectedProfile({rootGetters, state, dispatch}, params: { profileName: string, prewarmCache: boolean }) {
            await dispatch('profile/updateActiveProfile', params.profileName, { root: true });

            if (params.prewarmCache) {
                await dispatch('profile/updateModListFromFile', null, { root: true });
                await dispatch('tsMods/prewarmCache', null, { root: true });
            }
        },
    },
}
