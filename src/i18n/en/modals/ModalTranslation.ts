import { ModalMessageFormat } from '../../base/modals/ModalMessageFormat';

export const ModalTranslation: ModalMessageFormat = {
    failedToSetSteamFolder: {
        title: 'Failed to set the Steam folder',
        steamExecutableNotSelected: 'The steam executable was not selected.',
        solution: 'If this error has appeared but the executable is correct, please run as administrator.'
    },
    failedToSetTheGameFolder: {
        title: 'Failed to set the {gameName} folder',
        listedExecutableNames: 'The executable must be either of the following: "{options}".',
        executableMustBeOneOf: 'The selected executable must be any of the following:',
        solution: 'If this error has appeared but the executable is correct, please run as administrator.'
    },
    clearingGameDirectory: {
        title: 'Clearing the {gameName} installation directory',
        waitToLaunchGame: `
            You will not be able to launch the game until
            Steam has verified the integrity of the game files.
            `,
        steamWillBeStarted: `
            Steam will be started and will attempt to verify the
            integrity of {gameName}.
            `,
        checkSteamForProgress: `
            Please check the Steam window for validation progress.
            If the window has not yet appeared, please be patient.
            `,
        confirmation: 'I understand'
    },
    dependencyStrings: {
        title: 'Dependency string list',
        dependency: '{modName}-{versionNumber}',
        close: 'Close'
    },
    launchArguments: {
        title: 'Set custom launch arguments',
        someProvidedByDefault: 'Some arguments are provided by default:',
        moddedLabel: 'Modded:',
        availableAfterInstallingLoader: 'These arguments will be available after installing a mod loader.',
        vanillaLabel: 'Vanilla:',
        pleaseNote: `
            Please note that these are called against the Steam executable.
            Be careful when entering custom launch arguments.
            `,
        placeholder: 'Enter arguments',
        updateArguments: 'Update launch arguments',
    },
    categorySelector: {
        selectCategory: 'Select a category',
        noCategoriesSelected: 'No categories selected',
    },
    importLocalMod: {
        title: 'Import mod from file',
        actions: {
            selectFile: 'Select file',
            importLocalMod: 'Import local mod',
        },
        content: {
            instructToSelect: 'Please select a zip or DLL to be imported.',
            dataEntryInfo: `
            Zip files that contain a manifest file will have some information pre-filled.
            If a manifest is not available, this will have to be entered manually.
            `,
            waitingForSelection: 'Waiting for file. This may take a minute.',
            form: {
                modName: {
                    label: 'Mod name',
                    placeholder: 'Enter the name of the mod',
                },
                modAuthor: {
                    label: 'Author',
                    placeholder: 'Enter the author name',
                },
                description: {
                    label: 'Description (optional)',
                    placeholder: 'Enter a description'
                },
                version: {
                    label: 'Version',
                    majorLabel: 'Major',
                    minorLabel: 'Minor',
                    patchLabel: 'Patch'
                }
            }
        },
        validationMessages: {
            modNameEmpty: 'The mod name must not be empty.',
            authorNameEmpty: 'The mod author must not be empty.',
            invalidVersion: 'Major, minor, and patch must be whole numbers greater than 0.',
            nonNumericVersion: 'Major, minor, and patch must all be numbers.',
            noProfileSelected: 'Profile is not selected.'
        }
    },
    concerningPackage: {
        title: 'Review {modName}',
        notFound: 'This mod was originally downloaded from Thunderstore, but can no longer be found on the site.',
        whyRemoved: 'Mods may be removed at the author\'s request, for rule violations, or while undergoing verification by moderators.',
        recommendation: 'It is generally recommended to remove mods that have been removed from Thunderstore.',
        exportWarning: 'Other people will be unable to import this mod from exported profiles.',
        actions: {
            markSafe: 'Mark version as safe',
            remove: 'Remove mod',
            review: 'Review mod',
        }
    },
    gameRunning: {
        starting: '{gameName} is starting',
        launchingViaSteam: '{gameName} is launching via Steam',
        closeToContinue: 'Close this message to continue modding.',
        takingAWhile: 'If this is taking a while, it\'s likely due to Steam starting.',
        bePatient: 'Please be patient, and have fun!',
        close: 'Close',
    },
    error: {
        title: 'Error',
        suggestion: 'Suggestion',
        close: 'Close',
    },
    disableMod: {
        title: 'Disabling {modName}',
        dependantsWarning: 'Other mods depend on this mod. Select {disableAllAction} to disable dependent mods, otherwise they may cause errors.',
        modsToBeDisabled: 'Mods to be disabled',
        actions: {
            disableAll: 'Disable all',
            disableAllRecommended: 'Disable all (recommended)',
            disableOnly: 'Disable {modName} only',
        }
    },
    uninstallMod: {
        title: 'Uninstalling {modName}',
        dependantsWarning: 'Other mods depend on this mod. Select {uninstallAllAction} to uninstall dependent mods, otherwise they may cause errors.',
        modsToBeUninstalled: 'Mods to be uninstalled',
        actions: {
            uninstallAll: 'Uninstall all',
            uninstallAllRecommended: 'Uninstall all (recommended)',
            uninstallOnly: 'Uninstall {modName} only',
        }
    },
    associatedMods: {
        title: 'Mods associated with {modName}',
        dependencies: 'Dependencies',
        dependants: 'Dependants',
        none: 'This mod has no dependencies or dependants.',
        done: 'Done',
    },
    codeExport: {
        title: 'Profile exported',
        description: 'Your code has been copied to your clipboard but may also be copied manually below:',
        done: 'Done',
    },
    downloadProgress: {
        states: {
            downloading: 'Downloading {modName}',
            installing: 'Installing {modName}',
        },
        complete: 'Download complete',
        close: 'Close',
        downloadProgress: 'Downloading: {progress}% of {totalSize}',
        installProgress: 'Installing: {progress}%',
        extractionProgress: 'Extracting: {progress}% of {totalSize}',
        waitingForDownload: 'Installing: waiting for download to finish',
    },
    downloadModVersionSelect: {
        title: 'Select a version of {modName} to download',
        content: {
            recommendedDisclaimer: 'It\'s recommended to select the latest version of all mods.',
            outdatedModsAdvice: 'Using outdated versions may cause problems.',
        },
        tags: {
            select: 'You must select a version',
            recommended: '{version} is the recommended version',
            latest: '{version} is the latest version',
            outdated: '{version} is an outdated version'
        },
        download: 'Download with dependencies',
    },
    updateAllInstalledMods: {
        noModsToUpdate: {
            title: 'No mods to update',
            content: 'Either all installed mods are up to date, or there are no installed mods.',
            close: 'Close',
        },
        hasModsToUpdate: {
            title: 'Update all installed mods',
            content: {
                willBeUpdated: 'All installed mods will be updated to their latest versions.',
                missingDependenciesInstalled: 'Any missing dependencies will be installed.',
                whatWillHappen: 'The following mods will be downloaded and installed:',
                modUpdatedTo: '{modName} will be updated to: {version}',
            },
            updateAll: 'Update all',
        }
    },
    launchType: {
        title: 'Set launch behaviour',
        auto: {
            NATIVE: 'Your game will be started using the "Native" option',
            PROTON: 'Your game will be started using the "Proton" option',
        },
        native: {
            unsureWrapperArgsPresent: 'We were unable to determine if the required wrapper arguments have been set.',
            addArgumentsInfo: 'If you have not yet done this manually, please add the following launch arguments to the game\'s properties on Steam:',
        },
        actions: {
            copyLaunchArgs: 'Copy launch arguments',
            update: 'Update'
        }
    },
    modFilter: {
        title: 'Filter mod categories',
        languageDisclaimer: 'Categories are provided Thunderstore and are unable to be translated.',
        selectors: {
            atLeastOneCategory: 'Mods must contain at least one of these categories',
            allCategories: 'Mods must contain all of these categories',
            noneCategories: 'Mods cannot contain any of these categories'
        },
        allowNsfw: 'Allow NSFW (potentially explicit) mods',
        showDeprecated: 'Show deprecated mods',
        apply: 'Apply filters'
    },
    sort: {
        title: 'Change the ordering of mods',
        sortBehaviour: 'Sort behaviour',
        sortDirection: 'Sort direction',
        close: 'Close',
    },
    createProfile: {
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
    deleteProfile: {
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
    renameProfile: {
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
    importProfile: {
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
                    loading: 'Loading',
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
                    downloadingModsWithGoal: `Downloading mods: {progress}% of {totalSize}`,
                    cleaningUp: 'Cleaning up',
                    applyChanges: 'Applying changes to updated profile',
                    copyingModsToProfile: 'Copying mods to profile: {progress}%',
                    copyingConfigsToProfile: 'Copying configs to profile: {progress}%'

                },
                content: {
                    waitMessage: 'This may take a while, as files are being downloaded, extracted, and copied.',
                    doNotClose: 'Please do not close {appName}.'
                }
            }
        }
    },
    platform: {
        header: "Which store manages your game?",
        selectAction: "Select platform",
    },
}
