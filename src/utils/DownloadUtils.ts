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

export async function getTotalDownloadSizeInBytes(combos: ThunderstoreCombo[], ignoreCache: boolean): Promise<number> {
    let filteredCombos = [];
    if (ignoreCache) {
        filteredCombos = combos;
    } else {
        for (const combo of combos) {
            if (!(await isVersionAlreadyDownloaded(combo))) {
                filteredCombos.push(combo);
            }
        }
    }
    return filteredCombos.reduce((total, combo) => total + combo.getVersion().getFileSize(), 0);
}

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

export function generateProgressPercentage(downloadedSize: number, totalDownloadSize: number): number {
    return totalDownloadSize == 0 ? 100 : Math.round(downloadedSize / totalDownloadSize * 100);
}
