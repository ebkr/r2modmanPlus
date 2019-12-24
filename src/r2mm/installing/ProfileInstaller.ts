import Mod from 'src/model/Mod';
import R2Error from 'src/model/errors/R2Error';

import ManifestV2 from 'src/model/ManifestV2';
import BepInExTree from 'src/model/file/BepInExTree';

import * as path from 'path';
import * as fs from 'fs-extra';
import Profile from 'src/model/Profile';
import FileWriteError from 'src/model/errors/FileWriteError';

const cacheDirectory: string = path.join(process.cwd(), 'mods', 'cache');

export default class ProfileInstaller {

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

    private static installBepInEx(location: string): R2Error | null {
        const files: BepInExTree | R2Error = BepInExTree.buildFromLocation(location);
        if (files instanceof R2Error) {
            return files;
        }
        files.getFiles().forEach((file: string) => {
            // Copy files to RoR2 directory
        })
        return null;
    }

}