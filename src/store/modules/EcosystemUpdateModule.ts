import { ActionTree, GetterTree, MutationTree } from 'vuex';

import { State as RootState } from '../../store';

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
            return state.error.message || "Failed to update game list";
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
        async simulateUpdate({ commit }, { fail = false, duration = 3000 } = {}) {
            commit('startUpdate');

            await new Promise<void>((resolve) => setTimeout(resolve, duration));

            if (fail) {
                commit('setError', new Error("Simulated ecosystem update failure"));
            }
            commit('finishUpdate');
        },
    },
};
