import {SplashMessageFormat} from "../../base/pages/SplashMessageFormat";

export const SplashTranslation: SplashMessageFormat = {
    pageTitle: 'Starting {appName}',
    gameUpdatesWarning: 'Game updates may break mods. If a new update has been released, please be patient.',
    menu: {
        helpLabel: 'Help',
        helpItems: {
            about: 'About',
            faq: 'FAQ'
        },
    },
    actions: {
        goBack: 'Go back',
    },
    content: {
        main: {
            didYouKnow: 'Did you know?',
            externalInstallWithModManager: `
                            You can use the "Install with Mod Manager" button on
                            Thunderstore to install mods using {appName}.
                        `,
            goToThunderstore: 'Go to Thunderstore',
            exportProfile: `
                        You can export the selected profile from the settings screen as either a file, or a code.
                        This makes it easy to share your mod list with friends!
                        `,
            havingTrouble: {
                title: 'Having trouble?',
                body: 'Send a screenshot of the error in the support channel of the r2modman Discord server.',
                serverLinkText: 'Join the {appName} Discord server',
            },
        },
        about: {
            title: 'About {appName}',
            creator: 'It\'s created by Ebkr.',
            techStack: {
                builtUsing: 'The application has been built using Quasar, which provides the following tech stack:',
                electron: 'Electron',
                node: 'NodeJS',
                vue: 'Vue 3',
                typescript: 'TypeScript',
            }
        },
        faq: {
            title: 'FAQ',
            howToGetStarted: {
                title: 'How do I get started?',
                body: 'Head on over to the Online tab and download your favourite mods. Click "Start modded" and enjoy.'
            },
            startingWithMods: {
                title: 'Starting the game with mods',
                body: `
                            You have to start the game from within the manager.
                            Starting through Steam will not work without manual changes.
                            `
            }
        }
    },
    states: {
        preparing: 'Preparing',
        checkingForUpdates: 'Checking for updates',
        checkingForLocalCache: 'Checking for mod list in local cache',
        checkingForThunderstoreUpdates: 'Checking for mod list updates from Thunderstore',
        loadingLatestThunderstoreList: 'Loading latest mod list from Thunderstore',
        pruningLocalCache: 'Pruning removed mods from local cache',
        processingModList: 'Processing the mod list',
    }
}
