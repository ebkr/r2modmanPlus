import {SettingsMessageFormat} from "../../base/pages/SettingsMessageFormat";

export const SettingsTranslation: SettingsMessageFormat = {
    hero: {
        title: 'Settings',
        subtitle: 'Advanced options for {appName}: {version}',
    },
    nav: {
        label: 'Sections',
        categories: {
            all: 'All',
            directories: 'Directories',
            profile: 'Profile',
            appearance: 'Appearance',
            debugging: 'Debugging',
            modpacks: 'Modpacks',
            other: 'Other',
        }
    },
    search: {
        label: 'Search',
        placeholder: 'Search for a setting',
    },
    actions: {
        change: 'Change',
        browse: 'Browse',
        notSet: 'Not set',
    },
    entries: {
        changeLaunchBehaviour: {
            title: 'Change launch behaviour',
            description: 'Select a specific launch behaviour. You can tell the manager that a game is explicitly using either Native or Proton.',
            current: 'The current launch behaviour is set to:',
            searchTerms: [
                'Change launch behaviour',
                'Set launch mode',
                'Proton',
                'Native',
                'Auto',
            ],
        },
        cleanOnlineModListCache: {
            title: 'Clean online mod list cache',
            description: 'Deletes the local copy of the mod list and retrieves a new one.',
            action: 'Clean online mod list',
            searchTerms: [
                'Clean online mod list cache',
                'Reset',
            ],
        },
        copyLogToClipboard: {
            title: 'Copy log to clipboard',
            description: 'Copy the contents of the log file to your clipboard, formatted for Discord.',
            searchTerms: [
                'Copy log file contents to clipboard',
                'LogOutput',
                'LogOutput.txt',
                'Discord',
            ],
        },
        copyTroubleshooting: {
            title: 'Copy troubleshooting info to clipboard',
            description: 'Copy settings and other information to your clipboard, formatted for Discord. Share this when requesting support.',
            searchTerms: [
                'Copy troubleshooting information to clipboard',
                'Discord',
                'Support',
                'System',
            ],
        },
        dataDirectory: {
            title: 'Data and profile folders',
            description: 'The folder where mods are stored for all games and profiles.',
            warning: 'Changing the data folder does not move or delete existing profiles. They will however remain in the old folder.',
            dataFolder: 'Data folder',
            profileFolder: 'Profile folder',
            searchTerms: [
                'Data and profile directories',
                'Change',
                'Browse',
                'Folder',
                'Directory',
            ],
        },
        downloadCache: {
            title: 'Download cache',
            description: 'When enabled, downloads will be skipped if an existing copy is already cached.',
            enabled: 'Enabled (recommended)',
            disabled: 'Disabled',
            searchTerms: [
                'Toggle download cache',
                'Download cache',
                'Toggle',
            ],
        },
        expandCards: {
            title: 'Expand cards by default',
            description: 'Show mod cards fully expanded rather than collapsed when opening a mod list.',
            expanded: 'Expanded',
            collapsed: 'Collapsed',
            searchTerms: [
                'Expand cards by default',
                'Toggle',
                'Collapsed',
                'Expanded',
            ],
        },
        exportProfile: {
            title: 'Export profile',
            description: 'Export your mod list and configs to share with friends and get an identical profile quickly and easily.',
            asFile: 'As a file',
            asCode: 'As a code',
            searchTerms: [
                'Export profile',
                'As file',
                'As code',
            ],
        },
        funkyMode: {
            title: 'Enable funky mode',
            description: 'It\'s funky mode.',
            enabled: 'Enabled',
            disabled: 'Disabled',
            searchTerms: [
                'Enable funky mode',
                'Toggle',
                'Disable'
            ],
        },
        gameDirectory: {
            title: '{gameName} folder',
            description: 'The game directory is required to place the appropriate files correctly.',
            warning: '{gameName} will launch without mods if this is not set appropriately.',
            unsure: 'I\'m not sure what this should be',
            searchTerms: [
                '{gameName} folder',
                'Change',
                'Browse',
                'Game',
                'Directory',
                'Directories',
            ],
        },
        importLocalMod: {
            title: 'Import local mod',
            description: 'Install a mod offline from your files. Not all mods can be installed locally.',
            searchTerms: [
                'Import local mod',
                'Install offline',
                'Import',
            ],
        },
        launchArguments: {
            title: 'Launch arguments',
            description: 'Provide custom arguments that are added when starting the game.',
            action: 'Set launch arguments',
            searchTerms: [
                'Set custom launch arguments',
                'Launch parameters',
            ],
        },
        modCache: {
            title: 'Mod cache',
            description: 'Downloaded mods are kept in a cache so that they don\'t need to be downloaded again.',
            stillWritten: 'Mods will still be written to the cache and will continue to use disk space.',
            action: 'Clean cache',
            actionDescription: 'Removes cached mods that aren\'t in any profile to free up storage space.',
            enabled: 'Enabled',
            disabled: 'Disabled',
            enabledHint: 'Reusing cached downloads (recommended)',
            disabledHint: 'Ignores the cache when downloading mods. Re-downloads each time.',
            searchTerms: [
                'Mod cache',
                'Downloads',
                'Reuse cached downloads',
                'Toggle',
                'Clean mod cache',
                'Free space',
                'Clear',
                'Storage',
            ],
        },
        modState: {
            title: 'Change mod state',
            description: 'Enable / disable all of the mods in your profile.',
            enableAll: 'Enable all mods',
            disableAll: 'Disable all mods',
            allEnabled: 'All of your mods are currently enabled.',
            allDisabled: 'All of your mods are currently disabled.',
            someDisabled: 'You have 1 mod disabled. | You have {count} mods disabled.',
            searchTerms: [
                'Change mod state',
                'Toggle',
                'Enable all mods',
                'Disable all mods',
            ],
        },
        onlineModList: {
            title: 'Online mod list',
            description: 'Check for new mod releases, or clear the local copy.',
            refresh: 'Refresh',
            deleteCopy: 'Delete copy',
            states: {
                refreshing: 'Refreshing...',
                error: 'Error refreshing the mod list: {message}',
                disabledWhileDownloading: 'Refreshing the mod list is disabled while there are active downloads.',
                lastUpdated: 'Last updated on: {date}',
                noApiInfo: 'No API information available',
            },
            searchTerms: [
                'Refresh online mod list',
                'Check for new mod releases',
                'Clean online mod list cache',
                'Reset mod list cache',
            ],
        },
        refreshOnlineModList: {
            title: 'Refresh online mod list',
            description: 'Check for any new mod releases. {status}',
            action: 'Refresh',
            states: {
                refreshing: 'Refreshing...',
                error: 'Error refreshing the mod list: {message}',
                disabledWhileDownloading: 'Refreshing the mod list is disabled while there are active downloads.',
                cacheDate: 'Cache date: {date}',
                noApiInfo: 'No API information available',
            },
            searchTerms: [
                'Refresh online mod list',
                'Check for new mod releases',
                'Thunderstore mods',
            ],
        },
        resetGameInstallation: {
            title: 'Reset {gameName} installation',
            description: 'Fix problems caused by corrupted files or files left over from manual modding attempts. This will delete all contents of the {folderName} folder and will verify files through Steam.',
            action: 'Reset installation',
            searchTerms: [
                'Reset {gameName} installation',
                'Validate files',
                'Verify integrity',
                'Corrupted',
                'File',
            ],
        },
        showDependencyStrings: {
            title: 'Show dependency strings',
            description: 'View a list of installed mods with their version strings, as used inside the dependencies array of a manifest.json file. Shows dependency strings for {modCount} mod(s).',
            searchTerms: [
                'Show dependency strings',
            ],
        },
        steamDirectory: {
            title: 'Steam folder',
            description: 'The Steam folder containing the Steam executable.',
            value: 'This is how {appName} will launch the game.',
            searchTerms: [
                'Change Steam folder',
                'Change Steam directory',
                'Browse',
                'Directories',
            ],
        },
        theme: {
            title: 'Theme',
            description: 'Choose between a light or dark appearance for the manager.',
            light: 'Light',
            dark: 'Dark',
            searchTerms: [
                'Theme',
                'Light',
                'Dark',
                'Appearance',
            ],
        },
        toggleCdn: {
            title: 'Toggle preferred Thunderstore CDN',
            description: 'Switch the CDN until the app is restarted. This might bypass issues with downloading mods.',
            action: 'Toggle preferred CDN',
            current: 'Current: {label}',
            searchTerms: [
                'Toggle preferred Thunderstore CDN',
                'Change',
            ],
        },
        updateAllMods: {
            title: 'Update all mods',
            description: 'Quickly update every installed mod to their latest versions. {status}',
            status: '1 mod has an update available. | {count} mods have an update available.',
            searchTerms: [
                'Update all mods',
            ],
        },
    }
};
