import R2Error from 'src/model/errors/R2Error';

import ManifestV2 from 'src/model/ManifestV2';
import BepInExTree from 'src/model/file/BepInExTree';

import path from 'path';
import fs from 'fs-extra';
import Profile from 'src/model/Profile';
import FileWriteError from 'src/model/errors/FileWriteError';
import ModMode from 'src/model/enums/ModMode';
import { isNull } from 'util';
import { lstatSync } from 'fs-extra';
import PathResolver from '../manager/PathResolver';

const cacheDirectory: string = path.join(PathResolver.ROOT, 'games', 'Risk of Rain 2', 'cache');
const modModeExtensions: string[] = [".dll", ".language"];

export default class ProfileInstaller {

    /**
     * Uninstalls a mod by looking through the top level of profile/BepInEx/*
     * Any folder inside * locations with the mod name will be deleted.
     * @param mod
     */
    public static uninstallMod(mod: ManifestV2): R2Error | null {
        if (mod.getName().toLowerCase() === 'bbepis-bepinexpack') {
            try {
                fs.readdirSync(Profile.getActiveProfile().getPathOfProfile())
                    .forEach((file: string) => {
                        const filePath = path.join(Profile.getActiveProfile().getPathOfProfile(), file);
                        if (fs.lstatSync(filePath).isFile()) {
                            if (file.toLowerCase() !== 'mods.yml') {
                                fs.removeSync(filePath);
                            }
                        }
                    })
            } catch(e) {
                const err: Error = e;
                return new FileWriteError(
                    'Failed to delete BepInEx file from profile root',
                    err.message,
                    'Is the game still running?'
                )
            }
        }
        const bepInExLocation: string = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx');
        try {
            fs.readdirSync(bepInExLocation)
                .forEach((file: string) => {
                    if (lstatSync(path.join(bepInExLocation, file)).isDirectory()) {
                        fs.readdirSync(path.join(bepInExLocation, file))
                            .forEach((folder: string) => {
                                const folderPath: string = path.join(bepInExLocation, file, folder);
                                if (folder === mod.getName() && fs.lstatSync(folderPath).isDirectory()) {
                                    fs.emptyDirSync(folderPath);
                                    fs.removeSync(folderPath);
                                }
                            })
                    }
                });
        } catch(e) {
            const err: Error = e;
            return new R2Error(
                err.name ,
                err.message,
                'Is the game still running? If so, close it and try again.'
            )
        }
        return null;
    }

    public static disableMod(mod: ManifestV2): R2Error | void {
        const bepInExLocation: string = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx');
        const files: BepInExTree | R2Error = BepInExTree.buildFromLocation(bepInExLocation);
        if (files instanceof R2Error) {
            return files;
        }
        const applyError: R2Error | void = this.applyModMode(mod, files, bepInExLocation, ModMode.DISABLED);
        if (applyError instanceof R2Error) {
            return applyError;
        }
    }

    public static enableMod(mod: ManifestV2): R2Error | void {
        const bepInExLocation: string = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx');
        const files: BepInExTree | R2Error = BepInExTree.buildFromLocation(bepInExLocation);
        if (files instanceof R2Error) {
            return files;
        }
        const applyError: R2Error | void = this.applyModMode(mod, files, bepInExLocation, ModMode.ENABLED);
        if (applyError instanceof R2Error) {
            return applyError;
        }

    }

    private static applyModMode(mod: ManifestV2, tree: BepInExTree, location: string, mode: number): R2Error | void {
        const files: string[] = [];
        tree.getDirectories().forEach((directory: BepInExTree) => {
            if (directory.getDirectoryName() !== mod.getName()) {
                this.applyModMode(mod, directory, path.join(location, directory.getDirectoryName()), mode);
            } else {
                files.push(...this.getDescendantFiles(null, path.join(location, directory.getDirectoryName())));
            }
        })
        files.forEach((file: string) => {
            try {
                if (mode === ModMode.DISABLED) {
                    modModeExtensions.forEach(ext => {
                        if (file.toLowerCase().endsWith(ext)) {
                            fs.renameSync(file, file + '.old');
                        }
                    });
                } else if (mode === ModMode.ENABLED) {
                    modModeExtensions.forEach(ext => {
                        if (file.toLowerCase().endsWith(ext + ".old")) {
                            fs.renameSync(file, file.substring(0, file.length - ('.old').length));
                        }
                    });
                }
            } catch(e) {
                const err: Error = e;
                return new R2Error(
                    `Failed to rename file ${file} with ModMode of ${mode}`,
                    err.message,
                    'Try going to settings, and re-select the profile from the profile selection screen'
                )
            }
        })
    }

