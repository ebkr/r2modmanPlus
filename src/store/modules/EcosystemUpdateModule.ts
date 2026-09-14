import { ActionTree, GetterTree, MutationTree } from 'vuex';

import { State as RootState } from '../../store';
import { updateLatestEcosystemSchema } from '../../r2mm/ecosystem/EcosystemSchema';

export interface EcosystemUpdateState {
    isInProgress: boolean;
    error: Error | undefined;
}

export const EcosystemUpdateModule = {
    namespaced: true,

    state: (): EcosystemUpdateState => ({
        isInProgress: false,
        error: undefined,
    }),

    getters: <GetterTree<EcosystemUpdateState, RootState>>{
        conciseEcosystemUpdateErrorMessage(state): string | undefined {
            if (!state.error) {
                return undefined;
            }

            return state.error.message;
        },
    },

    mutations: <MutationTree<EcosystemUpdateState>>{
        startUpdate(state) {
            state.isInProgress = true;
            state.error = undefined;
        },
        finishUpdate(state) {
            state.isInProgress = false;
        },
        setError(state, error: Error) {
            state.error = error instanceof Error ? error : new Error(String(error));
        },
    },

    actions: <ActionTree<EcosystemUpdateState, RootState>>{
        async updateEcosystemSchema({ commit, state }) {
            if (state.isInProgress) {
                return;
            }

            commit('startUpdate');

            try {
                await updateLatestEcosystemSchema();
            } catch (e) {
                commit('setError', e instanceof Error ? e : new Error(String(e)));
            } finally {
                commit('finishUpdate');
            }
        },
    },
};
