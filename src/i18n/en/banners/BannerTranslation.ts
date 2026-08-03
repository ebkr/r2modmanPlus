import { BannerMessageFormat } from '../../base/banners/BannerMessageFormat';

export const BannerTranslation: BannerMessageFormat = {
    concerningPackage: {
        text: 'You have mods that can no longer be found on Thunderstore.',
        action: 'Click here to review packages.',
    },
    managerUpdate: {
        title: 'An {appName} update is available.',
        linkText: 'Click here to go to the release page.',
    },
    modListUpdate: {
        error: 'Error refreshing the mod list.',
        viewDetails: 'View error details',
        willKeepTrying: 'The manager will keep trying to refresh the mod list in the background.',
        errorOccurred: 'An error occurred when refreshing the mod list from Thunderstore.',
        blockedByDownloads: 'However, the mod list can\'t be refreshed while there are mod downloads in progress.',
        waitForDownloads: 'Please wait for the downloads to finish before continuing.',
        retryPrompt: 'An error occurred when refreshing the mod list from Thunderstore. Would you like to {retryAction}?',
        retryAction: 'try again now',
    },
    updatableMods: {
        text: `
        You have {numberOfModsWithUpdates} mod with an update available. |
        You have {numberOfModsWithUpdates} mods with updates available.
        `,
        updateAction: 'Update all?',
    }
}
