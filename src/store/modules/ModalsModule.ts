import ManifestV2 from "../../model/ManifestV2";
import ThunderstoreMod from "../../model/ThunderstoreMod";

interface State {
    associatedModsModalMod: ManifestV2 | null;
    disableModModalMod: ManifestV2 | null;
    downloadModModalMod: ThunderstoreMod | null;
    isAssociatedModsModOpen: boolean;
    isCategoryFilterModalOpen: boolean;
    isDisableModModalOpen: boolean;
    isDownloadModModalOpen: boolean;
    isGameRunningModalOpen: boolean;
    isUninstallModModalOpen: boolean;
    uninstallModModalMod: ManifestV2 | null;
}

export default {
    state: (): State => ({
        associatedModsModalMod: null,
        disableModModalMod: null,
        downloadModModalMod: null,
        isAssociatedModsModOpen: false,
        isCategoryFilterModalOpen: false,
        isDisableModModalOpen: false,
        isDownloadModModalOpen: false,
        isGameRunningModalOpen: false,
        isUninstallModModalOpen: false,
        uninstallModModalMod: null,
    }),

    mutations: {
        closeAssociatedModsModal: function(state: State): void {
            state.isAssociatedModsModOpen = false;
            state.associatedModsModalMod = null;
        },

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

        closeUninstallModModal: function(state: State): void {
            state.isUninstallModModalOpen = false;
            state.uninstallModModalMod = null;
        },

        openAssociatedModsModal: function(state: State, mod: ManifestV2): void {
            state.associatedModsModalMod = mod;
            state.isAssociatedModsModOpen = true;
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

        openUninstallModModal: function(state: State, mod: ManifestV2): void {
            state.uninstallModModalMod = mod;
            state.isUninstallModModalOpen = true;
        },

        openUpdateAllModsModal: function(state: State): void {
            state.downloadModModalMod = null;
            state.isDownloadModModalOpen = true;
        }
    }
}
