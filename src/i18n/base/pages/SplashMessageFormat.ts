export type SplashMessageFormat = {
    pageTitle: string;
    gameUpdatesWarning: string;
    menu: {
        helpLabel: string;
        helpItems: {
            about: string;
            faq: string;
        }
    };
    actions: {
        goBack: string;
    };
    content: {
        main: {
            didYouKnow: string;
            externalInstallWithModManager: string;
            goToThunderstore: string;
            exportProfile: string;
            havingTrouble: {
                title: string;
                body: string;
                serverLinkText: string;
            }

        };
        about: {
            title: string;
            creator: string;
            techStack: {
                builtUsing: string;
                electron: string;
                node: string;
                vue: string;
                typescript: string;
            };
        };
        faq: {
            title: string;
            howToGetStarted: {
                title: string;
                body: string;
            };
            startingWithMods: {
                title: string;
                body: string;
            }
        };
    }
    states: {
        preparing: string;
        checkingForUpdates: string;
        checkingForLocalCache: string;
        checkingForThunderstoreUpdates: string;
        loadingLatestThunderstoreList: string;
        pruningLocalCache: string;
        processingModList: string;
    }
}
