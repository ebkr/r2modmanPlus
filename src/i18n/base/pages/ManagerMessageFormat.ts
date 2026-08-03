export type ManagerMessageFormat = {
    navigation: {
        gameActions: {
            startModded: string;
            startVanilla: string;
        },
        modsActions: {
            label: string;
            installed: string;
            online: string;
        },
        otherActions: {
            label: string;
            configEditor: string;
            settings: string;
            help: string;
        },
        profileSwitcher: {
            label: string;
            gameIconAltText: string;
            close: string;
        },
        activityBar: {
            exportProfile: string;
            exportToCode: string;
            exportToFile: string;
        }
    },
    installed: {
        noModsInstalled: {
            title: string;
            content: string;
        },
        searchAndSort: {
            search: {
                label: string;
                placeholder: string;
            },
            sort: {
                label: string;
                disabledPositions: {
                    label: string;
                },
            }
        },
        localModCard: {
            labels: {
                deprecated: string;
                disabled: string;
            },
            display: {
                byline: string;
                installedAt: string;
                releasedAt: string;
            },
            concerning: {
                recommendation: string;
            },
            tooltips: {
                updateAvailable: string;
                dependencyIssue: string;
                disable: string;
                enable: string;
                donate: string;
                willNotBeUsed: string;
            },
            actions: {
                uninstall: string;
                disable: string;
                enable: string;
                associated: string;
                openWebsite: string;
                update: string;
                downloadDependency: string;
                enableSpecific: string
                donate: string;
            }
        },
        expandableCard: {
            imageAltText: string;
            funkyModeAltText: string;
            tooltips: {
                dragToReorder: string;
                expand: string;
                collapse: string;
            }
        },
    },
    online: {
        previewPanel: {
            author: string;
            metadata: {
                downloads: string;
                likes: string;
                lastUpdated: string;
                categories: string;
            },
            actions: {
                download: string;
                viewOnline: string;
                donate: string;
            },
            tabs: {
                readme: string;
                changelog: string;
                dependencies: string;
            },
            packageInformation: string;
            nsfwWarning: string;
            fetchingData: string;
            noDependencies: string;
            unableToFetchReadme: string;
            unableToFetchChangelog: string;
        },
        topbar: {
            search: {
                label: string;
                placeholder: string;
            },
            sort: string;
            filter: string;
        },
        pagination: {
            changePageInfo: string;
            noFoundMods: string;
            noMods: string;
        },
        modList: {
            tooltips: {
                pinned: {
                    short: string;
                    long: string;
                },
                deprecated: {
                    short: string;
                    long: string;
                },
                donate: string;
                installed: string;
                nsfw: string;
            },
            mod: {
                author: string;
            },
            actions: {
                download: string;
                website: string;
            }
        }
    },
    actions: {
        locateGameExecutable: string;
        selectExecutable: string;
        locateGameLaunchHelper: string;
        locateSteamExecutable: string;
    }
}
