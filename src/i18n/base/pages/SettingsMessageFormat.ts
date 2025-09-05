export type SettingsMessageFormat = {
    groups: {
        all: string;
        profile: string;
        locations: string;
        debugging: string;
        other: string;
        modpacks: string;
    },
    locations: {
        browseDataFolder: {
            title: string;
            description: string;
        },
        changeGameFolder: {
            title: string;
            description: string;
            setManually: string;
        },
        browseProfileFolder: {
            title: string;
            description: string;
        },
        changeDataFolder: {
            title: string;
            description: string;
        },
        changeSteamFolder: {
            title: string;
            description: string;
            states: {
                setManually: string;
            }
        }
    },
    debugging: {
        copyLogFile: {
            title: string;
            description: string;
            logFileExists: string;
            logFileDoesNotExist: string;
        },
        copyTroubleshootingInfo: {
            title: string;
            description: string;
            value: string;
        },
        toggleDownloadCache: {
            title: string;
            description: string;
            enabled: string;
            disabled: string;
        },
        setLaunchArguments: {
            title: string;
            description: string;
            value: string;
        },
        cleanModCache: {
            title: string;
            description: string;
            value: string;
        },
        cleanOnlineModList: {
            title: string;
            description: string;
            states: {
                updating: string;
                hasCopy: string;
                doesNotHaveCopy: string;
                errorOccurred: string;
                unknown: string;
            }
        },
        toggleThunderstoreCdn: {
            title: string;
            description: string;
            current: string;
        },
        resetGameInstallation: {
            title: string;
            description: string;
            value: string;
        },
        changeLaunchBehaviour: {
            title: string;
            description: string;
            value: string;
        }
    },
    profile: {
        changeProfile: {
            title: string;
            description: string;
            value: string;
        },
        enableAllMods: {
            title: string;
            description: string;
            value: string;
        },
        disableAllMods: {
            title: string;
            description: string;
            value: string;
        },
        importLocalMod: {
            title: string;
            description: string;
            value: string;
        },
        exportProfileAsFile: {
            title: string;
            description: string;
            value: string;
        },
        exportProfileAsCode: {
            title: string;
            description: string;
            value: string;
        },
        updateAllMods: {
            title: string;
            description: string;
            value: string;
        }
    },
    other: {
        toggleFunkyMode: {
            title: string;
            description: string;
            states: {
                enabled: string;
                disabled: string;
            },
        },
        switchTheme: {
            title: string;
            description: string;
            themes: {
                light: string;
                dark: string;
            },
        },
        switchCardDisplayType: {
            title: string;
            description: string;
            states: {
                expanded: string;
                collapsed: string;
            }
        },
        refreshOnlineModList: {
            title: string;
            description: string;
            states: {
                refreshing: string;
                errorRefreshing: string;
                disabledWhilstDownloading: string;
                cacheDate: string;
                apiUnavailable: string;
            }
        },
        changeGame: {
            title: string;
            description: string;
        }
    },
    modpacks: {
        showDependencyStrings: {
            title: string;
            description: string;
            value: string;
        }
    }
}