    private static getDescendantFiles(tree: BepInExTree | null, location: string): string[] {
        const files: string[] = [];
        if (isNull(tree)) {
            const newTree = BepInExTree.buildFromLocation(location);
            if (newTree instanceof R2Error) {
                return files;
            }
            tree = newTree;
        }
        tree.getDirectories().forEach((directory: BepInExTree) => {
            files.push(...this.getDescendantFiles(directory, path.join(location, directory.getDirectoryName())));
        })
        tree.getFiles().forEach((file: string) => {
            files.push(file);
        })
        return files;
    }

    public static installMod(mod: ManifestV2): R2Error | null {
        const cachedLocationOfMod: string = path.join(cacheDirectory, mod.getName(), mod.getVersionNumber().toString());
        if (mod.getName().toLowerCase() === 'bbepis-bepinexpack') {
            return this.installBepInEx(cachedLocationOfMod);
        }
        return this.installForManifestV2(mod, cachedLocationOfMod);
    }

    private static installForManifestV2(mod: ManifestV2, location: string): R2Error | null {
        const files: BepInExTree | R2Error = BepInExTree.buildFromLocation(location);
        if (files instanceof R2Error) {
            return files;
        }
        return this.resolveBepInExTree(location, path.basename(location), mod, files);
    }

    private static resolveBepInExTree(location: string, folderName: string, mod: ManifestV2, tree: BepInExTree): R2Error | null {
        const endFolderNames = ['plugins', 'monomod', 'core', 'config', 'patchers'];
        // Check if BepInExTree is end.
        if (endFolderNames.find((folder: string) => folder === folderName.toLowerCase()) !== undefined) {
            let profileLocation = '';
            if (folderName.toLowerCase() !== 'config') {
                profileLocation = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', folderName, mod.getName());
            } else {
                profileLocation = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', folderName);
            }
            try {
                fs.ensureDirSync(profileLocation);
                try {
                    fs.copySync(
                        location,
                        profileLocation
                    );
                    // Copy is complete, end recursive tree.
                    return null;
                } catch(e) {
                    const err: Error = e;
                    return new FileWriteError(
                        `Failed to move mod: ${mod.getName()} with directory of: ${profileLocation}`,
                        err.message,
                        'Is the game still running? If not, try running r2modman as an administrator'
                    );
                }
            } catch(e) {
                const err: Error = e;
                return new FileWriteError(
                    `Failed to create directories for: ${profileLocation}`,
                    err.message,
                    'Is the game still running? If not, try running r2modman as an administrator'
                );
            }
        }
        // If no match
        tree.getFiles().forEach((file: string) => {
            let profileLocation: string;
            if (file.toLowerCase().endsWith('.mm.dll')) {
                profileLocation = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'monomod', mod.getName());
            } else {
                profileLocation = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'plugins', mod.getName());
            }
            try {
                fs.ensureDirSync(profileLocation);
                try {
                    fs.copySync(
                        file,
                        path.join(profileLocation, path.basename(file))
                    );
                    // Copy is complete;
                } catch(e) {
                    const err: Error = e;
                    return new FileWriteError(
                        `Failed to move mod: ${mod.getName()} with file: ${path.join(location, file)}`,
                        err.message,
                        'Is the game still running? If not, try running r2modman as an administrator'
                    );
                }
            } catch(e) {
                const err: Error = e;
                return new FileWriteError(
                    `Failed to create directories for: ${profileLocation}`,
                    err.message,
                    'Try running r2modman as an administrator'
                );
            }
        });

        const directories = tree.getDirectories();
        for (const directory of directories) {
            const resolveError: R2Error | null = this.resolveBepInExTree(
                path.join(location, directory.getDirectoryName()),
                directory.getDirectoryName(),
                mod,
                directory
            );
            if (resolveError instanceof R2Error) {
                return resolveError;
            }
        }
        return null;
    }

    private static installBepInEx(bieLocation: string): R2Error | null {
        const location = path.join(bieLocation, 'BepInExPack');
        const files: BepInExTree | R2Error = BepInExTree.buildFromLocation(location);
        if (files instanceof R2Error) {
            return files;
        }
        files.getFiles().forEach((file: string) => {
            try {
                fs.copySync(file, path.join(Profile.getActiveProfile().getPathOfProfile(), path.basename(file)));
            } catch(e) {
                const err: Error = e;
                return new FileWriteError(
                    `Failed to copy file for BepInEx installation: ${file}`,
                    err.message,
                    'Is the game still running? If not, try running r2modman as an administrator'
                )
            }
        })
        files.getDirectories().forEach((directory: BepInExTree) => {
            try {
                fs.copySync(
                    path.join(location, directory.getDirectoryName()),
                    path.join(Profile.getActiveProfile().getPathOfProfile(), path.basename(directory.getDirectoryName()))
                );
            } catch(e) {
                const err: Error = e;
                return new FileWriteError(
                    `Failed to copy folder for BepInEx installation: ${directory.getDirectoryName()}`,
                    err.message,
                    'Is the game still running? If not, try running r2modman as an administrator'
                )
            }
        })
        return null;
    }

}
