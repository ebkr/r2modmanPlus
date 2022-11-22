interface State {
    isCategoryFilterModalOpen: boolean;
    isGameRunningModalOpen: boolean;
}

export default {
    state: (): State => ({
        isCategoryFilterModalOpen: false,
        isGameRunningModalOpen: false,
    }),

    mutations: {
        closeCategoryFilterModal: function(state: State): void {
            state.isCategoryFilterModalOpen = false;
        },

        closeGameRunningModal: function(state: State): void {
            state.isGameRunningModalOpen = false;
        },

        openCategoryFilterModal: function(state: State): void {
            state.isCategoryFilterModalOpen = true;
        },

        openGameRunningModal: function(state: State): void {
            state.isGameRunningModalOpen = true;
        }
    }
}
