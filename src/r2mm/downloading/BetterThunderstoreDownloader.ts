import StatusEnum from '../../model/enums/StatusEnum';
import axios, { AxiosResponse } from 'axios';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ZipExtract from '../installing/ZipExtract';
import R2Error from '../../model/errors/R2Error';
import PathResolver from '../../r2mm/manager/PathResolver';
import FsProvider from '../../providers/generic/file/FsProvider';
import FileWriteError from '../../model/errors/FileWriteError';
import ThunderstoreDownloaderProvider from '../../providers/ror2/downloading/ThunderstoreDownloaderProvider';
import ManagerInformation from '../../_managerinf/ManagerInformation';
import * as DownloadUtils from '../../utils/DownloadUtils';
import path from '../../providers/node/path/path';
import Buffer from '../../providers/node/buffer/buffer';

export default class BetterThunderstoreDownloader extends ThunderstoreDownloaderProvider {

    public async download(
        combos: ThunderstoreCombo[],
        ignoreCache: boolean,
        totalProgressCallback: (downloadedSize: number, modName: string, status: number, err: R2Error | null) => void
    ): Promise<void> {
        if (combos.length === 0) {
            throw new R2Error('No mods to download', 'An empty list of mods was passed to the downloader');
        }

        let modInProgressName = combos[0].getMod().getName();
        let finishedModsDownloadedSize = 0;

        const singleModProgressCallback = (downloadedBytes: number, status: number, err: R2Error | null) => {
            let modInProgressDownloadedSize;

            if (status === StatusEnum.FAILURE) {
                throw err;
            } else if (status === StatusEnum.PENDING) {
                modInProgressDownloadedSize = downloadedBytes;
            } else if (status === StatusEnum.SUCCESS) {
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
                singleModProgressCallback(0, StatusEnum.SUCCESS, null);
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

    private async _downloadCombo(combo: ThunderstoreCombo, callback: (downloadedBytes: number, status: number, err: R2Error | null) => void): Promise<AxiosResponse> {
        return axios.get(combo.getVersion().getDownloadUrl(), {
            onDownloadProgress: progress => callback(progress.loaded, StatusEnum.PENDING, null),
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/zip',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    private async _saveDownloadResponse(response: AxiosResponse, combo: ThunderstoreCombo, callback: (downloadedBytes: number, status: number, err: R2Error | null) => void): Promise<void> {
        const buf: Buffer = Buffer.from(response.data);
        const comboSize = combo.getVersion().getFileSize();
        callback(comboSize, StatusEnum.PENDING, null);
        await this.saveToFile(buf, combo, (success: boolean, error?: R2Error) => {
            if (success) {
                callback(comboSize, StatusEnum.SUCCESS, null);
            } else {
                callback(comboSize, StatusEnum.FAILURE, error || null);
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

}
