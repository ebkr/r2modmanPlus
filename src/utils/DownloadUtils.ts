import R2Error from "../model/errors/R2Error";

export function addSolutionsToError(err: R2Error): void {
    // Sanity check typing.
    if (!(err instanceof R2Error)) {
        return;
    }

    if (
        err.name.includes("Failed to download mod") ||
        err.name.includes("System.Net.WebException")
    ) {
        err.solution = "Try toggling the preferred Thunderstore CDN in the settings";
    }

    if (err.message.includes("System.IO.PathTooLongException")) {
        err.solution = 'Using "Change data folder" option in the settings to select a shorter path might solve the issue';
    }
}

// TODO: move generateProgressPercentage to DownloadUtils
