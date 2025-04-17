import ThunderstoreVersion from '../../model/ThunderstoreVersion';
import StatusEnum from '../../model/enums/StatusEnum';
import axios, { AxiosResponse } from 'axios';
import ManifestV2 from "../../model/ManifestV2";
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ZipExtract from '../installing/ZipExtract';
import R2Error from '../../model/errors/R2Error';
import PathResolver from '../../r2mm/manager/PathResolver';
import * as path from 'path';
import FsProvider from '../../providers/generic/file/FsProvider';
import FileWriteError from '../../model/errors/FileWriteError';
import { ImmutableProfile } from '../../model/Profile';
import ThunderstoreDownloaderProvider, { DependencySetBuilderMode } from '../../providers/ror2/downloading/ThunderstoreDownloaderProvider';
import ManagerInformation from '../../_managerinf/ManagerInformation';
import ProfileModList from '../../r2mm/mods/ProfileModList';
import GameManager from '../../model/game/GameManager';
import * as PackageDb from '../../r2mm/manager/PackageDexieStore';

export default class BetterThunderstoreDownloader extends ThunderstoreDownloaderProvider {

    public async buildDependencySet(
        mod: ThunderstoreVersion,
        builder: ThunderstoreCombo[],
        mode: DependencySetBuilderMode
    ): Promise<void> {
        const game = GameManager.activeGame;
        const useLatestVersion = Boolean(mode);
        let foundDependencies = await PackageDb.getCombosByDependencyStrings(game, mod.getDependencies(), useLatestVersion);

        // Filter out already added AFTER reading packages from the DB to
        // ensure the recursion works as expected.
        const alreadyAdded = builder.map((seenMod) => seenMod.getMod().getFullName());
        foundDependencies = foundDependencies.filter(
            (dep) => !alreadyAdded.includes(dep.getMod().getFullName())
        );

        foundDependencies.forEach(found => builder.push(found));

        for (const dependency of foundDependencies) {
            await this.buildDependencySet(dependency.getVersion(), builder, mode);
        }
    }

    public sortDependencyOrder(deps: ThunderstoreCombo[]) {
        deps.sort((a, b) => {
            if (a.getVersion().getDependencies().find(value => value.startsWith(b.getMod().getFullName() + "-"))) {
                return 1;
            } else {
                return -1;
            }
        })
    }

    public async downloadLatestOfAll(modsWithUpdates: ThunderstoreCombo[], ignoreCache: boolean,
                                      callback: (progress: number, modName: string, status: number, err: R2Error | null) => void,
                                      completedCallback: (modList: ThunderstoreCombo[]) => void) {

        const dependencies: ThunderstoreCombo[] = [...modsWithUpdates];

        for (const mod of modsWithUpdates) {
            await this.buildDependencySet(mod.getVersion(), dependencies, DependencySetBuilderMode.USE_LATEST_VERSION);
        }

        this.sortDependencyOrder(dependencies);

        let downloadCount = 0;
        const downloadableDependencySize = this.calculateInitialDownloadSize(dependencies);

        await this.queueDownloadDependencies(dependencies.entries(), ignoreCache, (progress: number, modName: string, status: number, err: R2Error | null) => {
            if (status === StatusEnum.FAILURE) {
                callback(0, modName, status, err);
            } else if (status === StatusEnum.PENDING) {
                callback(this.generateProgressPercentage(progress, downloadCount, downloadableDependencySize + 1), modName, status, err);
            } else if (status === StatusEnum.SUCCESS) {
                callback(this.generateProgressPercentage(progress, downloadCount, downloadableDependencySize + 1), modName, StatusEnum.PENDING, err);
                downloadCount += 1;
                if (downloadCount >= dependencies.length) {
                    callback(100, modName, StatusEnum.PENDING, err);
                    completedCallback([...dependencies]);
                }
            }
        });
    }

    public async download(
        profile: ImmutableProfile,
        combo: ThunderstoreCombo,
        ignoreCache: boolean,
        totalProgressCallback: (progress: number, modName: string, status: number, err: R2Error | null) => void
    ): Promise<ThunderstoreCombo[]> {

        const modList = await ProfileModList.getModList(profile);
        if (modList instanceof R2Error) {
            totalProgressCallback(0, combo.getMod().getName(), StatusEnum.FAILURE, modList);
            throw modList;
        }

        const dependencies = await this.getDependenciesWithCorrectVersions(combo, modList);
        const allModsToDownload = [combo, ...dependencies];

        let modInProgressName = combo.getMod().getName();
        let downloadCount = 0;
        // Mark the mod 80% processed when the download completes, save the remaining 20% for extracting.
        const singleModProgressCallback = (downloadProgress: number, status: number, err: R2Error | null) => {
            if (status === StatusEnum.FAILURE) {
                throw err;
            }

            let totalDownloadProgress: number;
            if (status === StatusEnum.PENDING) {
                totalDownloadProgress = this.generateProgressPercentage(downloadProgress * 0.8, downloadCount, allModsToDownload.length);
            } else if (status === StatusEnum.SUCCESS) {
                totalDownloadProgress = this.generateProgressPercentage(100, downloadCount, allModsToDownload.length);
                downloadCount += 1;
            } else {
                console.error(`Ignore unknown status code "${status}"`);
                return;
            }
            totalProgressCallback(Math.round(totalDownloadProgress), modInProgressName, status, err);
        }

        for (const comboInProgress of allModsToDownload) {
            modInProgressName = comboInProgress.getMod().getName();

            if (!ignoreCache && await this.isVersionAlreadyDownloaded(comboInProgress)) {
                singleModProgressCallback(100, StatusEnum.SUCCESS, null);
                continue;
            }

            try {
                const response = await this._downloadCombo(comboInProgress, singleModProgressCallback);
                await this._saveDownloadResponse(response, comboInProgress, singleModProgressCallback);
            } catch(e) {
                throw R2Error.fromThrownValue(e, `Failed to download mod ${comboInProgress.getVersion().getFullName()}`);
            }
        }
        return allModsToDownload;
    }

