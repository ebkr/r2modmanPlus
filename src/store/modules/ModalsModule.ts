import ManifestV2 from "../../model/ManifestV2";
import ThunderstoreMod from "../../model/ThunderstoreMod";

interface State {
    disableModModalMod: ManifestV2 | null;
    downloadModModalMod: ThunderstoreMod | null;
    isCategoryFilterModalOpen: boolean;
    isDisableModModalOpen: boolean;
    isDownloadModModalOpen: boolean;
    isGameRunningModalOpen: boolean;
}

export default {
    state: (): State => ({
        disableModModalMod: null,
        downloadModModalMod: null,
        isCategoryFilterModalOpen: false,
        isDisableModModalOpen: false,
        isDownloadModModalOpen: false,
        isGameRunningModalOpen: false,
    }),

    mutations: {
        closeCategoryFilterModal: function(state: State): void {
            state.isCategoryFilterModalOpen = false;
        },

        closeDisableModModal: function(state: State): void {
            state.isDisableModModalOpen = false;
            state.disableModModalMod = null;
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

        openDisableModModal: function(state: State, mod: ManifestV2): void {
            state.disableModModalMod = mod;
            state.isDisableModModalOpen = true;
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
