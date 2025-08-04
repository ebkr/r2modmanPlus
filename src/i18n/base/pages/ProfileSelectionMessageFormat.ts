export type ProfileSelectionMessageFormat = {
    pageTitle: {
        title: string;
        subtitle: string;
    },
    actions: {
        backToGameSelection: string;
        select: string;
        rename: string;
        create: string;
        import: string;
        delete: string;
    },
    error: {
        selectProfile: string;
        updateProfileList: string;
    },
    createProfileModal: {
    },
    deleteProfileModal: {
    },
    renameProfileModal: {
    },
    importProfileModal: {
    }
}