    /**
     * When installing a modpack ensure compatibility by installing the exact versions of dependencies,
     * even if it means upgrading/downgrading already installed mods.
     * When installing a regular mod, install the latest versions of dependencies,
     * but don't change already installed mods.
     */
    private async getDependenciesWithCorrectVersions(combo: ThunderstoreCombo, modList: ManifestV2[]) {
        const dependencies: ThunderstoreCombo[] = [];
        const isModpack = combo.getMod().getCategories().some(value => value === "Modpacks");
        const versionMode = isModpack ? DependencySetBuilderMode.USE_EXACT_VERSION : DependencySetBuilderMode.USE_LATEST_VERSION;

        await this.buildDependencySet(combo.getVersion(), dependencies, versionMode);
        this.sortDependencyOrder(dependencies);

        return isModpack ? dependencies :
            dependencies.filter((dep) => {
                return !(modList.some(installed => installed.getName() === dep.getMod().getFullName()));
            });
    }

    public async downloadImportedMods(
        modList: ThunderstoreCombo[],
        ignoreCache: boolean,
        totalProgressCallback: (progress: number) => void
    ) {
        let downloadCount = 0;

        // Mark the mod 80% processed when the download completes, save the remaining 20% for extracting.
        const singleModProgressCallback = (progress: number, status: number, err: R2Error | null) => {
            if (status === StatusEnum.FAILURE) {
                throw err;
            }

            let totalProgress: number;
            if (status === StatusEnum.PENDING) {
                totalProgress = this.generateProgressPercentage(progress * 0.8, downloadCount, modList.length);
            } else if (status === StatusEnum.SUCCESS) {
                totalProgress = this.generateProgressPercentage(100, downloadCount, modList.length);
                downloadCount += 1;
            } else {
                console.error(`Ignore unknown status code "${status}"`);
                return;
            }

            totalProgressCallback(totalProgress);
        }

        for (const combo of modList) {
            if (!ignoreCache && await this.isVersionAlreadyDownloaded(combo)) {
                singleModProgressCallback(100, StatusEnum.SUCCESS, null);
                continue;
            }

            try {
                const response = await this._downloadCombo(combo, singleModProgressCallback);
                await this._saveDownloadResponse(response, combo, singleModProgressCallback);
            } catch(e) {
                throw R2Error.fromThrownValue(e, `Failed to download mod ${combo.getVersion().getFullName()}`);
            }
        }

        totalProgressCallback(100);
    }

    public generateProgressPercentage(progress: number, currentIndex: number, total: number): number {
        const completedProgress = (currentIndex / total) * 100;
        return completedProgress + (progress * 1/total);
    }

    public async queueDownloadDependencies(entries: IterableIterator<[number, ThunderstoreCombo]>, ignoreCache: boolean, callback: (progress: number, modName: string, status: number, err: R2Error | null) => void) {
        const entry = entries.next();
        if (!entry.done) {
            await this.downloadAndSave(entry.value[1] as ThunderstoreCombo, ignoreCache, async (progress: number, status: number, err: R2Error | null) => {
                if (status === StatusEnum.FAILURE) {
                    callback(0, (entry.value[1] as ThunderstoreCombo).getMod().getName(), status, err);
                } else if (status === StatusEnum.PENDING) {
                    callback(progress, (entry.value[1] as ThunderstoreCombo).getMod().getName(), status, err);
                } else if (status === StatusEnum.SUCCESS) {
                    callback(100, (entry.value[1] as ThunderstoreCombo).getMod().getName(), status, err);
                    await this.queueDownloadDependencies(entries, ignoreCache, callback);
                }
            });
        }
    }

    public calculateInitialDownloadSize(list: ThunderstoreCombo[]): number {
        return list.length;
    }

    public async downloadAndSave(combo: ThunderstoreCombo, ignoreCache: boolean, callback: (progress: number, status: number, err: R2Error | null) => void) {
        if (!ignoreCache && await this.isVersionAlreadyDownloaded(combo)) {
            callback(100, StatusEnum.SUCCESS, null);
            return;
        }
        this._downloadCombo(combo, callback)
            .then(async response => this._saveDownloadResponse(response, combo, callback))
            .catch((reason: Error) => {
                callback(100, StatusEnum.FAILURE, new R2Error(`Failed to download mod ${combo.getVersion().getFullName()}`, reason.message, null));
            })
    }

    private async _downloadCombo(combo: ThunderstoreCombo, callback: (progress: number, status: number, err: R2Error | null) => void): Promise<AxiosResponse> {
        return axios.get(combo.getVersion().getDownloadUrl(), {
            onDownloadProgress: progress => {
                callback((progress.loaded / progress.total) * 100, StatusEnum.PENDING, null);
            },
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/zip',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    private async _saveDownloadResponse(response: AxiosResponse, combo: ThunderstoreCombo, callback: (progress: number, status: number, err: R2Error | null) => void): Promise<void> {
        const buf: Buffer = Buffer.from(response.data)
        callback(100, StatusEnum.PENDING, null);
        await this.saveToFile(buf, combo, (success: boolean, error?: R2Error) => {
            if (success) {
                callback(100, StatusEnum.SUCCESS, error || null);
            } else {
                callback(100, StatusEnum.FAILURE, error || null);
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

}
