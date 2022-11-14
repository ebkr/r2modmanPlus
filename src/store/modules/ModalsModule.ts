interface State {
    isGameRunningModalOpen: boolean;
}

export default {
    state: (): State => ({
        isGameRunningModalOpen: false,
    }),

    mutations: {
        closeGameRunningModal: function(state: State): void {
            state.isGameRunningModalOpen = false;
        },

        openGameRunningModal: function(state: State): void {
            state.isGameRunningModalOpen = true;
        }
    }
}
