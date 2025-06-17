import CdnProvider from "../providers/generic/connection/CdnProvider";
import R2Error from "../model/errors/R2Error";

export function addSolutionsToError(err: R2Error, closeModalOnToggleCDN: boolean = false): void {
    // Sanity check typing.
    if (!(err instanceof R2Error)) {
        return;
    }

    if (
        err.name.includes("Failed to download mod") ||
        err.name.includes("System.Net.WebException")
    ) {
        err.solution = "Try toggling the preferred Thunderstore CDN by clicking the button below (or in the settings).";
        err.addAction({
            label: 'Toggle CDN',
            function: async () => CdnProvider.togglePreferredCdn(),
            closeModal: closeModalOnToggleCDN
        });
    }

    if (err.message.includes("System.IO.PathTooLongException")) {
        err.solution = 'Using "Change data folder" option in the settings to select a shorter path might solve the issue';
    }
}

export function generateProgressPercentage(progress: number, currentIndex: number, total: number): number {
    if (progress === 100 && currentIndex === total) {
        return 100;
    }
    const completedProgress = (currentIndex / total) * 100;
    const totalProgressPercentage = completedProgress + (progress * 1/total)
    return Math.floor(totalProgressPercentage);
}
