import {SettingsMessageFormat} from "../../base/pages/SettingsMessageFormat";

export const SettingsTranslation: SettingsMessageFormat = {
    groups: {
        locations: 'Locations',
        debugging: 'Debugging',
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
        }
    }
}
