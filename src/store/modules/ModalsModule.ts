import ManifestV2 from "../../model/ManifestV2";
import ThunderstoreMod from "../../model/ThunderstoreMod";

interface State {
    associatedModsModalMod: ManifestV2 | null;
    disableModModalMod: ManifestV2 | null;
    downloadModalMod: ThunderstoreMod | null;
    isAssociatedModsModOpen: boolean;
    isCategoryFilterModalOpen: boolean;
    isOnlineSortModalOpen: boolean;
    isCreateProfileModalOpen: boolean;
    isDeleteProfileModalOpen: boolean;
    isDisableModModalOpen: boolean;
    isDownloadModVersionSelectModalOpen: boolean;
    isDownloadProgressModalOpen: boolean;
    isGameRunningModalOpen: boolean;
    isImportProfileModalOpen: boolean;
    isRenameProfileModalOpen: boolean;
    isUninstallModModalOpen: boolean;
    isUpdateAllModsModalOpen: boolean;
    uninstallModModalMod: ManifestV2 | null;
    isProfileManagementModalOpen: boolean;
    isProfileCodeExportModalOpen: boolean;
    isLocalFileImportModalOpen: boolean;
    vulnerableModToReview: ManifestV2 | null;
    isVulnerableModReviewModalOpen: boolean;
}

export default {
    state: (): State => ({
        associatedModsModalMod: null,
        disableModModalMod: null,
        downloadModalMod: null,
        isAssociatedModsModOpen: false,
        isCategoryFilterModalOpen: false,
        isOnlineSortModalOpen: false,
        isCreateProfileModalOpen: false,
        isDeleteProfileModalOpen: false,
        isDisableModModalOpen: false,
        isDownloadModVersionSelectModalOpen: false,
        isDownloadProgressModalOpen: false,
        isGameRunningModalOpen: false,
        isImportProfileModalOpen: false,
        isRenameProfileModalOpen: false,
        isUninstallModModalOpen: false,
        isUpdateAllModsModalOpen: false,
        uninstallModModalMod: null,
        isProfileManagementModalOpen: false,
        isProfileCodeExportModalOpen: false,
        isLocalFileImportModalOpen: false,
        vulnerableModToReview: null,
        isVulnerableModReviewModalOpen: false,
    }),

    mutations: {
        closeAssociatedModsModal: function(state: State): void {
            state.isAssociatedModsModOpen = false;
            state.associatedModsModalMod = null;
        },

        closeCategoryFilterModal: function(state: State): void {
            state.isCategoryFilterModalOpen = false;
        },

        closeOnlineSortModal: function(state: State): void {
            state.isOnlineSortModalOpen = false;
        },

        closeCreateProfileModal: function(state: State): void {
            state.isCreateProfileModalOpen = false;
        },

        closeDeleteProfileModal: function(state: State): void {
            state.isDeleteProfileModalOpen = false;
        },

        closeDisableModModal: function(state: State): void {
            state.isDisableModModalOpen = false;
            state.disableModModalMod = null;
        },

        closeDownloadModVersionSelectModal: function(state: State): void {
            state.isDownloadModVersionSelectModalOpen = false;
            state.downloadModalMod = null;
        },

        closeDownloadProgressModal: function(state: State): void {
            state.isDownloadProgressModalOpen = false;
        },

        closeGameRunningModal: function(state: State): void {
            state.isGameRunningModalOpen = false;
        },

        closeImportProfileModal: function(state: State): void {
            state.isImportProfileModalOpen = false;
        },

        closeRenameProfileModal: function(state: State): void {
            state.isRenameProfileModalOpen = false;
        },

        closeUninstallModModal: function(state: State): void {
            state.isUninstallModModalOpen = false;
            state.uninstallModModalMod = null;
        },

        closeUpdateAllModsModal: function(state: State): void {
            state.isUpdateAllModsModalOpen = false;
        },

        closeProfileManagementModal: function(state: State): void {
            state.isProfileManagementModalOpen = false;
        },

        closeProfileCodeExportModal: function(state: State): void {
            state.isProfileCodeExportModalOpen = false;
        },

        closeLocalFileImportModal: function(state: State): void {
            state.isLocalFileImportModalOpen = false;
        },

        closeVulnerableModReviewModal: function(state: State): void {
            state.isVulnerableModReviewModalOpen = false;
        },

        openAssociatedModsModal: function(state: State, mod: ManifestV2): void {
            state.associatedModsModalMod = mod;
            state.isAssociatedModsModOpen = true;
        },

        openCategoryFilterModal: function(state: State): void {
            state.isCategoryFilterModalOpen = true;
        },

        openOnlineSortModal: function(state: State): void {
            state.isOnlineSortModalOpen = true;
        },

        openCreateProfileModal: function(state: State): void {
            state.isCreateProfileModalOpen = true;
        },

        openDeleteProfileModal: function(state: State): void {
            state.isDeleteProfileModalOpen = true;
        },

        openDisableModModal: function(state: State, mod: ManifestV2): void {
            state.disableModModalMod = mod;
            state.isDisableModModalOpen = true;
        },

        openDownloadModVersionSelectModal: function(state: State, mod: ThunderstoreMod): void {
            state.downloadModalMod = mod;
            state.isDownloadModVersionSelectModalOpen = true;
        },

        openDownloadProgressModal: function(state: State): void {
            state.isDownloadProgressModalOpen = true;
        },

        openGameRunningModal: function(state: State): void {
            state.isGameRunningModalOpen = true;
        },

        openImportProfileModal: function(state: State): void {
            state.isImportProfileModalOpen = true;
        },

        openRenameProfileModal: function(state: State): void {
            state.isRenameProfileModalOpen = true;
        },

        openUninstallModModal: function(state: State, mod: ManifestV2): void {
            state.uninstallModModalMod = mod;
            state.isUninstallModModalOpen = true;
        },

        openUpdateAllModsModal: function(state: State): void {
            state.isUpdateAllModsModalOpen = true;
        },

        openProfileManagementModal: function(state: State): void {
            state.isProfileManagementModalOpen = true;
        },

        openProfileCodeExportModal: function(state: State): void {
            state.isProfileCodeExportModalOpen = true;
        },

        openLocalFileImportModal: function(state: State): void {
            state.isLocalFileImportModalOpen = true;
        },

        openVulnerableModReviewModal: function(state: State, mod: ManifestV2): void {
            state.vulnerableModToReview = mod;
            state.isVulnerableModReviewModalOpen = true;
        },
    }
}
