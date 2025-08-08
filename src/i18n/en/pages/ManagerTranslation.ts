import { ManagerMessageFormat } from '../../base/pages/ManagerMessageFormat';

export const ManagerTranslation: ManagerMessageFormat = {
    updateAvailable: {
        title: 'An update is available.',
        linkText: 'Click here to go to the release page.',
    },
    navigation: {
        gameActions: {
            startModded: 'Start modded',
            startVanilla: 'Start vanilla'
        },
        modsActions: {
            label: 'Mods',
            installed: 'Installed',
            online: 'Online'
        },
        otherActions: {
            label: 'Other',
            configEditor: 'Config editor',
            settings: 'Settings',
            help: 'Help',
        },
        profileSwitcher: {
            label: 'Profile',
            gameIconAltText: 'Game image'
        }
    },
    installed: {
        noModsInstalled: {
            title: 'Looks like you don\'t have any mods installed',
            content: 'You can click the Online tab on the left to browse all available mods.',
        },
        updatableModsBanner: {
            text: `
            You have {numberOfModsWithUpdates} mod with an update available. |
            You have {numberOfModsWithUpdates} mods with updates available.
            `,
            updateAction: 'Update all?'
        },
        searchAndSort: {
            search: {
                label: 'Search',
                placeholder: 'Search for an installed mod',
            },
            sort: {
                label: 'Sort',
                disabledPositions: {
                    label: 'Disabled',
                }
            }
        },
        localModCard: {
            labels: {
                deprecated: 'Deprecated',
                disabled: 'Disabled'
            },
            display: {
                byline: 'v{version} by {author}',
                installedAt: 'Installed on: {formattedDate}',
            },
            tooltips: {
                updateAvailable: 'An update is available',
                dependencyIssue: 'There is an issue with the dependencies for this mod',
                disable: 'Disable',
                enable: 'Enable',
                donate: 'Donate to the mod author',
            },
            actions: {
                uninstall: 'Uninstall',
                disable: 'Disable',
                enable: 'Enable',
                associated: 'Associated',
                openWebsite: 'Website',
                update: 'Update',
                downloadDependency: 'Download dependency',
                enableSpecific: 'Enable {dependencyName}',
                donate: 'Donate',
            }
        },
        expandableCard: {
            imageAltText: 'Mod image',
            funkyModeAltText: 'Funky mode overlay',
            tooltips: {
                dragToReorder: 'Drag to reorder',
                expand: 'Expand',
                collapse: 'Collapse',
            }
        },
    },
    modals: {
        failedToSetSteamFolder: {
            title: 'Failed to set the Steam folder',
            steamExecutableNotSelected: 'The steam executable was not selected.',
            solution: 'If this error has appeared but the executable is correct, please run as administrator.'
        },
        failedToSetTheGameFolder: {
            title: 'Failed to set the {gameName} folder',
            listedExecutableNames: 'The executable must be either of the following: "{options}".',
            solution: 'If this error has appeared but the executable is correct, please run as administrator.'
        },
        clearingGameDirectory: {
            title: 'Clearing the {gameName} installation directory',
            waitToLaunchGame: `
                You will not not be able to launch the game until
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
        }
    },
    online: {
        modals: {
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
                close: 'Close'
            }
        }
    }
}
