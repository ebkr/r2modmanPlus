import ThunderstoreVersion from '../../model/ThunderstoreVersion';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import VersionNumber from '../../model/VersionNumber';
import StatusEnum from '../../model/enums/StatusEnum';
import axios from 'axios';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ZipExtract from '../installing/ZipExtract';
import R2Error from '../../model/errors/R2Error';
import PathResolver from '../../r2mm/manager/PathResolver';
import * as path from 'path';
import FsProvider from '../../providers/generic/file/FsProvider';
import FileWriteError from '../../model/errors/FileWriteError';
import Profile from '../../model/Profile';
import ThunderstorePackages from '../data/ThunderstorePackages';
import ExportMod from '../../model/exports/ExportMod';
import ManagerSettings from '../manager/ManagerSettings';
import ManifestV2 from '../../model/ManifestV2';
import ModBridge from '../mods/ModBridge';
import ThunderstoreDownloaderProvider from '../../providers/ror2/downloading/ThunderstoreDownloaderProvider';
import ManagerInformation from '../../_managerinf/ManagerInformation';
import Game from '../../model/game/Game';
import ProfileModList from '../../r2mm/mods/ProfileModList';
import DownloadProgress from '../../model/installing/DownloadProgress';

export default class BetterThunderstoreDownloader extends ThunderstoreDownloaderProvider {

    public buildDependencySet(mod: ThunderstoreVersion, allMods: ThunderstoreMod[], builder: ThunderstoreCombo[]): ThunderstoreCombo[] {
        const foundDependencies = new Array<ThunderstoreCombo>();
        mod.getDependencies().forEach(dependency => {
            // Find matching ThunderstoreMod.
            const matchingProvider: ThunderstoreMod | undefined = allMods.find(o => dependency.startsWith(o.getFullName() + "-"));
            if (matchingProvider !== undefined) {
                const version = new VersionNumber(dependency.substring(matchingProvider.getFullName().length + 1));
                // Find ThunderstoreVersion with VersionNumber matching ${version}
                const matchingVersion = matchingProvider.getVersions().find(v => v.getVersionNumber().isEqualTo(version));
                if (matchingVersion !== undefined) {
                    let otherVersionAlreadyAdded = false;
                    builder.forEach(v => {
                        // If otherVersionAlreadyAdded, or full names are equal
                        otherVersionAlreadyAdded = otherVersionAlreadyAdded || v.getMod().getFullName() === matchingProvider.getFullName();
                    });
                    if (!otherVersionAlreadyAdded) {
                        const tsCombo = new ThunderstoreCombo();
                        tsCombo.setMod(matchingProvider);
                        tsCombo.setVersion(matchingVersion);
                        foundDependencies.push(tsCombo);
                    }
                }
            }
        })
        foundDependencies.forEach(found => builder.push(found));
        foundDependencies.forEach(found => this.buildDependencySet(found.getVersion(), allMods, builder));
        return builder;
    }

