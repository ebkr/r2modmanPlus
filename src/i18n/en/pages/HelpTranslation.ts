import { HelpMessageFormat } from '../../base/pages/HelpMessageFormat';

export const HelpTranslation: HelpMessageFormat = {
    tabs: {
        general: 'General',
        gameWontStart: 'Game not starting',
        modsNotShowing: 'Mods not appearing',
        updating: 'Updating',
    },
    general: {
        gettingStarted: {
            title: 'Get started by installing mods',
            whereToFindMods: `
            Go to the "Online" tab, find a mod, and hit download.
            It'll also download the dependencies saving you time.
            `,
            onceInstalled: 'Once you\'ve installed the mods you\'d like to use, just click {startModdedAction} in the top left.',
        },
        slowGame: {
            title: 'Slow game with mods / stuttering?',
            likelyCause: `
            This is likely due to a mod throwing errors.
            One solution is to attempt to disable half of your mods and check to see if the issue persists.
            `,
            issuePersisting: `
            If the issue still remains then disable another half.
            Continue doing this until the issue is solved.
            `,
            ifStutters: 'In the case of stuttering there may be optimization mods that can help with this.',
        },
        dedicatedServers: {
            title: 'Dedicated servers',
            content: `
            Dedicated servers aren't directly supported through the manager however a solution is to instead
            copy the contents of your profile folder into your dedicated server folder.
            `,
        },
        launchingExternally: {
            title: 'Launching the game from outside the mod manager',
            howTo: 'By design your experience by starting the game through Steam will be vanilla (un-modded).',
            whereToPlace: 'You will need to place the corresponding argument in your platform\'s relevant launch parameter area.',
            forSteam: 'For Steam, this would be located in the game\'s properties.',
            yourCurrentArgument: 'Your current argument would be:',
            loaderNotInstalled: 'These parameters will be available once a mod loader has been installed.',
            copyArguments: 'Copy launch arguments',
        },
    },
    gameWontStart: {
        errorModal: {
            title: 'A red box appears when I try to start the game',
            solution: 'There is usually a suggestion at the bottom of the red box. It may resolve the issue.',
        },
        redirectedToStorePage: {
            title: 'I\'m taken to the Steam store page',
            solution: 'You must have a legal copy of the game when using {appName}. You can purchase it from the store page.',
        },
        consoleCloses: {
            title: 'A text window appears and closes immediately',
            tryRunning: 'Try running "Reset {gameName} installation" on the Settings screen.', // TODO - Reference translation via Settings screen
            ifPersists: 'If it persists, force exit Steam and start modded with Steam closed.',
        }
    },
    modsNotShowing: {
        potentialSolutions: {
            title: 'Potential solutions',
            instructToWiki: 'The most common issues are solved by following the instructions exactly as listed on the wiki.',
            goToWiki: 'Go to the wiki',
        }
    },
    updating: {
        autoUpdates: {
            title: 'Automatic updates',
            whenDoesItUpdate: 'The manager updates automatically on close assuming an update is available.',
            downloadedInBackground: 'Updates are downloaded in the background.',
            promptToRunOldInstaller: 'You may receive a prompt to run "{oldInstaller}" as an admin. This is the updater.',
            ifProblemOccurs: 'If a problem occurs with an update, download and run the latest installer.',
        },
        ignoreUpdates: {
            title: 'I don\'t want updates',
            content: 'On GitHub there is a portable version that doesn\'t auto update. You are however prompted that an update is available.'
        }
    }
}
