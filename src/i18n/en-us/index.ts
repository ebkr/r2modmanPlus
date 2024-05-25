export default {
    buttons: {
        tip: 'Donate to the mod author',
        donate: 'Donate'
    },
    config: {
        edit: {
            save: 'Save',
            subtitle: 'Editing config file',
            cancel: 'Cancel',
            sections: 'Sections',
            more: 'Show more',
            less: 'Show less'

        },
        selection: {
            title: 'Config editor',
            subtitle: 'Select a configuration file to edit',
            notification: 'Configuration files are generated after launching the game, with the mod installed, at least once.',
            search: 'Search',
            searchPH: 'Search for config files',
            sort: 'Sort',
            edit: 'Edit Config',
            open: 'Open File',
            delete: 'Delete',
            failed: 'Failed to delete config file',
            try: 'Try running {appName} as an administrator.',
            SortConfigFile: {
                'Name': 'Name',
                'Last updated': 'Last updated'
            },
            SortDirection: {
                'Standard': 'Standard',
                'Reverse': 'Reverse'
            }
        }
    },
    importing: {
        title: 'Import mod from file',
        select: 'Select file',
        import: 'Import local mod',
        tip: 'Please select a zip or DLL to be imported.',
        desc: 'Zip files that contain a manifest file will have the some information pre-filled. If a manifest is not available, this will have to be entered manually.',
        waiting: 'Waiting for file. This may take a minute.',
        name: 'Mod name',
        namePH: 'Enter the name of the mod',
        author: 'Author',
        authorPH: 'Enter the author name',
        modDesc: 'Description (optional)',
        modDescPH: 'Enter a description',
        version: 'Version',
        major: 'Major',
        minor: 'Minor',
        patch: 'Patch',
        selectFileButtonLabel: 'Select file',
        selectFileTitle: 'Import local mod from file',
        modNameVM: 'The mod name must not be empty.',
        modAuthorVM: 'The mod author must not be empty.',
        versionVMAll: 'Major, minor, and patch must all be numbers.',
        versionVM: 'Major, minor, and patch must be whole numbers greater than 0.',
        profileVM: 'Profile is not selected'
    },
    mixins: {
        splash: {
            loadingText1: 'Connecting to GitHub repository',
            loadingText2: 'Downloading exclusions',
            loadingText3: 'Connecting to Thunderstore',
            loadingText4: 'Getting mod list from Thunderstore',
            loadingText5: 'Storing the mod list into local cache',
            loadingText6: 'Processing the mod list',
            loadingText7: 'Processing the mod list from cache',
            heroTitle: 'Failed to get the list of online mods',
            loadingText8: 'You may still use the manager offline, but some features might be unavailable.'
        }
    },
    modals: {
        filter: {
            title: 'Filter mod categories',
            categories: 'Categories',
            categoryOption: 'Select a category',
            selectedCategories: 'Selected categories:',
            noSelection: 'No categories selected',
            allowNsfw: 'Allow NSFW (potentially explicit) mods',
            showDeprecated: 'Show deprecated mods',
            apply: 'Apply filters',
            categoryFilter: {
                'Mod has at least one of these categories': 'Mod has at least one of these categories',
                'Mod has all of these categories': 'Mod has all of these categories',
                'Mod has none of these categories': 'Mod has none of these categories'
            }

        },
        error: {
            title: 'Error',
            solution: 'Suggestion'
        },
        running: {
            launching: '{displayName} is launching via Steam',
            starting: '{displayName} is starting',
            close: 'Close this message to continue modding.',
            SteamStarting: 'If this is taking a while, it\'s likely due to Steam starting.',
            patient: 'lease be patient, and have fun!'
        }
    },
    navigation: {
        menu: {
            modded: 'Start modded',
            vanilla: 'Start vanilla',
            mods: 'Mods',
            installed: 'Installed',
            online: 'Online',
            other: 'Other',
            editor: 'Config editor',
            settings: 'Settings',
            help: 'Help',
            language: 'Display Language'
        }
    },
    settings: {
        view: {
            title: 'Settings',
            subtitle: 'Advanced options for {name}: {version}',
            search: 'Search:',
            searchPH: 'Search for a setting',
            activeTab: 'All',
            tabs: {
                all: 'All',
                profile: 'Profile',
                locations: 'Locations',
                debugging: 'Debugging',
                modpacks: 'Modpacks',
                other: 'Other'
            },
            actions: [
                'Browse data folder',
                'Change {name} directory',
                'Browse profile folder',
                'Change data folder directory',
                'Copy log file contents to clipboard',
                'Toggle download cache',
                'Run preloader fix',
                'Set launch parameters',
                'Clean mod cache',
                'Change profile',
                'Enable all mods',
                'Disable all mods',
                'Import local mod',
                'Export profile as a file',
                'Export profile as a code',
                'Update all mods',
                'Toggle funky mode',
                'Switch theme',
                'Switch card display type',
                'Refresh online mod list',
                'Change game',
                'Show dependency strings',
                'Change Steam directory',
                'Language'
            ],
            descriptions: [
                'Open the directory where mods are stored for all games and profiles.',
                'Change the location of the {name} directory that {appName} uses.',
                'Open the folder where mods are stored for the current profile.',
                'Change the directory where mods are stored for all games and profiles. The folder will not be deleted, and existing profiles will not carry across.',
                'Copy the text inside the LogOutput.log file to the clipboard, with Discord formatting.',
                'Downloading a mod will ignore mods stored in the cache. Mods will still be placed in the cache.',
                'Run this to fix most errors mentioning the preloader, or about duplicate assemblies.',
                'Provide custom arguments used to start the game.',
                'Free extra space caused by cached mods that are not currently in a profile.',
                'Change the mod profile.',
                'Enable all mods for the current profile',
                'Disable all mods for the current profile',
                'Install a mod offline from your files.',
                'Export your mod list and configs as a file.',
                'Export your mod list and configs as a code.',
                'Quickly update every installed mod to their latest versions.',
                'Enable/disable funky mode.',
                'Switch between light and dark themes.',
                'Switch between expanded or collapsed cards.',
                'Check for any new mod releases.',
                'Change the current game (restarts the manager)',
                'View a list of installed mods with their version strings. Used inside the dependencies array inside the manifest.json file.',
                'Change the location of the Steam directory that {name} uses.',
                'Change display language'
            ],
            values: [
                'Current: cache is disabled',
                'Current: cache is enabled (recommended)',
                'This will delete the {name}/Managed folder, and verify the files through Steam',
                'These commands are used against the Steam executable on game startup',
                'Check all profiles for unused mods and clear cache',
                'Current profile: {name}',
                '{0}/{1} enabled',
                '{0}/{1} disabled',
                'The exported file can be shared with friends to get an identical profile quickly and easily',
                'The exported code can be shared with friends to get an identical profile quickly and easily',
                '1 mod has an update available',
                '{0} mods have an update available',
                'Current: enabled',
                'Current: disabled (default)',
                'Current: dark theme',
                'Current: light theme (default)',
                'Current: expanded',
                'Current: collapsed (default)',
                'Checking for new releases',
                'Error getting new mods: {0}',
                'Cache date: {0}',
                'No API information available',
                'Show dependency strings for {0} mod(s)',
                'Please set manually',
                'Log file exists',
                'Log file does not exist',
                'Not all mods can be installed locally'
            ],
            returns: [
                'Please set manually'
            ]
        }
    },
    views: {
        associated: {
            title: 'Mods associated with {name}',
            dependencies: 'Dependencies',
            dependants: 'Dependants',
            done: 'Done'
        },
        disable: {
            title: 'Disabling {name}',
            notification: 'Other mods depend on this mod. Select ',
            disableAll: 'Disable all',
            toDisable: 'to disable dependent mods, otherwise they may cause errors.',
            subtitle: 'Mods to be disabled',
            disabling: 'Disabling {name}',
            All: 'Disable all (recommended)',
            Only: 'Disable {name} only'
        },
        localMod: {
            deprecated: 'Deprecated',
            deprecatedTip: '\'This mod is deprecated and could be broken\'',
            disabled: 'Disabled',
            disabledTip: '\'This mod will not be used in-game\'',
            donateTip: '\'Donate to the mod author\'',
            updateTip: '\'An update is available\'',
            issueTip: '`There is an issue with the dependencies for this mod`',
            uninstall: 'Uninstall',
            disable: 'Disable',
            enable: 'Enable',
            associated: 'Associated',
            website: 'Website',
            update: 'Update',
            download: 'Download dependency'

        },
        search: {
            search: 'Search',
            searchPH: 'Search for an installed mod',
            sort: 'Sort',
            disabled: 'Disabled',
            orderOptions: {
                'Custom': 'Custom',
                'Mod name': 'Mod name',
                'Author name': 'Author name'
            },
            directionOptions: {
                'Standard': 'Standard',
                'Reverse': 'Reverse'
            },
            disabledOptions: {
                'None': 'None',
                'Custom': 'Custom',
                'First': 'First',
                'Last': 'Last'
            }
        },
        uninstall: {
            title: 'Uninstalling {name}',
            notification: 'Other mods depend on this mod. Select ',
            uninstall: 'Uninstall all',
            toUninstall: 'to uninstall dependent mods, otherwise they may cause errors.',
            subtitle: 'Mods to be uninstalled',
            uninstalling: 'Uninstalling {name}',
            all: 'Uninstall all (recommended)',
            only: 'Uninstall {name} only'
        },
        download: {
            downloading: 'Downloading {name}',
            progress: '{progress}% complete',
            selectVersion: 'Select a version of {name} to download',
            recommended: 'It\'s recommended to select the latest version of all mods.',
            outdated: 'Using outdated versions may cause problems.',
            need: 'You need to select a version',
            recommendedVersion: '{version} is the recommended version',
            latestVersion: '{version} is the latest version',
            outdatedVersion: '{version} is an outdated version',
            dependencies: 'Download with dependencies',
            updateAll: 'Update all installed mods',
            installed: 'All installed mods will be updated to their latest versions.',
            missing: 'Any missing dependencies will be installed.',
            following: 'The following mods will be downloaded and installed:',
            updatedTo: '{name} will be updated to: {number}',
            update: 'Update all'
        },
        installed: {
            noInstall: 'Looks like you don\'t have any mods installed',
            click: 'Click the Online tab on the left, or click',
            here: 'here',
            available: 'You have {number} available mod update{s}. Would you like to ',
            updateAll: 'update all'

        },
        onlineList: {
            pinned: 'Pinned',
            pinnedTip: '\'Pinned on Thunderstore\'',
            deprecated: 'Deprecated',
            by: 'by',
            donateTip: '\'Donate to the mod author\'',
            installedTip: '\'Mod already installed\'',
            lastUpdated: 'Last updated:',
            categories: 'Categories:',
            download: 'Download',
            website: 'Website',
            potentiallyBroken: '\'This mod is potentially broken\''

        },
        onlineView: {
            search: 'Search',
            searchPH: 'Search for a mod',
            sort: 'Sort',
            sortOptions: {
                'Default': 'Default',
                'Last updated': 'Last updated',
                'Alphabetical': 'Alphabetical',
                'Download count': 'Download count',
                'Rating': 'Rating'
            },
            sortDirections: {
                'Standard': 'Standard',
                'Reverse': 'Reverse'
            },
            additional: 'Additional filters',
            filterCategories: 'Filter categories',
            pageNotification: 'Use the numbers below to change page',
            noMod: 'No mods matching search found',
            notAvailable: 'No mods available'

        }
    },
    card: {
        tip1: '\'Drag to reorder\'',
        tip2: '\'Expand\'',
        tip3: '\'Collapse\''
    },
    settingsLoader: {
        title: 'Error',
        suggestion: 'Suggestion',
        gameFailed: 'This is a problem with the mod manager itself. If there\'s a newer version of the manager available, try installing it.',
        settingsFailed: 'Loading of local user settings failed. You can use the button below to reset the settings, but note that all settings for all games will be lost and this can\'t be undone.',
        reset: 'Reset settings',
        resetFailed: 'Resetting of the settings failed. You can still try to reset the settings manually by following these',
        instructions: 'instructions.',
        retryFailed: 'Locally stored settings were reset, but that didn\'t solve the issue with loading the settings. If there\'s a newer version of the manager available, try installing it.'

    },
    pages: {
        download: {
            title: 'Downloads',
            subtitle: 'Monitor progress of downloads',
            nothing: 'You don\'t have anything downloading.',
            click: 'Click ',
            here: 'here',
            download: ' to download something.',
            downloading: 'Downloading: ',
            progress: '{progress}% complete'
        },
        error: {
            nothing: 'Sorry, nothing here...'
        },
        gameSelection: {
            whichStore: 'Which store manages your game?',
            platform: 'Select a platform:',
            selectPlatform: 'Select platform',
            instanceTypes: {
                'Game': 'Game',
                'Server': 'Server'
            },
            selection: '{types} selection',
            whichGame: 'Which game are you managing your mods for?',
            whichServer: 'Which dedicated server are you managing your mods for?',
            updateOccurred: 'An update to the manager has occurred and needs to do background work.',
            untilCompleted: 'The options to select a game are disabled until the work has completed.',
            searchPH: 'Search for a game',
            selectTab: 'Select {types}',
            default: 'Set as default'
        },
        help: {
            title: 'Help',
            subtitle: 'Common problems and their potential solutions',
            tabs: {
                'general': 'General',
                'game won\'t start': 'Game won\'t start',
                'mods not appearing': 'Mods not appearing',
                'updating': 'Updating'
            },
            startTitle: 'Getting started with installing mods',
            startInfo: 'Go to the "Online" tab, find a mod, and hit download.It\'ll also download the dependencies saving you time.',
            startTip: 'Once you\'ve installed the mods you\'d like, just click {strong} in the top left.',
            strong: 'Start modded',
            slowTitle: 'Slow game with mods / stuttering?',
            slowInfo: 'This is likely due to a mod throwing errors. One solution is to attempt to disable half of your mods and check to see if the issue persists.{br}If the issue still remains then disable another half. Continue doing this until the issue is solved.{br}{br}In the case of stuttering there may be optimization mods to help with this.',
            dedicatedTitle: 'Dedicated servers',
            dedicatedInfo: 'Dedicated servers aren\'t directly supported through the manager however a solution is to instead copy the contents of your profile folder into your dedicated server folder yourself.',
            launchingTitle: 'Launching the game from outside the mod manager',
            launchingInfo: 'By design your experience by starting the game through Steam will be vanilla (un-modded).{br}{br}You will need to place the corresponding argument in your platform\'s relevant launch parameter area.{br}For Steam, this would be located in the game\'s properties.{br}{br}Your current argument would be:{code}',
            codeElse: 'These parameters will be available after installing BepInEx.',
            failStartTitle1: 'A red box appears when I try to start the game',
            failStartTip1: 'Read the suggestion at the bottom of the red box.',
            failStartTitle2: 'I\'m taken to the Steam store page',
            failStartTip2: 'That\'s because you don\'t legally own the game. The manager only supports legal copies.',
            failStartTitle3: 'A text window appears and closes immediately.',
            failStartTip3: 'Try running the preloader fix on the Settings screen.',
            failStartTip4: 'If it persists, force exit Steam and start modded with Steam closed.',
            modsTitle: 'Potential solutions',
            modsInfo: 'The most common issues are solved by following the instructions exactly as listed {link}',
            here: 'here',
            updatingTitle1: 'Auto-updates',
            updatingTip1: 'The manager updates automatically on close assuming an update is available.',
            updatingTip2: 'Updates are downloaded in the background.',
            updatingTip3: 'You may receive a prompt to run {i} as an admin. This is the updater.',
            old: 'old_uninstaller',
            updatingTip4: 'If a problem occurs with an update, download and run the latest installer.',
            updatingTitle2: 'I don\'t want updates',
            updatingTip5: 'On GitHub there is a portable version that doesn\'t auto update. You are however prompted that an update is available.'
        },
        linux: {
            title: 'Getting started on {name}',
            subtitle: 'Let\'s configure the game properly',
            copied: 'Copied!',
            copyTo: 'Copy to clipboard',
            continue: 'Continue',
            tip1: 'To be able to launch {game} on Linux, you must first setup your Steam launch options correctly.',
            tip2: 'This needs to be done because of how the BepInEx injection works on Unix systems.',
            tip3: 'Please copy and paste the following to your {game} launch options:'
        },
        manager: {
            update: 'An update is available.',
            clickHere: 'Click here to go to the release page.',
            steamIncorrectDir: 'Failed to set the Steam directory',
            steamIncorrectDirTip1: 'The steam executable was not selected.',
            steamIncorrectDirTip2: 'If this error has appeared but the executable is correct, please run as administrator.',
            IncorrectDir: 'Failed to set the {name} directory',
            IncorrectDirTip1: 'The executable must be either of the following: "{name}".',
            IncorrectDirTip2: 'If this error has appeared but the executable is correct, please run as administrator.',
            fixingPreloader: 'Attempting to fix preloader issues',
            fixingPreloaderTip1: 'You will not not be able to launch the game until Steam has verified the integrity of the game.',
            fixingPreloaderTip2: 'Steam will be started, and will attempt to verify the integrity of {name}.',
            fixingPreloaderTip3: 'Please check the Steam window for validation progress. If the window has not yet appeared, please be patient.',
            understand: 'I understand',
            showDependencyStrings: 'Dependency string list',
            parameters: 'Set custom launch parameters',
            default: 'Some parameters are provided by default:',
            modded: 'Modded:',
            moddedElse: 'These parameters will be available after installing a mod loader.',
            vanilla: 'Vanilla:',
            vanillaTip: 'Please note that these are called against the Steam executable. Be careful when entering custom launch parameters.',
            placeholder: 'Enter parameters',
            updateParameters: 'Update launch parameters',
            exported: 'Profile exported',
            exportedTip: 'Your code: {strong} has been copied to your clipboard. Just give it to a friend!',
            done: 'Done',
            locate: 'Locate {0} Executable',
            selectExecutable: 'Select Executable',
            selectNew: 'Select a new folder to store {0} data',
            selectFolder: 'Select Data Folder',
            selectLanguage: 'Select Language',
            setLanguage: 'Set Language'
        },
        profiles: {
            adding: '{0} a profile',
            addingProfileType:{
                'Create': 'Create',
                'Rename': 'Rename'
            },
            renaming: 'This profile will store its own mods independently from other profiles.',
            required: 'Profile name required',
            available: '"{0}" is available',
            exist: '"{0}" is either already in use, or contains invalid characters',
            updateTip: 'All contents of the profile will be overwritten with the contents of the code/file.',
            selectProfile: 'Select a profile below:',
            create: 'Create',
            updateProfile: 'Update profile: {0}',
            rename: 'Rename',
            updating: 'Are you going to be updating an existing profile or creating a new one?',
            importNew: 'Import new profile',
            updateExisting: 'Update existing profile',
            importingProfile: 'How are you importing a profile?',
            updatingProfile: 'How are you updating your profile?',
            fromFile: 'From file',
            fromCode: 'From code',
            enterCode: 'Enter the profile code',
            noCode: 'You haven\'t entered a code',
            mayImport: 'You may import the profile',
            fixIssues: 'Fix issues before importing',
            import: 'Import',
            delete: 'Delete profile',
            deleteTip1: 'This will remove all mods, and their config files, installed within this profile.',
            deleteTip2: 'If this was an accident, click either the darkened area, or the cross inside located in the top right.',
            deleteTip3: 'Are you sure you\'d like to delete this profile?',
            imported: '{0}% imported',
            importedTip1: 'This may take a while, as mods are being downloaded.',
            importedTip2: 'Please do not close {0}.',
            loadingFile: 'Loading file',
            loadingTip: 'A file selection window will appear. Once a profile has been selected it may take a few moments.',
            title: 'Profile selection',
            subtitle: 'Profiles help to organise mods easily',
            back: 'Back to game selection',
            select: 'Select profile',
            createNew: 'Create new',
            IU: 'Import / Update',
            removeProfile: 'Delete'
        },
        splash: {
            notification: 'Game updates may break mods. If a new update has been released, please be patient.',
            help: 'Help',
            about: 'About',
            FAQ: 'FAQ',
            offline: 'Continue offline',
            reconnect: 'Try to reconnect',
            back: 'Go back',
            know: 'Did you know?',
            installTip: 'You can use the "Install with Mod Manager" button on {link} with r2modman.',
            exportProfile: 'You can export the selected profile from the settings screen as either a file, or a code. This makes it easy to share your mod list with friends!',
            trouble: 'Having trouble?',
            troubleTip: 'Send a screenshot of the error in the Thunderstore modding discord server. Feel free to ping me if it doesn\'t get resolved.',
            r2modman: 'About r2modman',
            created: 'It\'s created by Ebkr, using Quasar.',
            quasar: 'Quasar provides the following development tools that r2modman is built upon:',
            questions: [
                'How do I get started?',
                'Starting the game with mods'
            ],
            answers: ['Head on over to the online tab, and download BepInEx and R2API.',
                'You have to start the game from within the manager. Starting through Steam will not work without taking manual steps.'],
            starting: 'Starting r2modman',
            initialising: 'Initialising',
            checking: 'Checking for updates'
        }
    }
};
