export type BannerMessageFormat = {
    concerningPackage: {
        text: string;
        action: string;
    },
    managerUpdate: {
        title: string;
        linkText: string;
    },
    modListUpdate: {
        error: string;
        viewDetails: string;
        willKeepTrying: string;
        errorOccurred: string;
        blockedByDownloads: string;
        waitForDownloads: string;
        retryPrompt: string;
        retryAction: string;
    },
    updatableMods: {
        text: string;
        updateAction: string;
    }
}
