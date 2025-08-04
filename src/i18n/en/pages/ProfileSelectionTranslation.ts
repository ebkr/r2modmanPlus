import {ProfileSelectionMessageFormat} from "../../base/pages/ProfileSelectionMessageFormat";

export const ProfileSelectionTranslation: ProfileSelectionMessageFormat = {
    pageTitle: {
        title: 'Profile selection',
        subtitle: 'Profiles help to organise mods easily'
    },
    actions: {
        backToGameSelection: 'Back to game selection',
        select: 'Select',
        rename: 'Rename',
        create: 'Create new',
        import: 'Import / Update',
        delete: 'Delete',
    },
    error: {
        selectProfile: 'Error whilst selecting profile',
        updateProfileList: 'Error whilst updating profile list'
    },
    createProfileModal: {
        title: 'Create a profile',
        description: 'This profile will store its own mods independently from other profiles.',
        tagStates: {
            required: 'You must enter a profile name',
            valid: '"{profileName}" is a valid profile name',
            error: '"{profileName}" is either already in use or contains invalid characters'
        },
        actions: {
            create: 'Create'
        }
    },
    deleteProfileModal: {
        title: 'Delete profile',
        content: {
            resultingAction: 'This will remove all mods, and their config files, installed within this profile.',
            preventAction: 'If this was an accident, click either the darkened area, or the cross inside located in the top right.',
            confirmation: 'Are you sure you\'d like to delete this profile?',
        },
        action: {
            delete: 'Delete profile',
        }
    },
    renameProfileModal: {
    },
    importProfileModal: {
    }
}
