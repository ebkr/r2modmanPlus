import ProfileInstallerProvider from '../../../providers/ror2/installing/ProfileInstallerProvider';
import ManifestV2 from '../../../model/ManifestV2';
import FileTree from '../../../model/file/FileTree';
import R2Error from '../../../model/errors/R2Error';
import Profile from '../../../model/Profile';
import ModLoaderPackageMapping from '../../../model/installing/ModLoaderPackageMapping';
import path from 'path';
import PathResolver from '../../../r2mm/manager/PathResolver';
import GameManager from '../../../model/game/GameManager';
import { MOD_LOADER_VARIANTS } from '../../../r2mm/installing/profile_installers/ModLoaderVariantRecord';

const INSTALLATION_RULES = {
    Mods: {_files: [".dll"]},
    Plugins: {_files: [".dll"]},
    UserData: {
        CustomItems: {_files: [".melon"]},
        CustomMaps: {_files: [".bcm"]},
        PlayerModels: {_files: [".body"]},
        CustomLoadScreens: {_files: [".load"]},
        Music: {_files: [".wav"]},
        Food: {_files: [".food"]},
        Scoreworks: {_files: [".sw"]},
        CustomSkins: {_files: [".png"]}
    }
}

/**
 * TODO:
 * - Implementations
 * - Track files (where to store? [profile]/_state? somewhere else?)
 * - ConflictManagementProvider should be used on enable/disable/uninstall. Newly installed will have higher priority than already installed mods.
 */
export default class MelonLoaderProfileInstaller extends ProfileInstallerProvider {

    async applyModMode(mod: ManifestV2, tree: FileTree, location: string, mode: number): Promise<R2Error | void> {
        return Promise.resolve(undefined);
    }

    async disableMod(mod: ManifestV2, profile: Profile): Promise<R2Error | void> {
        return Promise.resolve(undefined);
    }

    async enableMod(mod: ManifestV2, profile: Profile): Promise<R2Error | void> {
        return Promise.resolve(undefined);
    }

    async getDescendantFiles(tree: FileTree | null, location: string): Promise<string[]> {
        return Promise.resolve([]);
    }

    async installForManifestV2(mod: ManifestV2, profile: Profile, location: string): Promise<R2Error | null> {
        const files: FileTree | R2Error = await FileTree.buildFromLocation(location);
        if (files instanceof R2Error) {
            return files;
        }
        const result = await this.resolveBepInExTree(profile, location, path.basename(location), mod, files);
        if (result instanceof R2Error) {
            return result;
        }
        // TODO: Install and track result of file resolution.
        return null;
    }

    async installMod(mod: ManifestV2, profile: Profile): Promise<R2Error | null> {
        const cacheDirectory = path.join(PathResolver.MOD_ROOT, 'cache');
        const cachedLocationOfMod: string = path.join(cacheDirectory, mod.getName(), mod.getVersionNumber().toString());

        const activeGame = GameManager.activeGame;
        const bepInExVariant = MOD_LOADER_VARIANTS[activeGame.internalFolderName];
        const variant = bepInExVariant.find(value => value.packageName.toLowerCase() === mod.getName().toLowerCase());
        if (variant !== undefined) {
            return this.installModLoader(cachedLocationOfMod, variant, profile);
        }
        return this.installForManifestV2(mod, profile, cachedLocationOfMod);
    }

    async installModLoader(bieLocation: string, bepInExVariant: ModLoaderPackageMapping, profile: Profile): Promise<R2Error | null> {
        return Promise.resolve(null);
    }

    async resolveBepInExTree(profile: Profile, location: string, folderName: string, mod: ManifestV2, tree: FileTree): Promise<R2Error | string[]> {
        const fileRelocationResult: string[] = [];
        for (const directory of tree.getDirectories()) {
            let dirMatched = false;
            const matchingDir = Object.keys(INSTALLATION_RULES).find(value => value.toLowerCase() === directory.getDirectoryName().toLowerCase());
            if (matchingDir !== undefined) {
                dirMatched = true;
                directory.getRecursiveFiles().forEach(file => {
                    fileRelocationResult.push(path.relative(location, file));
                })
            }
            Object.keys(INSTALLATION_RULES)
                .flatMap(topLevel => Object.keys((INSTALLATION_RULES as any)[topLevel]))
                .forEach(subLevel => {
                    if (subLevel.toLowerCase() !== "_files") {
                        if (directory.getDirectoryName().toLowerCase() === subLevel.toLowerCase()) {
                            dirMatched = true;
                            directory.getRecursiveFiles().forEach(file => {
                                fileRelocationResult.push(path.join("UserData", path.relative(location, file)));
                            })
                        }
                    }
                });
            if (!dirMatched) {
                const resolveResult = await this.resolveBepInExTree(profile, path.join(location, directory.getDirectoryName()), directory.getDirectoryName(), mod, directory)
                if (resolveResult instanceof R2Error) {
                    return resolveResult;
                }
                fileRelocationResult.push(...resolveResult);
            }
        }
        // TODO: Auto-resolve loose files
        console.log(fileRelocationResult);
        return Promise.resolve(fileRelocationResult);
    }

    async uninstallMod(mod: ManifestV2, profile: Profile): Promise<R2Error | null> {
        return Promise.resolve(null);
    }

}
