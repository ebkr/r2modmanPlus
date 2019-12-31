import Mod from 'src/model/Mod';
import R2Error from 'src/model/errors/R2Error';

import ManifestV2 from 'src/model/ManifestV2';
import BepInExTree from 'src/model/file/BepInExTree';

import * as path from 'path';
import * as fs from 'fs-extra';
import Profile from 'src/model/Profile';
import FileWriteError from 'src/model/errors/FileWriteError';
import ModMode from 'src/model/enums/ModMode';
import { isNull } from 'util';

const cacheDirectory: string = path.join(process.cwd(), 'mods', 'cache');

export default class ProfileInstaller {

    /**
     * Uninstalls a mod by looking through the top level of profile/BepInEx/*
     * Any folder inside * locations with the mod name will be deleted.
     * @param mod 
     */
    public static uninstallMod(mod: Mod): R2Error | null {
        if (mod.getFullName().toLowerCase() === 'bbepis-bepinexpack') {
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
                    err.message
                )
            }
        }
        const bepInExLocation: string = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx');
        try {
            fs.readdirSync(bepInExLocation)
                .forEach((file: string) => {
                    fs.readdirSync(path.join(bepInExLocation, file))
                        .forEach((folder: string) => {
                            const folderPath: string = path.join(bepInExLocation, file, folder);
                            if (folder === mod.getName() && fs.lstatSync(folderPath).isDirectory()) {
                                fs.emptyDirSync(folderPath);
                                fs.removeSync(folderPath);
                            }
                        })
                });
        } catch(e) {
            const err: Error = e;
            return new R2Error(
                err.name ,
                err.message
            )
        }
        return null;
    }

    public static disableMod(mod: Mod): R2Error | void {
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

    public static enableMod(mod: Mod): R2Error | void {
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

    private static applyModMode(mod: Mod, tree: BepInExTree, location: string, mode: number): R2Error | void {
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
                    if (file.toLowerCase().endsWith('.dll')) {
                        fs.renameSync(file, file + '.old');
                    }
                } else if (mode === ModMode.ENABLED) {
                    if (file.toLowerCase().endsWith('.dll.old')) {
                        fs.renameSync(file, file.substring(0, file.length - ('.old').length));
                    }
                }
            } catch(e) {
                const err: Error = e;
                return new R2Error(
                    `Failed to rename file ${file} with ModMode of ${mode}`,
                    err.message
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

    public static installMod(mod: Mod | ManifestV2): R2Error | null {
        const cachedLocationOfMod: string = path.join(cacheDirectory, mod.getFullName(), mod.getVersionNumber().toString());
        if (mod.getFullName().toLowerCase() === 'bbepis-bepinexpack') {
            return this.installBepInEx(cachedLocationOfMod);
        }
        if (mod instanceof ManifestV2) {
            return this.installForManifestV2(mod);
        } else {
            console.log('Installing mod from Manifest V1');
            return this.installForManifestV1(mod, cachedLocationOfMod);
        }
    }

    private static installForManifestV1(mod: Mod, location: string): R2Error | null {
        const files: BepInExTree | R2Error = BepInExTree.buildFromLocation(location);
        if (files instanceof R2Error) {
            console.log('Failed to produce BepInExTree');
            return files;
        }
        console.log('tree:', files);
        return this.resolveBepInExTree(location, path.basename(location), mod, files);
    }

    private static installForManifestV2(mod: ManifestV2): null {
        return null;
    }

    private static resolveBepInExTree(location: string, folderName: string, mod: Mod, tree: BepInExTree): R2Error | null {
        const endFolderNames = ['plugins', 'monomod', 'core', 'config', 'patchers'];
        // Check if BepInExTree is end.
        if (endFolderNames.find((folder: string) => folder === folderName.toLowerCase()) !== undefined) {
            console.log('found match of endFolder with name:', folderName);
            const profileLocation = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', folderName, mod.getName());
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
                        `Failed to move mod: ${mod.getFullName()} with directory of: ${profileLocation}`,
                        err.message
                    );
                }
            } catch(e) {
                const err: Error = e;
                return new FileWriteError(
                    `Failed to create directories for: ${profileLocation}`,
                    err.message
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
                        `Failed to move mod: ${mod.getFullName()} with file: ${path.join(location, file)}`,
                        err.message
                    );
                }
            } catch(e) {
                const err: Error = e;
                return new FileWriteError(
                    `Failed to create directories for: ${profileLocation}`,
                    err.message
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
                    err.message
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
                    err.message
                )
            }
        })
        return null;
    }

}