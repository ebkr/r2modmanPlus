import StatusEnum from '../../model/enums/StatusEnum';
import axios, { AxiosResponse } from 'axios';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ZipExtract from '../installing/ZipExtract';
import R2Error from '../../model/errors/R2Error';
import PathResolver from '../../r2mm/manager/PathResolver';
import * as path from 'path';
import FsProvider from '../../providers/generic/file/FsProvider';
import FileWriteError from '../../model/errors/FileWriteError';
import ThunderstoreDownloaderProvider from '../../providers/ror2/downloading/ThunderstoreDownloaderProvider';
import ManagerInformation from '../../_managerinf/ManagerInformation';
import { generateProgressPercentage } from '../../utils/DownloadUtils';
import ManagerSettings from '../manager/ManagerSettings';
import * as DownloadUtils from '../../utils/DownloadUtils';

export default class BetterThunderstoreDownloader extends ThunderstoreDownloaderProvider {

    public async download(
        combos: ThunderstoreCombo[],
        ignoreCache: boolean,
        totalProgressCallback: (progress: number, downloadedSize: number, modName: string, status: number, err: R2Error | null) => void
    ): Promise<void> {
        let modInProgressName = combos[0].getMod().getName();
        let downloadCount = 0;
        let finishedDownloadsDownloadedSize = 0;
        let currentDownloadDownloadedSize = 0;

        // Mark the mod 80% processed when the download completes, save the remaining 20% for extracting.
        const singleModProgressCallback = (downloadProgress: number, comboSize: number, status: number, err: R2Error | null) => {
            if (status === StatusEnum.FAILURE) {
                throw err;
            }

            let totalDownloadProgress: number;
            if (status === StatusEnum.PENDING) {
                totalDownloadProgress = generateProgressPercentage(downloadProgress * 0.8, downloadCount, combos.length);
                currentDownloadDownloadedSize = (downloadProgress / 100) * comboSize;
            } else if (status === StatusEnum.SUCCESS) {
                totalDownloadProgress = generateProgressPercentage(100, downloadCount, combos.length);
                finishedDownloadsDownloadedSize += comboSize;
                currentDownloadDownloadedSize = 0;
                downloadCount += 1;
            } else {
                console.error(`Ignore unknown status code "${status}"`);
                return;
            }
            totalProgressCallback(
                Math.round(totalDownloadProgress),
                finishedDownloadsDownloadedSize + currentDownloadDownloadedSize,
                modInProgressName,
                status,
                err
            );
        }

        for (const comboInProgress of combos) {
            modInProgressName = comboInProgress.getMod().getName();

            if (!ignoreCache && await this.isVersionAlreadyDownloaded(comboInProgress)) {
                singleModProgressCallback(100, 0, StatusEnum.SUCCESS, null);
                continue;
            }

            try {
                const response = await this._downloadCombo(comboInProgress, singleModProgressCallback);
                await this._saveDownloadResponse(response, comboInProgress, singleModProgressCallback);
            } catch(e) {
                throw R2Error.fromThrownValue(e, `Failed to download mod ${comboInProgress.getVersion().getFullName()}`);
            }
        }
    }

    private async _downloadCombo(combo: ThunderstoreCombo, callback: (progress: number, downloadedSize: number, status: number, err: R2Error | null) => void): Promise<AxiosResponse> {
        return axios.get(combo.getVersion().getDownloadUrl(), {
            onDownloadProgress: progress => {
                callback(
                    (progress.loaded / progress.total) * 100,
                    combo.getVersion().getFileSize(),
                    StatusEnum.PENDING,
                    null
                );
            },
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/zip',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    private async _saveDownloadResponse(response: AxiosResponse, combo: ThunderstoreCombo, callback: (progress: number, downloadedSize: number, status: number, err: R2Error | null) => void): Promise<void> {
        const buf: Buffer = Buffer.from(response.data)
        callback(100, combo.getVersion().getFileSize(), StatusEnum.PENDING, null);
        await this.saveToFile(buf, combo, (success: boolean, error?: R2Error) => {
            if (success) {
                callback(100, combo.getVersion().getFileSize(), StatusEnum.SUCCESS, null);
            } else {
                callback(100, combo.getVersion().getFileSize(), StatusEnum.FAILURE, error || null);
            }
        });
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

    public async isVersionAlreadyDownloaded(combo: ThunderstoreCombo): Promise<boolean>  {
        const fs = FsProvider.instance;
        const cacheDirectory = path.join(PathResolver.MOD_ROOT, 'cache');
        try {
            await fs.readdir(path.join(cacheDirectory, combo.getMod().getFullName(), combo.getVersion().getVersionNumber().toString()));
            return true;
        } catch(e) {
            return false;
        }
    }

    public async getTotalDownloadSizeInBytes(combos: ThunderstoreCombo[], settings: ManagerSettings): Promise<number> {
        const filteredList = combos.filter(async value => !(await this.isVersionAlreadyDownloaded(value)) || settings.getContext().global.ignoreCache)
            .map(value => value.getVersion().getFileSize());
        if (filteredList.length > 0) {
            return filteredList.reduce((previousValue, currentValue) => previousValue + currentValue) || 0;
        } else {
            return 0;
        }
    }

}
