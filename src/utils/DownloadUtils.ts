import R2Error from '../model/errors/R2Error';
import ThunderstoreCombo from '../model/ThunderstoreCombo';
import FsProvider from '../providers/generic/file/FsProvider';
import PathResolver from '../r2mm/manager/PathResolver';

import * as path from 'path';

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

/**
 * Returns the total download size for a list of mods.
 * If ignoreCache is set to true, all of the mods are included in the total download size.
 * Otherwise, it checks if the files are already downloaded and returns the
 * total size of the files that actually need to be downloaded.
 *
 * @param combos The mods that need to be downloaded.
 * @param ignoreCache Whether to ignore the cache and include all mods in the total download size.
 * @returns The total download file size of the mods to download (in bytes).
 */
export async function getTotalDownloadSizeInBytes(combos: ThunderstoreCombo[], ignoreCache: boolean): Promise<number> {
    const isCached = ignoreCache
        ? Array(combos.length).fill(false)
        : await Promise.all(combos.map((combo) => isVersionAlreadyDownloaded(combo)));

    return combos
        .filter((_combo, index) => !isCached[index])
        .reduce((total, combo) => total + combo.getVersion().getFileSize(), 0);
}

/**
 * Checks if a version is already downloaded to the cache directory.
 * @param combo The combo to check.
 * @returns True if the version is already downloaded, false otherwise.
 */
export async function isVersionAlreadyDownloaded(combo: ThunderstoreCombo): Promise<boolean>  {
    const fs = FsProvider.instance;
    const cacheDirectory = path.join(PathResolver.MOD_ROOT, 'cache');
    try {
        await fs.readdir(path.join(cacheDirectory, combo.getMod().getFullName(), combo.getVersion().getVersionNumber().toString()));
        return true;
    } catch(e) {
        return false;
    }
}

/**
 * Returns a rounded, clamped percentage based on current and target progress numbers.
 *
 * @param currentProgress The current progress so far.
 * @param targetProgress The total target progress.
 * @returns The progress as an integer percentage, between 0 and 100.
 */
export function generateProgressPercentage(currentProgress: number, targetProgress: number): number {
    // Target progress might be 0 e.g. if all mods are cached and
    // nothing needs to be downloaded.
    if (targetProgress === 0) {
        return 100;
    }

    if (currentProgress > targetProgress) {
        console.warn(`Current progress (${currentProgress}) exceeds target progress (${targetProgress}) while generating a progress percentage`);
        return 100;
    }

    const percentage = Math.round(currentProgress / targetProgress * 100);
    return Math.max(0, Math.min(100, percentage));
}
