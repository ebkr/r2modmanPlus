interface State {
    profileList: string[];
}

/**
 * State for Profiles, i.e. list for profiles in a single game/community.
 */
export default {
    namespaced: true,

    state: (): State => ({
        profileList: ['Default'],
    }),
    mutations: {
        pushToProfileList(state: State, profile: string) {
            state.profileList.push(profile);
        },
        spliceProfileList(state: State, index: number) {
            state.profileList.splice(index, 1);
        },
        setProfileList(state: State, list: string[]) {
            state.profileList = list;
        },
    },
}
