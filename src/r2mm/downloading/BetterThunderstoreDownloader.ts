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
import ExportMod from '../../model/exports/ExportMod';
import ThunderstoreDownloaderProvider from '../../providers/ror2/downloading/ThunderstoreDownloaderProvider';
import ManagerInformation from '../../_managerinf/ManagerInformation';
import ProfileModList from '../../r2mm/mods/ProfileModList';

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

    public async downloadLatestOfAll(modsWithUpdates: ThunderstoreCombo[], allMods: ThunderstoreMod[], ignoreCache: boolean,
                                      callback: (progress: number, modName: string, status: number, err: R2Error | null) => void,
                                      completedCallback: (modList: ThunderstoreCombo[]) => void) {

        const dependencies: ThunderstoreCombo[] = [...modsWithUpdates];
        modsWithUpdates.forEach(value => {
            this.buildDependencySetUsingLatest(value.getVersion(), allMods, dependencies);
        });

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

    public async download(profile: Profile, mod: ThunderstoreMod, modVersion: ThunderstoreVersion,
                           allMods: ThunderstoreMod[], ignoreCache: boolean,
                           callback: (progress: number, modName: string, status: number, err: R2Error | null) => void,
                           completedCallback: (modList: ThunderstoreCombo[]) => void) {
        let dependencies = this.buildDependencySet(modVersion, allMods, new Array<ThunderstoreCombo>());
        this.sortDependencyOrder(dependencies);
        const combo = new ThunderstoreCombo();
        combo.setMod(mod);
        combo.setVersion(modVersion);
        let downloadCount = 0;

        const modList = await ProfileModList.getModList(profile);
        if (modList instanceof R2Error) {
            return callback(0, mod.getName(), StatusEnum.FAILURE, modList);
        }

        let downloadableDependencySize = this.calculateInitialDownloadSize(dependencies);

        // Determine if modpack
        // If modpack, use specified dependencies as retrieved above
        // If not, get latest version of dependencies.
        let isModpack = combo.getMod().getCategories().find(value => value === "Modpacks") !== undefined;
        if (!isModpack) {
            // If not modpack, get latest
            dependencies = this.buildDependencySetUsingLatest(modVersion, allMods, new Array<ThunderstoreCombo>());
            this.sortDependencyOrder(dependencies);
            // #270: Remove already-installed dependencies to prevent updating.
            dependencies = dependencies.filter(dep => modList.find(installed => installed.getName() === dep.getMod().getFullName()) === undefined);
            downloadableDependencySize = this.calculateInitialDownloadSize(dependencies);
        }

        await this.downloadAndSave(combo, ignoreCache, async (progress: number, status: number, err: R2Error | null) => {
            if (status === StatusEnum.FAILURE) {
                callback(0, mod.getName(), status, err);
            } else if (status === StatusEnum.PENDING) {
                callback(this.generateProgressPercentage(progress, downloadCount, downloadableDependencySize + 1), mod.getName(), status, err);
            } else if (status === StatusEnum.SUCCESS) {
                downloadCount += 1;
                // If no dependencies, end here.
                if (dependencies.length === 0) {
                    callback(100, mod.getName(), StatusEnum.PENDING, err);
                    completedCallback([combo]);
                    return;
                }

                // If dependencies, queue and download.
                await this.queueDownloadDependencies(dependencies.entries(), ignoreCache, (progress: number, modName: string, status: number, err: R2Error | null) => {
                    if (status === StatusEnum.FAILURE) {
                        callback(0, modName, status, err);
                    } else if (status === StatusEnum.PENDING) {
                        callback(this.generateProgressPercentage(progress, downloadCount, downloadableDependencySize + 1), modName, status, err);
                    } else if (status === StatusEnum.SUCCESS) {
                        callback(this.generateProgressPercentage(progress, downloadCount, downloadableDependencySize + 1), modName, StatusEnum.PENDING, err);
                        downloadCount += 1;
                        if (downloadCount >= dependencies.length + 1) {
                            callback(100, modName, StatusEnum.PENDING, err);
                            completedCallback([...dependencies, combo]);
                        }
                    }
                });
            }
        })
    }

    public async downloadImportedMods(modList: ExportMod[], allMods: ThunderstoreMod[], ignoreCache: boolean,
                                       callback: (progress: number, modName: string, status: number, err: R2Error | null) => void,
                                       completedCallback: (mods: ThunderstoreCombo[]) => void) {

        const comboList = allMods.map((mod) => {
            const targetMod = modList.find((importMod) => mod.getFullName() == importMod.getName());
            const version = targetMod
                ? mod.getVersions().find((ver) => ver.getVersionNumber().isEqualTo(targetMod.getVersionNumber()))
                : undefined;

            if (version) {
                const combo = new ThunderstoreCombo();
                combo.setMod(mod);
                combo.setVersion(version);
                return combo;
            }
        }).filter((combo): combo is ThunderstoreCombo => combo !== undefined);

        if (comboList.length === 0) {
            const err = new R2Error(
                'No importable mods found',
                'None of the mods or versions listed in the shared profile are available on Thunderstore.',
                'Make sure the shared profile is meant for the currently selected game.'
            );
            callback(0, '', StatusEnum.FAILURE, err);
            return;
        }

        let downloadCount = 0;
        await this.queueDownloadDependencies(comboList.entries(), ignoreCache, (progress: number, modName: string, status: number, err: R2Error | null) => {
            if (status === StatusEnum.FAILURE) {
                callback(0, modName, status, err);
            } else if (status === StatusEnum.PENDING) {
                callback(this.generateProgressPercentage(progress, downloadCount, comboList.length + 1), modName, status, err);
            } else if (status === StatusEnum.SUCCESS) {
                callback(this.generateProgressPercentage(progress, downloadCount, comboList.length + 1), modName, StatusEnum.PENDING, err);
                downloadCount += 1;
                if (downloadCount >= comboList.length) {
                    callback(100, modName, StatusEnum.PENDING, err);
                    completedCallback(comboList);
                }
            }
        });
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
        axios.get(combo.getVersion().getDownloadUrl(), {
            onDownloadProgress: progress => {
                callback((progress.loaded / progress.total) * 100, StatusEnum.PENDING, null);
            },
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/zip',
                'Access-Control-Allow-Origin': '*'
            }
        }).then(async response => {
            const buf: Buffer = Buffer.from(response.data)
            callback(100, StatusEnum.PENDING, null);
            await this.saveToFile(buf, combo, (success: boolean, error?: R2Error) => {
                if (success) {
                    callback(100, StatusEnum.SUCCESS, error || null);
                } else {
                    callback(100, StatusEnum.FAILURE, error || null);
                }
            });
        }).catch((reason: Error) => {
            callback(100, StatusEnum.FAILURE, new R2Error(`Failed to download mod ${combo.getVersion().getFullName()}`, reason.message, null));
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
