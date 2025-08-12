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
                Zip files that contain a manifest file will have the some information pre-filled.
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
            downloadProgress: 'Downloading: {progress}% complete',
            installProgress: 'Installing: {progress}% complete',
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
            },
        },
        previewPanel: {
            author: 'By {author}',
            metadata: {
                downloads: 'Downloads: {downloads}',
                likes: 'Likes: {likes}',
                lastUpdated: 'Last updated: {date}',
                categories: 'Categories: {categories}',
            },
            actions: {
                download: 'Download',
                viewOnline: 'View online',
                donate: 'Donate',
            },
            tabs: {
                readme: 'README',
                changelog: 'CHANGELOG',
                dependencies: 'Dependencies ({dependencyCount})',
            },
            fetchingData: 'Fetching data',
            noDependencies: 'This mod has no dependencies',
            unableToFetchReadme: 'Unable to fetch README',
            unableToFetchChangelog: 'Unable to fetch CHANGELOG',
        },
        topbar: {
            search: {
                label: 'Search',
                placeholder: 'Search',
            },
            sort: 'Sort',
            filter: 'Filter',
        },
        pagination: {
            changePageInfo: 'Use the numbers below to change page',
            noFoundMods: 'No mods matching search found',
            noMods: 'No mods available',
        },
        modList: {
            tooltips: {
                pinned: {
                    short: 'Pinned',
                    long: 'Pinned on Thunderstore'
                },
                deprecated: {
                    short: 'Deprecated',
                    long: 'This mod is potentially broken'
                },
                donate: 'Donate to the mod author',
                installed: 'Mod already installed',
            },
            mod: {
                author: 'By {author}'
            },
            actions: {
                download: 'Download',
                website: 'Website',
            }
        }
    },
    actions: {
        locateGameExecutable: 'Locate {gameName} executable',
        selectExecutable: 'Select Executable',
        locateGameLaunchHelper: 'Locate gamelaunchhelper Executable',
        locateSteamExecutable: 'Locate Steam Executable',
    }
}
