import R2Error from '../../model/errors/R2Error';

import ManifestV2 from '../../model/ManifestV2';
import BepInExTree from '../../model/file/BepInExTree';

import * as path from 'path';
import FsProvider from '../../providers/generic/file/FsProvider';
import Profile from '../../model/Profile';
import FileWriteError from '../../model/errors/FileWriteError';
import ModMode from '../../model/enums/ModMode';
import { isNull } from 'util';
import { lstatSync } from 'fs-extra';
import PathResolver from '../manager/PathResolver';
import ProfileInstallerProvider from '../../providers/ror2/installing/ProfileInstallerProvider';
import FileUtils from '../../utils/FileUtils';
let fs: FsProvider;

const modModeExtensions: string[] = [".dll", ".language", 'skin.cfg'];

export default class ProfileInstaller extends ProfileInstallerProvider {

    constructor() {
        super();
        fs = FsProvider.instance;
    }

    /**
     * Uninstalls a mod by looking through the top level of profile/BepInEx/*
     * Any folder inside * locations with the mod name will be deleted.
     * @param mod
     */
    public async uninstallMod(mod: ManifestV2): Promise<R2Error | null> {
        if (mod.getName().toLowerCase() === 'bbepis-bepinexpack') {
            try {
                for (const file of (await fs.readdir(Profile.getActiveProfile().getPathOfProfile()))) {
                    const filePath = path.join(Profile.getActiveProfile().getPathOfProfile(), file);
                    if ((await fs.lstat(filePath)).isFile()) {
                        if (file.toLowerCase() !== 'mods.yml') {
                            await fs.unlink(filePath);
                        }
                    }
                }
            } catch(e) {
                const err: Error = e;
                const returnErr = new FileWriteError(
                    'Failed to delete BepInEx file from profile root',
                    err.message,
                    'Is the game still running?'
                );
                return Promise.resolve(returnErr);
            }
        }
        const bepInExLocation: string = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx');
        if (await fs.exists(bepInExLocation)) {
            try {
                for (const file of (await fs.readdir(bepInExLocation))) {
                    if (lstatSync(path.join(bepInExLocation, file)).isDirectory()) {
                        for (const folder of (await fs.readdir(path.join(bepInExLocation, file)))) {
                            const folderPath: string = path.join(bepInExLocation, file, folder);
                            if (folder === mod.getName() && (await fs.lstat(folderPath)).isDirectory()) {
                                await FileUtils.emptyDirectory(folderPath);
                                await fs.rmdir(folderPath);
                            }
                        }
                    }
                }
            } catch (e) {
                const err: Error = e;
                const returnErr = new R2Error(
                    "Failed to remove files",
                    err.message,
                    'Is the game still running? If so, close it and try again.'
                );
                return Promise.resolve(returnErr);
            }
        }
        return Promise.resolve(null);
    }

    public async disableMod(mod: ManifestV2): Promise<R2Error | void> {
        const bepInExLocation: string = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx');
        const files: BepInExTree | R2Error = await BepInExTree.buildFromLocation(bepInExLocation);
        if (files instanceof R2Error) {
            return Promise.resolve(files);
        }
        const applyError: R2Error | void = await this.applyModMode(mod, files, bepInExLocation, ModMode.DISABLED);
        if (applyError instanceof R2Error) {
            return Promise.resolve(applyError);
        }
    }

    public async enableMod(mod: ManifestV2): Promise<R2Error | void> {
        const bepInExLocation: string = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx');
        const files: BepInExTree | R2Error = await BepInExTree.buildFromLocation(bepInExLocation);
        if (files instanceof R2Error) {
            return Promise.resolve(files);
        }
        const applyError: R2Error | void = await this.applyModMode(mod, files, bepInExLocation, ModMode.ENABLED);
        if (applyError instanceof R2Error) {
            return Promise.resolve(applyError);
        }

    }

