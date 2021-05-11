import R2Error from '../../model/errors/R2Error';

import ManifestV2 from '../../model/ManifestV2';
import BepInExTree from '../../model/file/BepInExTree';

import * as path from 'path';
import FsProvider from '../../providers/generic/file/FsProvider';
import Profile from '../../model/Profile';
import FileWriteError from '../../model/errors/FileWriteError';
import ModMode from '../../model/enums/ModMode';
import PathResolver from '../manager/PathResolver';
import ProfileInstallerProvider from '../../providers/ror2/installing/ProfileInstallerProvider';
import FileUtils from '../../utils/FileUtils';
import ManagerInformation from '../../_managerinf/ManagerInformation';
import BepInExPackageMapping from '../../model/installing/BepInExPackageMapping';
import GameManager from '../../model/game/GameManager';
let fs: FsProvider;

const modModeExtensions: string[] = [".dll", ".language", 'skin.cfg'];

/**
 * Used to record which package to handle based on the current game.
 *
 * Mapping is:
 * game's InternalFolderName: Mapping
 */
export const BEPINEX_VARIANTS: {[key: string]: BepInExPackageMapping[]} = {
    RiskOfRain2: [new BepInExPackageMapping("bbepis-BepInExPack", "BepInExPack")],
    DysonSphereProgram: [new BepInExPackageMapping("xiaoye97-BepInEx", "BepInExPack")],
    Valheim: [
        new BepInExPackageMapping("denikson-BepInExPack_Valheim", "BepInExPack_Valheim"),
        new BepInExPackageMapping("1F31A-BepInEx_Valheim_Full", "BepInEx_Valheim_Full"),
    ],
    GTFO: [new BepInExPackageMapping("BepInEx-BepInExPack_GTFO", "BepInExPack_GTFO")],
    Outward: [new BepInExPackageMapping("BepInEx-BepInExPack_Outward", "BepInExPack_Outward")],
    TaleSpire: [new BepInExPackageMapping("bbepis-BepInExPack", "BepInExPack")]
}

export default class ProfileInstaller extends ProfileInstallerProvider {

    constructor() {
        super();
        fs = FsProvider.instance;
    }

    /**
     * Uninstalls a mod by looking through the top level of profile/BepInEx/*
     * Any folder inside * locations with the mod name will be deleted.
     * @param mod
     * @param profile
     */
    public async uninstallMod(mod: ManifestV2, profile: Profile): Promise<R2Error | null> {
        const activeGame = GameManager.activeGame;
        const bepInExVariant = BEPINEX_VARIANTS[activeGame.internalFolderName];
            if (bepInExVariant.find(value => value.packageName.toLowerCase() === mod.getName().toLowerCase())) {
            try {
                for (const file of (await fs.readdir(profile.getPathOfProfile()))) {
                    const filePath = path.join(profile.getPathOfProfile(), file);
                    if ((await fs.lstat(filePath)).isFile()) {
                        if (file.toLowerCase() !== 'mods.yml') {
                            await fs.unlink(filePath);
                        }
                    }
                }
            } catch(e) {
                const err: Error = e;
                return new FileWriteError(
                    'Failed to delete BepInEx file from profile root',
                    err.message,
                    'Is the game still running?'
                );
            }
        }
        const bepInExLocation: string = path.join(profile.getPathOfProfile(), 'BepInEx');
        if (await fs.exists(bepInExLocation)) {
            try {
                for (const file of (await fs.readdir(bepInExLocation))) {
                    if ((await fs.lstat(path.join(bepInExLocation, file))).isDirectory()) {
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
                return new R2Error(
                    "Failed to remove files",
                    err.message,
                    'Is the game still running? If so, close it and try again.'
                );
            }
        }
        return Promise.resolve(null);
    }

    public async disableMod(mod: ManifestV2, profile: Profile): Promise<R2Error | void> {
        const bepInExLocation: string = path.join(profile.getPathOfProfile(), 'BepInEx');
        const files: BepInExTree | R2Error = await BepInExTree.buildFromLocation(bepInExLocation);
        if (files instanceof R2Error) {
            return files;
        }
        const applyError: R2Error | void = await this.applyModMode(mod, files, bepInExLocation, ModMode.DISABLED);
        if (applyError instanceof R2Error) {
            return applyError;
        }
    }

    public async enableMod(mod: ManifestV2, profile: Profile): Promise<R2Error | void> {
        const bepInExLocation: string = path.join(profile.getPathOfProfile(), 'BepInEx');
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
                const applyError = await this.applyModMode(mod, directory, path.join(location, directory.getDirectoryName()), mode);
                if (applyError instanceof R2Error) {
                    return applyError;
                }
            } else {
                files.push(...(await this.getDescendantFiles(null, path.join(location, directory.getDirectoryName()))));
            }
        }
        for (const file of files) {
            try {
                if (mode === ModMode.DISABLED) {
                    for (const ext of modModeExtensions) {
                        if (file.toLowerCase().endsWith(ext)) {
                            await fs.rename(file, file + '.old');
                        }
                    }
                } else if (mode === ModMode.ENABLED) {
                    for (const ext of modModeExtensions) {
                        if (file.toLowerCase().endsWith(ext + ".old")) {
                            await fs.rename(file, file.substring(0, file.length - ('.old').length));
                        }
                    }
                }
            } catch(e) {
                const err: Error = e;
                return new R2Error(
                    `Failed to rename file ${file} with ModMode of ${mode}`,
                    err.message,
                    'Ensure that the game is closed.'
                );
            }
        }
    }

