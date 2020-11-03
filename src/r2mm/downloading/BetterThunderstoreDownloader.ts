import ThunderstoreVersion from '../../model/ThunderstoreVersion';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import { isUndefined } from 'util';
import VersionNumber from '../../model/VersionNumber';
import StatusEnum from '../../model/enums/StatusEnum';
import axios from 'axios';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ZipExtract from '../installing/ZipExtract';
import R2Error from '../../model/errors/R2Error';
import PathResolver from '../../r2mm/manager/PathResolver';
import * as path from 'path';
import fs from 'fs';
import FileWriteError from '../../model/errors/FileWriteError';
import Profile from '../../model/Profile';
import ThunderstorePackages from '../data/ThunderstorePackages';
import ExportMod from '../../model/exports/ExportMod';
import ManagerSettings from '../manager/ManagerSettings';
import ManifestV2 from '../../model/ManifestV2';
import ModBridge from '../mods/ModBridge';
import ThunderstoreDownloaderProvider from '../../providers/ror2/downloading/ThunderstoreDownloaderProvider';

let cacheDirectory: string;

export default class BetterThunderstoreDownloader extends ThunderstoreDownloaderProvider {


    constructor() {
        super();
        cacheDirectory = path.join(PathResolver.MOD_ROOT, 'cache');
    }

