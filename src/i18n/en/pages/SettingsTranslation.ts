import {SettingsMessageFormat} from "../../base/pages/SettingsMessageFormat";

export const SettingsTranslation: SettingsMessageFormat = {
    groups: {
        all: 'All',
        profile: 'Profile',
        locations: 'Locations',
        debugging: 'Debugging',
        other: 'Other',
        modpacks: 'Modpacks',
    },
    locations: {
        browseDataFolder: {
            title: 'Browse data folder',
            description: 'Open the folder where mods are stored for all games and profiles.',
        },
        changeGameFolder: {
            title: 'Change {gameName} folder',
            description: 'Change the location of the {gameName} folder that {appName} uses.',
            setManually: 'You must locate the game folder manually by clicking here'
        },
        browseProfileFolder: {
            title: 'Browse profile folder',
            description: 'Open the folder where mods are stored for the current profile.',
        },
        changeDataFolder: {
            title: 'Change data folder',
            description: 'Change the folder where mods are stored for all games and profiles. The folder will not be deleted, and existing profiles will not carry across.',
        },
        changeSteamFolder: {
            title: `Change {''}@:translations.platforms.STEAM{''} folder`,
            description: `Change the location of the @:translations.platforms.STEAM folder that {appName} uses.`,
            states: {
                setManually: 'You must click this setting and locate the folder manually'
            }
        }
    },
    debugging: {
        copyLogFile: {
            title: 'Copy log file contents to clipboard',
            description: 'Copy the text inside the LogOutput.log file to the clipboard, with Discord formatting.',
            logFileExists: 'Log file exists',
            logFileDoesNotExist: 'Log file does not exist',
        },
        copyTroubleshootingInfo: {
            title: 'Copy troubleshooting information to clipboard',
            description: 'Copy settings and other information to the clipboard, with Discord formatting.',
            value: 'Share this information when requesting support on Discord.',
        },
        toggleDownloadCache: {
            title: 'Toggle download cache',
            description: 'Downloading a mod will ignore mods stored in the cache. Mods will still be placed in the cache.',
            enabled: 'Current: cache is enabled (recommended)',
            disabled: 'Current: cache is disabled',
        },
        setLaunchArguments: {
            title: 'Set launch arguments',
            description: 'Provide custom arguments used to start the game.',
            value: 'These commands are used against the Steam executable on game startup'
        },
        cleanModCache: {
            title: 'Clean mod cache',
            description: 'Free extra space caused by cached mods that are not currently in a profile.',
            value: 'Check all profiles for unused mods and clear cache',
        },
        cleanOnlineModList: {
            title: 'Clean online mod list',
            description: 'Deletes local copy of mod list, forcing the next refresh to fetch a new one.',
            states: {
                updating: 'Online mod list is currently updating, please wait for the operation to complete',
                hasCopy: '{gameName} has a local copy of online mod list',
                doesNotHaveCopy: '{gameName} has no local copy stored',
                errorOccurred: 'Error occurred while checking mod list status',
                unknown: 'Unknown status'
            }
        },
        toggleThunderstoreCdn: {
            title: 'Toggle preferred Thunderstore CDN',
            description: 'Switch the CDN until app is restarted. This might bypass issues with downloading mods.',
            current: 'Current: {label} ({url})'
        },
        resetGameInstallation: {
            title: 'Reset {gameName} installation',
            description: 'Fix problems caused by corrupted files or files left over from manual modding attempts.',
            value: `This will delete all contents of the "{folderName}" folder and will verify files using @:translations.platforms.STEAM`
        },
        changeLaunchBehaviour: {
            title: 'Change launch behaviour',
            description: 'Select a specific launch behaviour such as forcing Steam to launch with Proton',
            value: `The current launch behaviour is set to: @:translations.enums.launchType.{launchType}`
        }
    },
    profile: {
        changeProfile: {
            title: 'Change profile',
            description: 'Change the mod profile.',
            value: 'Current profile: {profileName}',
        },
        enableAllMods: {
            title: 'Enable all mods',
            description: 'Enable all mods for the current profile.',
            value: `
            No mods are currently enabled. You have {totalModCount} mods |
            1 mod is enabled out of {totalModCount} |
            {enabledModCount} mods are enabled out of {totalModCount}
            `
        },
        disableAllMods: {
            title: 'Disable all mods',
            description: 'Disable all mods for the current profile.',
            value: `
            No mods are currently disabled. You have {totalModCount} mods |
            1 mod is disabled out of {totalModCount} |
            {disabledModCount} mods are disabled out of {totalModCount}
            `,
        },
        importLocalMod: {
            title: 'Import a local mod',
            description: `Install a mod that was not downloaded from the "{''}@:translations.pages.manager.navigation.modsActions.online{''}" tab.`,
            value: 'The manager will attempt to install mods correctly. This is not guaranteed to install as expected.'
        },
        exportProfileAsFile: {
            title: 'Export profile as a file',
            description: 'Export your mod list and configs as a file.',
            value: 'The exported file can be shared with friends to get an identical profile quickly and easily',
        },
        exportProfileAsCode: {
            title: 'Export profile as a code',
            description: 'Export your mod list and configs as a code.',
            value: 'The exported code can be shared with friends to get an identical profile quickly and easily',
        },
        updateAllMods: {
            title: 'Update all mods',
            description: 'Quickly update every installed mod to their latest versions.',
            value: `
            There are no mods with an update available |
            You have 1 mod with an update available |
            You have {count} mods with an update available
            `,
        }
    },
    other: {
        toggleFunkyMode: {
            title: 'Toggle funky mode',
            description: 'Enable / disable funky mode.',
            states: {
                enabled: 'Funky mode is enabled',
                disabled: 'Funky mode is disabled',
            },
        },
        switchTheme: {
            title: 'Switch theme',
            description: 'Switch between light and dark themes.',
            themes: {
                light: 'Current: Light theme (default)',
                dark: 'Current: Dark theme',
            },
        },
        switchCardDisplayType: {
            title: 'Switch card display type',
            description: 'Switch between expanded or collapsed cards.',
            states: {
                expanded: 'Current: Expanded',
                collapsed: 'Current: Collapsed (default)'
            }
        },
        refreshOnlineModList: {
            title: 'Refresh online mod list',
            description: 'Check for new mod releases.',
            states: {
                refreshing: 'Refreshing',
                errorRefreshing: 'There was a problem refreshing the mod list: {errorText}',
                disabledWhilstDownloading: 'Refreshing the mod list is disabled whilst there are active downloads',
                cacheDate: 'Cache date: {formattedDate}',
                apiUnavailable: 'No API information available',
            }
        },
        changeGame: {
            title: 'Change game',
            description: 'Change the current game.',
        }
    },
    modpacks: {
        showDependencyStrings: {
            title: 'Show dependency strings',
            description: 'View a list of installed mods with their version strings. Used inside the dependencies array inside the manifest.json file.',
            value: `
            No dependency strings as there are no mods installed |
            Show dependency strings for 1 mod |
            Show dependency strings for {n} mods
            `
        }
    }
}
