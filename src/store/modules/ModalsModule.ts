import ThunderstoreMod from "../../model/ThunderstoreMod";

interface State {
    downloadModModalMod: ThunderstoreMod | null;
    isCategoryFilterModalOpen: boolean;
    isDownloadModModalOpen: boolean;
    isGameRunningModalOpen: boolean;
}

export default {
    state: (): State => ({
        downloadModModalMod: null,
        isCategoryFilterModalOpen: false,
        isDownloadModModalOpen: false,
        isGameRunningModalOpen: false,
    }),

    mutations: {
        closeCategoryFilterModal: function(state: State): void {
            state.isCategoryFilterModalOpen = false;
        },

        closeDownloadModModal: function(state: State): void {
            state.isDownloadModModalOpen = false;
            state.downloadModModalMod = null;
        },

        closeGameRunningModal: function(state: State): void {
            state.isGameRunningModalOpen = false;
        },

        openCategoryFilterModal: function(state: State): void {
            state.isCategoryFilterModalOpen = true;
        },

        openDownloadModModal: function(state: State, mod: ThunderstoreMod): void {
            state.downloadModModalMod = mod;
            state.isDownloadModModalOpen = true;
        },

        openGameRunningModal: function(state: State): void {
            state.isGameRunningModalOpen = true;
        },

        openUpdateAllModsModal: function(state: State): void {
            state.downloadModModalMod = null;
            state.isDownloadModModalOpen = true;
        }
    }
}
