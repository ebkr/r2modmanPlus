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
        title: string;
        description: string;
        tagStates: {
            required: string;
            valid: string;
            error: string;
        },
        actions: {
            create: string;
        }
    },
    deleteProfileModal: {
        title: string;
        content: {
            resultingAction: string;
            preventAction: string;
            confirmation: string;
        },
        action: {
            delete: string;
        }
    },
    renameProfileModal: {
    },
    importProfileModal: {
    }
}
