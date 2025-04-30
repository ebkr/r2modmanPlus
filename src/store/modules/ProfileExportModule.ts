import R2Error from '../../model/errors/R2Error';
import ProfileModList from '../../r2mm/mods/ProfileModList';
import InteractionProvider from '../../providers/ror2/system/InteractionProvider';
import { ActionTree, MutationTree } from 'vuex';
import { State as RootState } from '../../store';

interface State {
    exportCode?: string;
}

export default {
    namespaced: true,

    state: (): State => ({
        exportCode: undefined,
    }),

    mutations: <MutationTree<State>>{
        reset(state: State) {
            state.exportCode = undefined;
        },

        setExportCode(state: State, code: string) {
            state.exportCode = code;
        },
    },

    actions: <ActionTree<State, RootState>>{

        async exportProfileAsFile({rootGetters}) {
            if (!rootGetters["profile/modList"].length) {
                throw new R2Error(
                    'Profile is empty',
                    'The profile must contain at least one mod to export it as a file.'
                );
            }
            const immutableProfile = rootGetters["profile/activeProfileOrThrow"].asImmutableProfile();
            const exportErr = await ProfileModList.exportModListToFile(immutableProfile);
            if (exportErr instanceof R2Error) {
                throw exportErr;
            }
        },

        async exportProfileAsCode({rootGetters, getters, commit}) {
            console.log(rootGetters, getters);
            if (!rootGetters["profile/modList"].length) {
                throw new R2Error(
                    'Profile is empty',
                    'The profile must contain at least one mod to export it as a file.'
                );
            }
            const immutableProfile = rootGetters["profile/activeProfileOrThrow"].asImmutableProfile();
            const exportErr = await ProfileModList.exportModListAsCode(immutableProfile, (code: string, err: R2Error | null) => {
                if (err !== null) {
                    throw err;
                } else {
                    InteractionProvider.instance.copyToClipboard(code);
                    commit('setExportCode', code);
                }
            });
            if (exportErr instanceof R2Error) {
                throw exportErr;
            }
            commit("openProfileCodeExportModal", null, {root: true});
            commit("openProfileCodeExportModal", null, {root: true});
        },

    }
}