    public buildDependencySetUsingLatest(mod: ThunderstoreVersion, allMods: ThunderstoreMod[], builder: ThunderstoreCombo[]): ThunderstoreCombo[] {
        const foundDependencies = new Array<ThunderstoreCombo>();
        mod.getDependencies().forEach(dependency => {
            // Find matching ThunderstoreMod.
            const matchingProvider: ThunderstoreMod | undefined = allMods.find(o => dependency.startsWith(o.getFullName() + "-"));
            if (matchingProvider !== undefined) {
                // Get latest version of dependency
                const matchingVersion = matchingProvider.getVersions().reduce((one: ThunderstoreVersion, two: ThunderstoreVersion) => {
                    if (one.getVersionNumber().isNewerThan(two.getVersionNumber())) {
                        return one;
                    } return two;
                });
                let otherVersionAlreadyAdded = false;
                builder.forEach(v => {
                    // If otherVersionAlreadyAdded, or full names are equal
                    otherVersionAlreadyAdded = otherVersionAlreadyAdded || v.getMod().getFullName() === matchingProvider.getFullName();
                });
                if (!otherVersionAlreadyAdded) {
                    const tsCombo = new ThunderstoreCombo();
                    tsCombo.setMod(matchingProvider);
                    tsCombo.setVersion(matchingVersion);
                    foundDependencies.push(tsCombo);
                }
            }
        })
        foundDependencies.forEach(found => builder.push(found));
        foundDependencies.forEach(found => this.buildDependencySetUsingLatest(found.getVersion(), allMods, builder));
        return builder;
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

    public getLatestOfAllToUpdate(mods: ManifestV2[], allMods: ThunderstoreMod[]): ThunderstoreCombo[] {
        var depMap: Map<string, ThunderstoreCombo> = new Map();
        const dependencies: ThunderstoreCombo[] = [];
        mods.forEach(value => {
            const tsMod = ModBridge.getThunderstoreModFromMod(value, allMods);
            if (tsMod !== undefined) {
                this.buildDependencySetUsingLatest(tsMod.getVersions()![0], allMods, dependencies);
                const combo = new ThunderstoreCombo();
                combo.setMod(tsMod);
                combo.setVersion(tsMod.getVersions()![0])
                dependencies.push(combo);
            }
        });

        // Keep array unique in case scenario happens where dependency X is picked up before X install listing.
        dependencies.forEach(value => depMap.set(value.getMod().getFullName(), value));

        dependencies.forEach(value => {
            depMap.set(value.getMod().getFullName(), value);
        });

        return Array.from(depMap.values()).filter(value => {
            const result = mods.find(value1 => {
                return value1.getName() === value.getMod().getFullName();
            });
            if (result !== undefined) {
                return !result.getVersionNumber().isEqualTo(value.getVersion().getVersionNumber());
            }
            return false;
        });
    }

    public async downloadLatestOfAll(game: Game, mods: ManifestV2[], allMods: ThunderstoreMod[],
                                      callback: (downloadProgress: DownloadProgress) => void,
                                      completedCallback: (modList: ThunderstoreCombo[]) => void) {

        const dependenciesToUpdate: ThunderstoreCombo[] = this.getLatestOfAllToUpdate(mods, allMods);
        const dependencies: ThunderstoreCombo[] = [...dependenciesToUpdate];
        dependenciesToUpdate.forEach(value => {
            this.buildDependencySetUsingLatest(value.getVersion(), allMods, dependencies);
        });

        this.sortDependencyOrder(dependencies);

        let downloadCount = 0;
        const downloadableDependencySize = this.calculateInitialDownloadSize(await ManagerSettings.getSingleton(game), dependencies);

        const totalDownloadSizeInBytes = this.getTotalDownloadSizeInBytes(dependencies, await ManagerSettings.getSingleton(game));

        await this.queueDownloadDependencies(await ManagerSettings.getSingleton(game), dependencies.entries(), (downloadProgress: DownloadProgress) => {
            if (downloadProgress.status === StatusEnum.FAILURE) {
                callback(downloadProgress);
            } else if (downloadProgress.status === StatusEnum.PENDING) {
                callback({
                    progress: this.generateProgressPercentage(downloadProgress, downloadCount, downloadableDependencySize + 1),
                    status: downloadProgress.status,
                    err: downloadProgress.err,
                    currentModDownloadSize: downloadProgress.currentModDownloadSize,
                    currentModBytesDownloaded: downloadProgress.currentModBytesDownloaded,
                    mod: downloadProgress.mod,
                    totalDownloadSize: totalDownloadSizeInBytes,
                    currentModDownloadProgress: downloadProgress.currentModDownloadProgress,
                });
            } else if (downloadProgress.status === StatusEnum.SUCCESS) {
                callback({
                    progress: this.generateProgressPercentage(downloadProgress, downloadCount, downloadableDependencySize + 1),
                    status: StatusEnum.PENDING,
                    err: downloadProgress.err,
                    currentModDownloadSize: downloadProgress.currentModDownloadSize,
                    currentModBytesDownloaded: downloadProgress.currentModBytesDownloaded,
                    mod: downloadProgress.mod,
                    totalDownloadSize: totalDownloadSizeInBytes,
                    currentModDownloadProgress: downloadProgress.currentModDownloadProgress,
                });
                downloadCount += 1;
                if (downloadCount >= dependencies.length) {
                    callback({
                        progress: 100,
                        status: StatusEnum.PENDING,
                        err: downloadProgress.err,
                        currentModDownloadSize: downloadProgress.currentModDownloadSize,
                        currentModBytesDownloaded: downloadProgress.currentModBytesDownloaded,
                        mod: downloadProgress.mod,
                        totalDownloadSize: totalDownloadSizeInBytes,
                        currentModDownloadProgress: downloadProgress.currentModDownloadProgress,
                    });
                    completedCallback([...dependencies]);
                }
            }
        });
    }

    public async download(game: Game, profile: Profile, mod: ThunderstoreMod, modVersion: ThunderstoreVersion, allMods: ThunderstoreMod[],
                           callback: (downloadProgress: DownloadProgress) => void,
                           completedCallback: (modList: ThunderstoreCombo[]) => void) {
        let dependencies = this.buildDependencySet(modVersion, allMods, new Array<ThunderstoreCombo>());
        this.sortDependencyOrder(dependencies);
        const combo = new ThunderstoreCombo();
        combo.setMod(mod);
        combo.setVersion(modVersion);
        let downloadCount = 0;

        const modList = await ProfileModList.getModList(profile);
        if (modList instanceof R2Error) {
            return callback({
                progress: 0,
                status: StatusEnum.FAILURE,
                err: modList,
                currentModDownloadSize: mod.getFileSize() || 0,
                currentModBytesDownloaded: mod.getFileSize() || 0,
                mod: mod,
                totalDownloadSize: combo.getVersion().getFileSize(),
                currentModDownloadProgress: 0,
            });
        }

        const settings = await ManagerSettings.getSingleton(game);
        let downloadableDependencySize = this.calculateInitialDownloadSize(settings, dependencies);

        // Determine if modpack
        // If modpack, use specified dependencies as retrieved above
        // If not, get latest version of dependencies.
        let isModpack = combo.getMod().getCategories().find(value => value === "Modpacks") !== undefined;
        if (!isModpack) {
            // If not modpack, get latest
            dependencies = this.buildDependencySetUsingLatest(modVersion, allMods, new Array<ThunderstoreCombo>());
            this.sortDependencyOrder(dependencies);
            // #270: Remove already-installed dependencies to prevent updating.
            dependencies = dependencies.filter(dep => (modList.find(installed => installed.getName() === dep.getMod().getFullName()) === undefined) || settings.getContext().global.ignoreCache);
            downloadableDependencySize = this.calculateInitialDownloadSize(settings, dependencies);
        }

        console.log("Size of download", dependencies, this.getTotalDownloadSizeInBytes(dependencies, settings), combo.getVersion().getFileSize())
        const totalDownloadSizeInBytes = this.getTotalDownloadSizeInBytes(dependencies, settings) + combo.getVersion().getFileSize();

        await this.downloadAndSave(combo, settings, async (downloadProgress: DownloadProgress) => {
            if (downloadProgress.status === StatusEnum.FAILURE) {
                callback(downloadProgress);
            } else if (downloadProgress.status === StatusEnum.PENDING) {
                callback({
                    progress: this.generateProgressPercentage(downloadProgress, downloadCount, downloadableDependencySize + 1),
                    status: downloadProgress.status,
                    err: downloadProgress.err,
                    currentModDownloadSize: downloadProgress.currentModDownloadSize,
                    currentModBytesDownloaded: downloadProgress.currentModBytesDownloaded,
                    mod: downloadProgress.mod,
                    totalDownloadSize: totalDownloadSizeInBytes,
                    currentModDownloadProgress: downloadProgress.currentModDownloadProgress,
                });
            } else if (downloadProgress.status === StatusEnum.SUCCESS) {
                downloadCount += 1;
                // If no dependencies, end here.
                if (dependencies.length === 0) {
                    callback({
                        progress: 100,
                        status: StatusEnum.PENDING,
                        err: downloadProgress.err,
                        currentModDownloadSize: downloadProgress.currentModDownloadSize,
                        currentModBytesDownloaded: downloadProgress.currentModBytesDownloaded,
                        mod: downloadProgress.mod,
                        totalDownloadSize: totalDownloadSizeInBytes,
                        currentModDownloadProgress: 100,
                    });
                    completedCallback([combo]);
                    return;
                }

                // If dependencies, queue and download.
                await this.queueDownloadDependencies(settings, dependencies.entries(), (downloadProgress: DownloadProgress) => {
                    if (downloadProgress.status === StatusEnum.FAILURE) {
                        callback(downloadProgress);
                    } else if (downloadProgress.status === StatusEnum.PENDING) {
                        callback({
                            progress: this.generateProgressPercentage(downloadProgress, downloadCount, downloadableDependencySize + 1),
                            status: downloadProgress.status,
                            err: downloadProgress.err,
                            currentModDownloadSize: downloadProgress.currentModDownloadSize,
                            currentModBytesDownloaded: downloadProgress.currentModBytesDownloaded,
                            mod: downloadProgress.mod,
                            totalDownloadSize: totalDownloadSizeInBytes,
                            currentModDownloadProgress: downloadProgress.currentModDownloadProgress,
                        });
                    } else if (downloadProgress.status === StatusEnum.SUCCESS) {
                        callback({
                            progress: this.generateProgressPercentage(downloadProgress, downloadCount, downloadableDependencySize + 1),
                            status: StatusEnum.PENDING,
                            err: downloadProgress.err,
                            currentModDownloadSize: downloadProgress.currentModDownloadSize,
                            currentModBytesDownloaded: downloadProgress.currentModBytesDownloaded,
                            mod: downloadProgress.mod,
                            totalDownloadSize: totalDownloadSizeInBytes,
                            currentModDownloadProgress: downloadProgress.currentModDownloadProgress,
                        });
                        downloadCount += 1;
                        if (downloadCount >= dependencies.length + 1) {
                            callback({
                                progress: 100,
                                status: StatusEnum.PENDING,
                                err: downloadProgress.err,
                                currentModDownloadSize: downloadProgress.currentModDownloadSize,
                                currentModBytesDownloaded: downloadProgress.currentModBytesDownloaded,
                                mod: downloadProgress.mod,
                                totalDownloadSize: totalDownloadSizeInBytes,
                                currentModDownloadProgress: 100,
                            });
                            completedCallback([...dependencies, combo]);
                        }
                    }
                });
            }
        })
    }

    public async downloadImportedMods(game: Game, modList: ExportMod[],
                                       callback: (downloadProgress: DownloadProgress) => void,
                                       completedCallback: (mods: ThunderstoreCombo[]) => void) {
        const tsMods: ThunderstoreMod[] = ThunderstorePackages.PACKAGES;
        const comboList: ThunderstoreCombo[] = [];
        for (const importMod of modList) {
            for (const mod of tsMods) {
                if (mod.getFullName() == importMod.getName()) {
                    mod.getVersions().forEach(version => {
                        if (version.getVersionNumber().isEqualTo(importMod.getVersionNumber())) {
                            const combo = new ThunderstoreCombo();
                            combo.setMod(mod);
                            combo.setVersion(version);
                            comboList.push(combo);
                        }
                    });
                }
            }
        }

        const settings = await ManagerSettings.getSingleton(game);

        const totalDownloadSizeInBytes = this.getTotalDownloadSizeInBytes(comboList, settings);

        let downloadCount = 0;
        await this.queueDownloadDependencies(settings, comboList.entries(), (downloadProgress: DownloadProgress) => {
            if (downloadProgress.status === StatusEnum.FAILURE || downloadProgress.status === StatusEnum.PENDING) {
                callback(downloadProgress);
            } else if (downloadProgress.status === StatusEnum.SUCCESS) {
                callback(downloadProgress);
                downloadCount += 1;
                if (downloadCount >= comboList.length) {
                    callback({
                        progress: 100,
                        mod: downloadProgress.mod,
                        status: downloadProgress.status,
                        err: downloadProgress.err,
                        currentModBytesDownloaded: downloadProgress.currentModBytesDownloaded,
                        currentModDownloadSize: downloadProgress.currentModDownloadSize,
                        totalDownloadSize: totalDownloadSizeInBytes,
                        currentModDownloadProgress: 100,
                    });
                    completedCallback(comboList);
                }
            }
        });
    }

    public generateProgressPercentage(downloadProgress: DownloadProgress, currentIndex: number, total: number): number {
        const completedProgress = (currentIndex / total) * 100;
        return completedProgress + (downloadProgress.progress * 1/total);
    }

    public async queueDownloadDependencies(settings: ManagerSettings, entries: IterableIterator<[number, ThunderstoreCombo]>, callback: (downloadProgress: DownloadProgress) => void) {
        const entry = entries.next();
        if (!entry.done) {
            await this.downloadAndSave(entry.value[1] as ThunderstoreCombo, settings, async (downloadProgress: DownloadProgress) => {
                callback(downloadProgress);
                if (downloadProgress.status === StatusEnum.SUCCESS) {
                    await this.queueDownloadDependencies(settings, entries, callback);
                }
            });
        }
    }

    public calculateInitialDownloadSize(settings: ManagerSettings, list: ThunderstoreCombo[]): number {
        return list.length;
    }

    public async downloadAndSave(combo: ThunderstoreCombo, settings: ManagerSettings, callback: (downloadProgress: DownloadProgress) => void) {
        if (await this.isVersionAlreadyDownloaded(combo) && !settings.getContext().global.ignoreCache) {
            callback({
                progress: 100,
                status: StatusEnum.SUCCESS,
                err: null,
                currentModDownloadSize: combo.getVersion().getFileSize(),
                currentModBytesDownloaded: combo.getVersion().getFileSize(),
                mod: combo.getMod(),
                totalDownloadSize: 0, // Assigned on callback
                currentModDownloadProgress: 100,
            });
            return;
        }
        axios.get(combo.getVersion().getDownloadUrl(), {
            onDownloadProgress: progress => {
                callback({
                    progress: (progress.loaded / progress.total) * 100,
                    status: StatusEnum.PENDING,
                    err: null,
                    currentModDownloadSize: combo.getVersion().getFileSize(),
                    currentModBytesDownloaded: progress.loaded,
                    mod: combo.getMod(),
                    totalDownloadSize: 0, // Assigned on callback
                    currentModDownloadProgress: (progress.loaded / progress.total) * 100,
                });
            },
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/zip',
                'Access-Control-Allow-Origin': '*'
            }
        }).then(async response => {
            const buf: Buffer = Buffer.from(response.data)
            callback({
                progress: 100,
                status: StatusEnum.PENDING,
                err: null,
                currentModDownloadSize: combo.getVersion().getFileSize(),
                currentModBytesDownloaded: combo.getVersion().getFileSize(),
                mod: combo.getMod(),
                totalDownloadSize: 0, // Assigned on callback
                currentModDownloadProgress: 100,
            });
            await this.saveToFile(buf, combo, (success: boolean, error?: R2Error) => {
                const status = success ? StatusEnum.SUCCESS : StatusEnum.FAILURE;
                callback({
                    progress: 100,
                    status: status,
                    err: error || null,
                    currentModDownloadSize: combo.getVersion().getFileSize(),
                    currentModBytesDownloaded: combo.getVersion().getFileSize(),
                    mod: combo.getMod(),
                    totalDownloadSize: 0, // Assigned on callback
                    currentModDownloadProgress: 100,
                });
            });
        }).catch((reason: Error) => {
            callback({
                progress: 100,
                status: StatusEnum.SUCCESS,
                err: new R2Error(`Failed to download mod ${combo.getVersion().getFullName()}`, reason.message, null),
                currentModDownloadSize: combo.getVersion().getFileSize(),
                currentModBytesDownloaded: combo.getVersion().getFileSize(),
                mod: combo.getMod(),
                totalDownloadSize: 0, // Assigned on callback
                currentModDownloadProgress: 100,
            });
        })
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
                `Failed to write downloaded zip of ${combo.getMod().getFullName()} cache directory. \nReason: ${(e as Error).message}`,
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
