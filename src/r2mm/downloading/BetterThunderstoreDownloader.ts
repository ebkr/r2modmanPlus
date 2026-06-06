import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ZipExtract from '../installing/ZipExtract';
import R2Error from '../../model/errors/R2Error';
import PathResolver from '../../r2mm/manager/PathResolver';
import FsProvider from '../../providers/generic/file/FsProvider';
import ThunderstoreDownloaderProvider from '../../providers/ror2/downloading/ThunderstoreDownloaderProvider';
import * as DownloadUtils from '../../utils/DownloadUtils';
import { DownloadStatusEnum } from '../../model/enums/DownloadStatusEnum';
import path from '../../providers/node/path/path';

export default class BetterThunderstoreDownloader extends ThunderstoreDownloaderProvider {

    public async download(
        combos: ThunderstoreCombo[],
        ignoreCache: boolean,
        totalProgressCallback: (downloadedSize: number, modName: string, status: DownloadStatusEnum, err: R2Error | null) => void
    ): Promise<void> {
        if (combos.length === 0) {
            throw new R2Error('No mods to download', 'An empty list of mods was passed to the downloader');
        }

        let modInProgressName = combos[0].getMod().getName();
        let finishedModsDownloadedSize = 0;

        const singleModProgressCallback = (downloadedBytes: number, status: DownloadStatusEnum, err: R2Error | null) => {
            let modInProgressDownloadedSize;

            if (status === DownloadStatusEnum.FAILED) {
                throw err;
            } else if (status === DownloadStatusEnum.DOWNLOADING || status === DownloadStatusEnum.EXTRACTING) {
                modInProgressDownloadedSize = downloadedBytes;
            } else if (status === DownloadStatusEnum.EXTRACTED) {
                finishedModsDownloadedSize += downloadedBytes;
                modInProgressDownloadedSize = 0;
            } else {
                console.error(`Ignore unknown status code "${status}"`);
                return;
            }

            totalProgressCallback(
                finishedModsDownloadedSize + modInProgressDownloadedSize,
                modInProgressName,
                status,
                err
            );
        }

        for (const comboInProgress of combos) {
            modInProgressName = comboInProgress.getMod().getName();

            if (!ignoreCache && await DownloadUtils.isVersionAlreadyDownloaded(comboInProgress)) {
                singleModProgressCallback(0, DownloadStatusEnum.EXTRACTED, null);
                continue;
            }

            try {
                await this._downloadAndExtract(comboInProgress, singleModProgressCallback);
                await DownloadUtils.markAsDownloadedFromOnline(comboInProgress);
            } catch(e) {
                throw R2Error.fromThrownValue(e, `Failed to download mod ${comboInProgress.getVersion().getFullName()}`);
            }
        }
    }

    private async _downloadAndExtract(combo: ThunderstoreCombo, callback: (downloadedBytes: number, status: DownloadStatusEnum, err: R2Error | null) => void): Promise<void> {
        const fs = FsProvider.instance;
        const modCacheDirectory = path.join(PathResolver.MOD_ROOT, 'cache', combo.getMod().getFullName());
        if (! await fs.exists(modCacheDirectory)) {
            await fs.mkdirs(modCacheDirectory);
        }

        const zipName = combo.getVersion().getVersionNumber().toString() + '.zip';

        await window.node.net.download(
            combo.getVersion().getDownloadUrl(),
            path.join(modCacheDirectory, zipName),
            (downloadedBytes) => callback(downloadedBytes, DownloadStatusEnum.DOWNLOADING, null)
        );

        const comboSize = combo.getVersion().getFileSize();
        callback(comboSize, DownloadStatusEnum.EXTRACTING, null);
        await ZipExtract.extractAndDelete(
            modCacheDirectory,
            zipName,
            combo.getVersion().getVersionNumber().toString(),
            (success: boolean, error?: R2Error) => {
                if (success) {
                    callback(comboSize, DownloadStatusEnum.EXTRACTED, null);
                } else {
                    callback(comboSize, DownloadStatusEnum.FAILED, error || null);
                }
            }
        );
    }

}