    public buildDependencySet(mod: ThunderstoreVersion, allMods: ThunderstoreMod[], builder: ThunderstoreCombo[]): ThunderstoreCombo[] {
        const foundDependencies = new Array<ThunderstoreCombo>();
        mod.getDependencies().forEach(dependency => {
            // Find matching ThunderstoreMod.
            const matchingProvider: ThunderstoreMod | undefined = allMods.find(o => dependency.startsWith(o.getFullName() + "-"));
            if (!isUndefined(matchingProvider)) {
                const version = new VersionNumber(dependency.substring(matchingProvider.getFullName().length + 1));
                // Find ThunderstoreVersion with VersionNumber matching ${version}
                const matchingVersion = matchingProvider.getVersions().find(v => v.getVersionNumber().isEqualTo(version));
                if (!isUndefined(matchingVersion)) {
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
            if (!isUndefined(matchingProvider)) {
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

    public getLatestOfAllToUpdate(mods: ManifestV2[], allMods: ThunderstoreMod[]): ThunderstoreCombo[] {
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
        return dependencies.filter(value => {
            const result = mods.find(value1 => {
                return value1.getName() === value.getMod().getFullName();
            });
            if (result !== undefined) {
                return !result.getVersionNumber().isEqualTo(value.getVersion().getVersionNumber());
            }
            return false;
        });
    }

    public downloadLatestOfAll(mods: ManifestV2[], allMods: ThunderstoreMod[],
                                      callback: (progress: number, modName: string, status: number, err: R2Error | null) => void,
                                      completedCallback: (modList: ThunderstoreCombo[]) => void) {

        const dependencies: ThunderstoreCombo[] = this.getLatestOfAllToUpdate(mods, allMods);

        let downloadCount = 0;
        const downloadableDependencySize = this.calculateInitialDownloadSize(ManagerSettings.getSingleton(), dependencies);

        this.queueDownloadDependencies(ManagerSettings.getSingleton(), dependencies.entries(), (progress: number, modName: string, status: number, err: R2Error | null) => {
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

    public async download(mod: ThunderstoreMod, modVersion: ThunderstoreVersion, allMods: ThunderstoreMod[],
                           callback: (progress: number, modName: string, status: number, err: R2Error | null) => void,
                           completedCallback: (modList: ThunderstoreCombo[]) => void) {
        let dependencies = this.buildDependencySet(modVersion, allMods, new Array<ThunderstoreCombo>());
        const combo = new ThunderstoreCombo();
        combo.setMod(mod);
        combo.setVersion(modVersion);
        let downloadCount = 0;

        const settings = ManagerSettings.getSingleton();

        const downloadableDependencySize = this.calculateInitialDownloadSize(settings, dependencies);

        this.downloadAndSave(combo, settings, (progress: number, status: number, err: R2Error | null) => {
            if (status === StatusEnum.FAILURE) {
                callback(0, mod.getName(), status, err);
            } else if (status === StatusEnum.PENDING) {
                callback(this.generateProgressPercentage(progress, downloadCount, downloadableDependencySize + 1), mod.getName(), status, err);
            } else if (status === StatusEnum.SUCCESS) {
                // Determine if modpack
                // If modpack, use specified dependencies.
                // If not, get latest version of dependencies.
                downloadCount += 1;
                const files = fs.readdirSync(path.join(cacheDirectory, mod.getFullName(), modVersion.getVersionNumber().toString()));
                let isModpack = false;
                files.forEach(file => {
                    if (file.toLowerCase().endsWith('.modpack')) {
                        isModpack = true;
                    }
                });
                if (!isModpack) {
                    // If not modpack, get latest
                    dependencies = this.buildDependencySetUsingLatest(modVersion, allMods, new Array<ThunderstoreCombo>());
                }
                // If no dependencies, end here.
                if (dependencies.length === 0) {
                    callback(100, mod.getName(), StatusEnum.PENDING, err);
                    completedCallback([combo]);
                    return;
                }

                // If dependencies, queue and download.
                this.queueDownloadDependencies(settings, dependencies.entries(), (progress: number, modName: string, status: number, err: R2Error | null) => {
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

    public async downloadImportedMods(modList: ExportMod[],
                                       callback: (progress: number, modName: string, status: number, err: R2Error | null) => void,
                                       completedCallback: (mods: ThunderstoreCombo[]) => void) {
        const tsMods: ThunderstoreMod[] = ThunderstorePackages.PACKAGES;
        const comboList: ThunderstoreCombo[] = [];
        modList.forEach(importMod => {
            tsMods.forEach(mod => {
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
            });
        });

        const settings = ManagerSettings.getSingleton();

        let downloadCount = 0;
        this.queueDownloadDependencies(settings, comboList.entries(), (progress: number, modName: string, status: number, err: R2Error | null) => {
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

    public queueDownloadDependencies(settings: ManagerSettings, entries: IterableIterator<[number, ThunderstoreCombo]>, callback: (progress: number, modName: string, status: number, err: R2Error | null) => void) {
        const entry = entries.next();
        if (!entry.done) {
            this.downloadAndSave(entry.value[1] as ThunderstoreCombo, settings, (progress: number, status: number, err: R2Error | null) => {
                if (status === StatusEnum.FAILURE) {
                    callback(0, (entry.value[1] as ThunderstoreCombo).getMod().getName(), status, err);
                } else if (status === StatusEnum.PENDING) {
                    callback(progress, (entry.value[1] as ThunderstoreCombo).getMod().getName(), status, err);
                } else if (status === StatusEnum.SUCCESS) {
                    callback(100, (entry.value[1] as ThunderstoreCombo).getMod().getName(), status, err);
                    this.queueDownloadDependencies(settings, entries, callback);
                }
            });
        }
    }

    public calculateInitialDownloadSize(settings: ManagerSettings, list: ThunderstoreCombo[]): number {
        return list.filter(value => !this.isVersionAlreadyDownloaded(value) || settings.ignoreCache).length;
    }

    public downloadAndSave(combo: ThunderstoreCombo, settings: ManagerSettings, callback: (progress: number, status: number, err: R2Error | null) => void) {
        if (this.isVersionAlreadyDownloaded(combo) && !settings.ignoreCache) {
            callback(100, StatusEnum.SUCCESS, null);
            return;
        }
        axios.get(combo.getVersion().getDownloadUrl(), {
            onDownloadProgress: progress => {
                callback((progress.loaded / progress.total) * 100, StatusEnum.PENDING, null);
            },
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/zip'
            }
        }).then(response => {
            const buf: Buffer = Buffer.from(response.data)
            callback(100, StatusEnum.PENDING, null);
            this.saveToFile(buf, combo, (success: boolean, error?: R2Error) => {
                if (success) {
                    callback(100, StatusEnum.SUCCESS, error || null);
                } else {
                    callback(100, StatusEnum.FAILURE, error || null);
                }
            });
        })
    }

    public saveToFile(response: Buffer, combo: ThunderstoreCombo, callback: (success: boolean, error?: R2Error) => void) {
        try {
            if (!fs.existsSync(path.join(cacheDirectory, combo.getMod().getFullName()))) {
                fs.mkdirSync(path.join(cacheDirectory, combo.getMod().getFullName()), {
                    recursive: true
                });
            }
            fs.writeFileSync(path.join(
                cacheDirectory,
                combo.getMod().getFullName(),
                combo.getVersion().getVersionNumber().toString() + '.zip'
            ), response);
            ZipExtract.extractAndDelete(
                path.join(cacheDirectory, combo.getMod().getFullName()),
                combo.getVersion().getVersionNumber().toString() + '.zip',
                combo.getVersion().getVersionNumber().toString(),
                callback
            );
        } catch(e) {
            callback(false, new FileWriteError(
                'File write error',
                `Failed to write downloaded zip of ${combo.getMod().getFullName()} to profile directory of ${Profile.getActiveProfile().getPathOfProfile()}. \nReason: ${e.message}`,
                'Try running r2modman as an administrator'
            ));
        }
    }

    public isVersionAlreadyDownloaded(combo: ThunderstoreCombo): boolean  {
        try {
            fs.readdirSync(path.join(cacheDirectory, combo.getMod().getFullName(), combo.getVersion().getVersionNumber().toString()));
            return true;
        } catch(e) {
            return false;
        }
    }

}