    async applyModMode(mod: ManifestV2, tree: BepInExTree, location: string, mode: number): Promise<R2Error | void> {
        const files: string[] = [];
        for (const directory of tree.getDirectories()) {
            if (directory.getDirectoryName() !== mod.getName()) {
                await this.applyModMode(mod, directory, path.join(location, directory.getDirectoryName()), mode);
            } else {
                files.push(...(await this.getDescendantFiles(null, path.join(location, directory.getDirectoryName()))));
            }
        }
        files.forEach((file: string) => {
            try {
                if (mode === ModMode.DISABLED) {
                    modModeExtensions.forEach(async ext => {
                        if (file.toLowerCase().endsWith(ext)) {
                            await fs.rename(file, file + '.old');
                        }
                    });
                } else if (mode === ModMode.ENABLED) {
                    modModeExtensions.forEach(async ext => {
                        if (file.toLowerCase().endsWith(ext + ".old")) {
                            await fs.rename(file, file.substring(0, file.length - ('.old').length));
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

    async getDescendantFiles(tree: BepInExTree | null, location: string): Promise<string[]> {
        const files: string[] = [];
        if (isNull(tree)) {
            const newTree = await BepInExTree.buildFromLocation(location);
            if (newTree instanceof R2Error) {
                return files;
            }
            tree = newTree;
        }
        for (const directory of tree.getDirectories()) {
            files.push(...(await this.getDescendantFiles(directory, path.join(location, directory.getDirectoryName()))));
        }
        tree.getFiles().forEach((file: string) => {
            files.push(file);
        })
        return files;
    }

    public async installMod(mod: ManifestV2): Promise<R2Error | null> {
        const cacheDirectory = path.join(PathResolver.MOD_ROOT, 'cache');
        const cachedLocationOfMod: string = path.join(cacheDirectory, mod.getName(), mod.getVersionNumber().toString());
        if (mod.getName().toLowerCase() === 'bbepis-bepinexpack') {
            return this.installBepInEx(cachedLocationOfMod);
        }
        return this.installForManifestV2(mod, cachedLocationOfMod);
    }

    async installForManifestV2(mod: ManifestV2, location: string): Promise<R2Error | null> {
        const files: BepInExTree | R2Error = await BepInExTree.buildFromLocation(location);
        if (files instanceof R2Error) {
            return files;
        }
        return this.resolveBepInExTree(location, path.basename(location), mod, files);
    }

    async resolveBepInExTree(location: string, folderName: string, mod: ManifestV2, tree: BepInExTree): Promise<R2Error | null> {
        const endFolderNames = ['plugins', 'monomod', 'core', 'config', 'patchers'];
        // Check if BepInExTree is end.
        if (endFolderNames.find((folder: string) => folder === folderName.toLowerCase()) !== undefined) {
            let profileLocation: string;
            if (folderName.toLowerCase() !== 'config') {
                profileLocation = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', folderName, mod.getName());
            } else {
                profileLocation = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', folderName);
            }
            try {
                await FileUtils.ensureDirectory(profileLocation);
                try {
                    await fs.copyFolder(
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
        for (const file of tree.getFiles()) {
            let profileLocation: string;
            if (file.toLowerCase().endsWith('.mm.dll')) {
                profileLocation = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'monomod', mod.getName());
            } else {
                profileLocation = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'plugins', mod.getName());
            }
            try {
                await FileUtils.ensureDirectory(profileLocation);
                try {
                    await fs.copyFile(
                        file,
                        path.join(profileLocation, path.basename(file))
                    );
                    // Copy is complete;
                } catch(e) {
                    const err: Error = e;
                    new FileWriteError(
                        `Failed to move mod: ${mod.getName()} with file: ${path.join(location, file)}`,
                        err.message,
                        'Is the game still running? If not, try running r2modman as an administrator'
                    );
                }
            } catch(e) {
                const err: Error = e;
                new FileWriteError(
                    `Failed to create directories for: ${profileLocation}`,
                    err.message,
                    'Try running r2modman as an administrator'
                );
            }
        }

        const directories = tree.getDirectories();
        for (const directory of directories) {
            const resolveError: R2Error | null = await this.resolveBepInExTree(
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

    async installBepInEx(bieLocation: string): Promise<R2Error | null> {
        const location = path.join(bieLocation, 'BepInExPack');
        const files: BepInExTree | R2Error = await BepInExTree.buildFromLocation(location);
        if (files instanceof R2Error) {
            return files;
        }
        for (const file of files.getFiles()) {
            try {
                await fs.copyFile(file, path.join(Profile.getActiveProfile().getPathOfProfile(), path.basename(file)));
            } catch(e) {
                const err: Error = e;
                new FileWriteError(
                    `Failed to copy file for BepInEx installation: ${file}`,
                    err.message,
                    'Is the game still running? If not, try running r2modman as an administrator'
                );
            }
        }
        for (const directory of files.getDirectories()) {
            try {
                await fs.copyFolder(
                    path.join(location, directory.getDirectoryName()),
                    path.join(Profile.getActiveProfile().getPathOfProfile(), path.basename(directory.getDirectoryName()))
                );
            } catch(e) {
                const err: Error = e;
                new FileWriteError(
                    `Failed to copy folder for BepInEx installation: ${directory.getDirectoryName()}`,
                    err.message,
                    'Is the game still running? If not, try running r2modman as an administrator'
                );
            }
        }
        return null;
    }

}
