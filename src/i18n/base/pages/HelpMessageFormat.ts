export type HelpMessageFormat = {
    tabs: {
        general: string;
        gameWontStart: string;
        modsNotShowing: string;
        updating: string;
    },
    general: {
        gettingStarted: {
            title: string;
            whereToFindMods: string;
            onceInstalled: string;
        },
        slowGame: {
            title: string;
            likelyCause: string;
            issuePersisting: string;
            ifStutters: string;
        },
        dedicatedServers: {
            title: string;
            content: string;
        },
        launchingExternally: {
            title: string;
            howTo: string;
            whereToPlace: string;
            forSteam: string;
            yourCurrentArgument: string;
            loaderNotInstalled: string;
            copyArguments: string;
        },
    },
    gameWontStart: {
        errorModal: {
            title: string;
            solution: string;
        },
        redirectedToStorePage: {
            title: string;
            solution: string;
        },
        consoleCloses: {
            title: string;
            tryRunning: string;
            ifPersists: string;
        }
    },
    modsNotShowing: {
        potentialSolutions: {
            title: string;
            instructToWiki: string;
            goToWiki: string;
        }
    },
    updating: {
        autoUpdates: {
            title: string;
            whenDoesItUpdate: string;
            downloadedInBackground: string;
            promptToRunOldInstaller: string;
            ifProblemOccurs: string;
        },
        ignoreUpdates: {
            title: string;
            content: string;
        }
    }
}
