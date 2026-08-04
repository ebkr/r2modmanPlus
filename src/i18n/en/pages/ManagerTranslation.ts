import { ManagerMessageFormat } from '../../base/pages/ManagerMessageFormat';

export const ManagerTranslation: ManagerMessageFormat = {
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
            gameIconAltText: 'Game image',
            close: 'Close',
        },
        activityBar: {
            exportProfile: 'Export profile',
            exportToCode: 'Export to code',
            exportToFile: 'Export to file',
        }
    },
    installed: {
        noModsInstalled: {
            title: 'Looks like you don\'t have any mods installed',
            content: 'You can click the Online tab on the left to browse all available mods.',
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
                releasedAt: 'Released on: {formattedDate}',
            },
            concerning: {
                recommendation: 'It is recommended that you remove this mod.',
            },
            tooltips: {
                updateAvailable: 'An update is available',
                dependencyIssue: 'There is an issue with the dependencies for this mod',
                disable: 'Disable',
                enable: 'Enable',
                donate: 'Donate to the mod author',
                willNotBeUsed: 'This mod will not be used in-game',
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
    online: {
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
            packageInformation: 'Package information',
            nsfwWarning: 'This mod may contain potentially explicit material',
            fetchingData: 'Fetching data',
            noDependencies: 'This mod has no dependencies',
            unableToFetchReadme: 'Unable to fetch README',
            unableToFetchChangelog: 'Unable to fetch CHANGELOG',
        },
        topbar: {
            search: {
                label: 'Search',
                placeholder: 'Search for a mod',
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
                nsfw: 'Mod marked as NSFW',
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
        selectExecutable: 'Select executable',
        locateGameLaunchHelper: 'Locate gamelaunchhelper executable',
        locateSteamExecutable: 'Locate Steam executable',
    }
}
