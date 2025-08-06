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
        actions: {
            delete: 'Delete profile',
        }
    },
    renameProfileModal: {
        title: 'Rename a profile',
        content: 'This profile will store its own mods independently from other profiles.',
        actions: {
            rename: 'Rename',
        },
        tagStates: {
            required: 'You must enter a profile name',
            valid: '"{profileName}" is a valid profile name',
            error: '"{profileName}" is either already in use or contains invalid characters'
        },
    },
    importProfileModal: {
        states: {
            fileCodeSelection: {
                title: 'How are you importing a profile?',
                actions: {
                    fromFile: 'From file',
                    fromCode: 'From code'
                }
            },
            fromFile: {
                title: 'Loading file',
                content: 'A file selection window will appear. Once a profile has been selected it may take a few moments.',
            },
            importCode: {
                title: 'Enter the profile code',
                enterCodePlaceholder: 'Enter the profile code',
                tagStates: {
                    invalid: 'Invalid code, check for typos',
                },
                actions: {
                    loading: 'Loading...',
                    proceed: 'Continue'
                }
            },
            refresh: {
                title: 'Refreshing online mod list',
                content: {
                    description: `
                    Some of the packages in the profile are not recognized by the mod manager.
                    Refreshing the online mod list might fix the problem. Please wait.
                    `,
                    waitingForModDownloads: 'Waiting for mod downloads to finish before refreshing the online mod list',
                    refreshStatus: {
                        checkingForUpdates: 'Checking for mod list updates from Thunderstore',
                        loadingLatestModList: 'Loading latest mod list from Thunderstore: {progress}%',
                        pruneCache: 'Pruning removed mods from local cache',
                        processingModList: 'Processing the mod list',
                        almostDone: 'Almost done',
                        resettingCache: 'Resetting mod list cache',
                    }
                }
            },
            reviewImport: {
                title: 'Packages to be installed',
                content: {
                    notFoundDisclaimer: 'These packages in the profile were not found on Thunderstore and will not be installed:',
                    ensureCorrectProfile: 'Ensure the profile is intended for the currently selected game.',
                    packagesWillBeInstalled: 'These packages will be installed:',
                },
                actions: {
                    acknowledgement: 'I understand that some of the mods won\'t be imported',
                    proceed: 'Import'
                }
            },
            willImportOrUpdate: {
                title: 'Are you going to be updating an existing profile or creating a new one?',
                actions: {
                    newProfile: 'Import new profile',
                    existingProfile: 'Update existing profile',
                }
            },
            addProfile: {
                title: 'Import a profile',
                content: {
                    create: {
                        description: 'This profile will store its own mods independently from other profiles.'
                    },
                    update: {
                        contentsWillBeOverwritten: 'All contents of the profile will be overwritten with the contents of the code/file.',
                        selectProfile: 'Select a profile below:'
                    }
                },
                tagStates: {
                    required: 'You must enter a profile name',
                    valid: '"{profileName}" is a valid profile name',
                    error: '"{profileName}" is either already in use or contains invalid characters'
                },
                actions: {
                    create: 'Create',
                    update: 'Update profile: {profileName}'
                }
            },
            importInProgress: {
                title: {
                    downloadingMods: 'Downloading mods: {progress}%',
                    cleaningUp: 'Cleaning up',
                    applyChanges: 'Applying changes to updated profile',
                    copyingModsToProfile: 'Copying mods to profile: {progress}%',
                    copyingConfigsToProfile: 'Copying configs to profile: {progress}%',
                },
                content: {
                    waitMessage: 'This may take a while, as files are being downloaded, extracted, and copied.',
                    doNotClose: 'Please do not close {appName}.'
                }
            }
        }
    }
}