    async getDescendantFiles(tree: BepInExTree | null, location: string): Promise<string[]> {
        const files: string[] = [];
        if (tree === null) {
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

    public async installMod(mod: ManifestV2, profile: Profile): Promise<R2Error | null> {
        const cacheDirectory = path.join(PathResolver.MOD_ROOT, 'cache');
        const cachedLocationOfMod: string = path.join(cacheDirectory, mod.getName(), mod.getVersionNumber().toString());

        const activeGame = GameManager.activeGame;
        const bepInExVariant = BEPINEX_VARIANTS[activeGame.internalFolderName];
        const variant = bepInExVariant.find(value => value.packageName.toLowerCase() === mod.getName().toLowerCase());
        if (variant !== undefined) {
            return this.installBepInEx(cachedLocationOfMod, variant, profile);
        }
        return this.installForManifestV2(mod, profile, cachedLocationOfMod);
    }

    async installForManifestV2(mod: ManifestV2, profile: Profile, location: string): Promise<R2Error | null> {
        const files: BepInExTree | R2Error = await BepInExTree.buildFromLocation(location);
        if (files instanceof R2Error) {
            return files;
        }
        return this.resolveBepInExTree(profile, location, path.basename(location), mod, files);
    }

    async resolveBepInExTree(profile: Profile, location: string, folderName: string, mod: ManifestV2, tree: BepInExTree): Promise<R2Error | null> {
        const endFolderNames = ['plugins', 'monomod', 'core', 'config', 'patchers', 'SlimVML'];
        // Check if BepInExTree is end.
        const matchingEndFolderName = endFolderNames.find((folder: string) => folder.toLowerCase() === folderName.toLowerCase());
        if (matchingEndFolderName !== undefined) {
            let profileLocation: string;
            if (folderName.toLowerCase() !== 'config') {
                profileLocation = path.join(profile.getPathOfProfile(), 'BepInEx', matchingEndFolderName, mod.getName());
            } else {
                profileLocation = path.join(profile.getPathOfProfile(), 'BepInEx', matchingEndFolderName);
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
                        `Is the game still running? If not, try running ${ManagerInformation.APP_NAME} as an administrator`
                    );
                }
            } catch(e) {
                const err: Error = e;
                return new FileWriteError(
                    `Failed to create directories for: ${profileLocation}`,
                    err.message,
                    `Is the game still running? If not, try running ${ManagerInformation.APP_NAME} as an administrator`
                );
            }
        }
        // If no match
        for (const file of tree.getFiles()) {
            let profileLocation: string;
            if (file.toLowerCase().endsWith('.mm.dll')) {
                profileLocation = path.join(profile.getPathOfProfile(), 'BepInEx', 'monomod', mod.getName());
            } else {
                profileLocation = path.join(profile.getPathOfProfile(), 'BepInEx', 'plugins', mod.getName());
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
                        `Is the game still running? If not, try running ${ManagerInformation.APP_NAME} as an administrator`
                    );
                }
            } catch(e) {
                const err: Error = e;
                new FileWriteError(
                    `Failed to create directories for: ${profileLocation}`,
                    err.message,
                    `Try running ${ManagerInformation.APP_NAME} as an administrator`
                );
            }
        }

        const directories = tree.getDirectories();
        for (const directory of directories) {
            const resolveError: R2Error | null = await this.resolveBepInExTree(
                profile,
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

    async installBepInEx(bieLocation: string, bepInExVariant: BepInExPackageMapping, profile: Profile): Promise<R2Error | null> {
        const location = path.join(bieLocation, bepInExVariant.rootFolder);
        const files: BepInExTree | R2Error = await BepInExTree.buildFromLocation(location);
        if (files instanceof R2Error) {
            return files;
        }
        for (const file of files.getFiles()) {
            try {
                await fs.copyFile(file, path.join(profile.getPathOfProfile(), path.basename(file)));
            } catch(e) {
                const err: Error = e;
                return new FileWriteError(
                    `Failed to copy file for BepInEx installation: ${file}`,
                    err.message,
                    `Is the game still running? If not, try running ${ManagerInformation.APP_NAME} as an administrator`
                );
            }
        }
        for (const directory of files.getDirectories()) {
            try {
                await fs.copyFolder(
                    path.join(location, directory.getDirectoryName()),
                    path.join(profile.getPathOfProfile(), path.basename(directory.getDirectoryName()))
                );
            } catch(e) {
                const err: Error = e;
                return new FileWriteError(
                    `Failed to copy folder for BepInEx installation: ${directory.getDirectoryName()}`,
                    err.message,
                    `Is the game still running? If not, try running ${ManagerInformation.APP_NAME} as an administrator`
                );
            }
        }
        try {
            await fs.copyFile(
                path.join(bieLocation, "icon.png"),
                path.join(profile.getPathOfProfile(), "BepInEx", "core", "icon.png")
            );
        }catch(e) {
            const err: Error = e;
            return new FileWriteError(
                `Failed to copy icon asset for BepInEx installation`,
                err.message,
                `Is the game still running? If not, try running ${ManagerInformation.APP_NAME} as an administrator`
            );
        }
        return Promise.resolve(null);
    }

}
