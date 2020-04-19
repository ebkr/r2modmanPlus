import ThunderstoreVersion from 'src/model/ThunderstoreVersion';
import ThunderstoreMod from 'src/model/ThunderstoreMod';
import { isUndefined } from 'util';
import VersionNumber from 'src/model/VersionNumber';
import StatusEnum from 'src/model/enums/StatusEnum';
import axios from 'axios';
import ThunderstoreCombo from 'src/model/ThunderstoreCombo';
import ZipExtract from '../installing/ZipExtract';
import R2Error from 'src/model/errors/R2Error';
import PathResolver from 'src/r2mm/manager/PathResolver';
import fs from 'fs-extra';

import * as path from 'path';
import FileWriteError from 'src/model/errors/FileWriteError';
import Profile from 'src/model/Profile';
import ThunderstorePackages from '../data/ThunderstorePackages';
import ExportMod from 'src/model/exports/ExportMod';

const cacheDirectory: string = path.join(PathResolver.ROOT, 'mods', 'cache');

export default class BetterThunderstoreDownloader {

    public static buildDependencySet(mod: ThunderstoreVersion, allMods: ThunderstoreMod[], builder: ThunderstoreCombo[]): ThunderstoreCombo[] {
        const foundDependencies = new Array<ThunderstoreCombo>();
        mod.getDependencies().forEach(dependency => {
            // Find matching ThunderstoreMod.
            const matchingProvider: ThunderstoreMod | undefined = allMods.find(o => dependency.startsWith(o.getFullName()));
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

    public static buildDependencySetUsingLatest(mod: ThunderstoreVersion, allMods: ThunderstoreMod[], builder: ThunderstoreCombo[]): ThunderstoreCombo[] {
        const foundDependencies = new Array<ThunderstoreCombo>();
        mod.getDependencies().forEach(dependency => {
            // Find matching ThunderstoreMod.
            const matchingProvider: ThunderstoreMod | undefined = allMods.find(o => dependency.startsWith(o.getFullName()));
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

    public static download(mod: ThunderstoreMod, modVersion: ThunderstoreVersion, allMods: ThunderstoreMod[], 
                           callback: (progress: number, modName: string, status: number, err: R2Error | null) => void, 
                           completedCallback: (modList: ThunderstoreCombo[]) => void) {
        let dependencies = this.buildDependencySet(modVersion, allMods, new Array<ThunderstoreCombo>());
        const combo = new ThunderstoreCombo();
        combo.setMod(mod);
        combo.setVersion(modVersion);
        let downloadCount = 0;
        this.downloadAndSave(combo, (progress: number, status: number, err: R2Error | null) => {
            if (status === StatusEnum.FAILURE) {
                callback(0, mod.getName(), status, err);
            } else if (status === StatusEnum.PENDING) {
                callback(this.generateProgressPercentage(progress, downloadCount, dependencies.length + 1), mod.getName(), status, err);
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
                this.queueDownloadDependencies(dependencies.entries(), (progress: number, modName: string, status: number, err: R2Error | null) => {
                    if (status === StatusEnum.FAILURE) {
                        callback(0, modName, status, err);
                    } else if (status === StatusEnum.PENDING) {
                        callback(this.generateProgressPercentage(progress, downloadCount, dependencies.length + 1), modName, status, err);
                    } else if (status === StatusEnum.SUCCESS) {
                        callback(this.generateProgressPercentage(progress, downloadCount, dependencies.length + 1), modName, StatusEnum.PENDING, err);
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

    public static downloadImportedMods(modList: ExportMod[],
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
        let downloadCount = 0;
        this.queueDownloadDependencies(comboList.entries(), (progress: number, modName: string, status: number, err: R2Error | null) => {
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

    private static generateProgressPercentage(progress: number, currentIndex: number, total: number): number {
        const completedProgress = (currentIndex / total) * 100;
        return completedProgress + (progress * 1/total);
    }

    private static queueDownloadDependencies(entries: IterableIterator<[number, ThunderstoreCombo]>, callback: (progress: number, modName: string, status: number, err: R2Error | null) => void) {
        const entry = entries.next();
        if (!entry.done) {
            this.downloadAndSave(entry.value[1] as ThunderstoreCombo, (progress: number, status: number, err: R2Error | null) => {
                if (status === StatusEnum.FAILURE) {
                    callback(0, (entry.value[1] as ThunderstoreCombo).getMod().getName(), status, err);
                } else if (status === StatusEnum.PENDING) {
                    callback(progress, (entry.value[1] as ThunderstoreCombo).getMod().getName(), status, err);
                } else if (status === StatusEnum.SUCCESS) {
                    callback(100, (entry.value[1] as ThunderstoreCombo).getMod().getName(), status, err);
                    this.queueDownloadDependencies(entries, callback);
                }
            });
        }
    }

    private static downloadAndSave(combo: ThunderstoreCombo, callback: (progress: number, status: number, err: R2Error | null) => void) {
        if (this.isVersionAlreadyDownloaded(combo)) {
            callback(100, StatusEnum.SUCCESS, null);
            return;
        }
        axios.get(combo.getVersion().getDownloadUrl(), {
            onDownloadProgress: progress => {
                callback((progress.loaded / progress.total) * 100, StatusEnum.PENDING, null);
            },
            responseType: 'arraybuffer'
        }).then(response => {
            const buf: Buffer = Buffer.from(response.data)
            callback(100, StatusEnum.PENDING, null);
            this.saveToFile(buf, combo, (success: boolean) => {
                if (success) {
                    callback(100, StatusEnum.SUCCESS, null);
                } else {
                    callback(100, StatusEnum.FAILURE, null);
                }
            });
        })
    }

    private static saveToFile(response: Buffer, combo: ThunderstoreCombo, callback: (success: boolean) => void): R2Error | null {
        try {
            fs.ensureDirSync(path.join(cacheDirectory, combo.getMod().getFullName()));
            fs.writeFileSync(
                path.join(
                    cacheDirectory, 
                    combo.getMod().getFullName(), 
                    combo.getVersion().getVersionNumber().toString() + '.zip'
                ), 
                response
            );
            const extractError: R2Error | null = ZipExtract.extractAndDelete(
                path.join(cacheDirectory, combo.getMod().getFullName()), 
                combo.getVersion().getVersionNumber().toString() + '.zip', 
                combo.getVersion().getVersionNumber().toString(),
                callback
            );
            return extractError;
        } catch(e) {
            const err: Error = e;
            return new FileWriteError(
                'File write error',
                `Failed to write downloaded zip of ${combo.getMod().getFullName()} to profile directory of ${Profile.getActiveProfile().getPathOfProfile()}. \nReason: ${err.message}`,
                'Try running r2modman as an administrator'
            );
        }
        return null;
    }

    private static isVersionAlreadyDownloaded(combo: ThunderstoreCombo): boolean  {
        try {
            fs.readdirSync(path.join(cacheDirectory, combo.getMod().getFullName(), combo.getVersion().getVersionNumber().toString()));
            return true;
        } catch(e) {
            return false;
        }
    }

}