import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ZipExtract from '../installing/ZipExtract';
import R2Error from '../../model/errors/R2Error';
import PathResolver from '../../r2mm/manager/PathResolver';
import FsProvider from '../../providers/generic/file/FsProvider';
import FileWriteError from '../../model/errors/FileWriteError';
import ThunderstoreDownloaderProvider from '../../providers/ror2/downloading/ThunderstoreDownloaderProvider';
import ManagerInformation from '../../_managerinf/ManagerInformation';
import * as DownloadUtils from '../../utils/DownloadUtils';
import { DownloadStatusEnum } from '../../model/enums/DownloadStatusEnum';
import path from '../../providers/node/path/path';
import Buffer from '../../providers/node/buffer/buffer';

export default class BetterThunderstoreDownloader extends ThunderstoreDownloaderProvider {

    public async download(
        combos: ThunderstoreCombo[],
        ignoreCache: boolean,
        totalProgressCallback: (downloadedSize: number, modName: string, status: DownloadStatusEnum, err: R2Error | null) => void
    ): Promise<void> {
        if (combos.length === 0) {
            throw new R2Error('No mods to download', 'An empty list of mods was passed to the downloader');
        }

        let modInProgressName = combos[0]!.getMod().getName();
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
                const fs = FsProvider.instance;
                const cacheDirectory = path.join(PathResolver.MOD_ROOT, 'cache');
                const modFolder = path.join(cacheDirectory, comboInProgress.getMod().getFullName());
                const zipFileName = comboInProgress.getVersion().getVersionNumber().toString() + '.zip';
                const zipPath = path.join(modFolder, zipFileName);
                const versionFolder = comboInProgress.getVersion().getVersionNumber().toString();

                if (!await fs.exists(modFolder)) {
                    await fs.mkdirs(modFolder);
                }

                await fs.downloadFile(
                    comboInProgress.getVersion().getDownloadUrl(),
                    zipPath,
                    (loaded) => singleModProgressCallback(loaded, DownloadStatusEnum.DOWNLOADING, null)
                );

                const comboSize = comboInProgress.getVersion().getFileSize();
                singleModProgressCallback(comboSize, DownloadStatusEnum.EXTRACTING, null);

                await new Promise<void>((resolve, reject) => {
                    ZipExtract.extractAndDelete(
                        modFolder,
                        zipFileName,
                        versionFolder,
                        (success: boolean, error?: R2Error) => {
                            if (success) {
                                singleModProgressCallback(comboSize, DownloadStatusEnum.EXTRACTED, null);
                                resolve();
                            } else {
                                singleModProgressCallback(comboSize, DownloadStatusEnum.FAILED, error || null);
                                reject(error || new Error('Extraction failed'));
                            }
                        }
                    );
                });

                await DownloadUtils.markAsDownloadedFromOnline(comboInProgress);
            } catch(e) {
                throw R2Error.fromThrownValue(e, `Failed to download mod ${comboInProgress.getVersion().getFullName()}`);
            }
        }
    }

    public async saveToFile(response: Buffer, combo: ThunderstoreCombo, callback: (success: boolean, error?: R2Error) => void) {
        const fs = FsProvider.instance;
        const cacheDirectory = path.join(PathResolver.MOD_ROOT, 'cache');
        try {
            if (! await fs.exists(path.join(cacheDirectory, combo.getMod().getFullName()))) {
                await fs.mkdirs(path.join(cacheDirectory, combo.getMod().getFullName()));
            }
            await fs.writeFile(path.join(
                cacheDirectory,
                combo.getMod().getFullName(),
                combo.getVersion().getVersionNumber().toString() + '.zip'
            ), response);
            await ZipExtract.extractAndDelete(
                path.join(cacheDirectory, combo.getMod().getFullName()),
                combo.getVersion().getVersionNumber().toString() + '.zip',
                combo.getVersion().getVersionNumber().toString(),
                callback
            );
        } catch(e) {
            callback(false, new FileWriteError(
                'File write error',
                `Failed to write downloaded zip of ${combo.getMod().getFullName()} cache folder. \nReason: ${(e as Error).message}`,
                `Try running ${ManagerInformation.APP_NAME} as an administrator`
            ));
        }
    }

}
