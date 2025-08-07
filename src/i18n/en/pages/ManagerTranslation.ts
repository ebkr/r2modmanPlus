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
                order: {
                    options: {
                        CUSTOM: 'Custom',
                        MOD_NAME: 'Mod name',
                        AUTHOR: 'Author name',
                        INSTALL_DATE: 'Install date'
                    }
                },
                directions: {
                    options: {
                        STANDARD: 'Standard',
                        REVERSE: 'Reverse'
                    }
                },
                disabledPositions: {
                    label: 'Disabled',
                    options: {
                        NONE: 'None',
                        CUSTOM: 'Custom',
                        FIRST: 'First',
                        LAST: 'Last',
                    }
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
        }
    }
}
