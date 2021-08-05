import ProfileInstallerProvider from '../../../providers/ror2/installing/ProfileInstallerProvider';
import ManifestV2 from '../../../model/ManifestV2';
import FileTree from '../../../model/file/FileTree';
import R2Error from '../../../model/errors/R2Error';
import Profile from '../../../model/Profile';
import ModLoaderPackageMapping from '../../../model/installing/ModLoaderPackageMapping';
import ProfileInstallerResolverProvider from '../../../providers/generic/installing/ProfileInstallerResolverProvider';
import GameManager from '../../../model/game/GameManager';
import path from 'path';

export default class ComputedProfileInstaller extends ProfileInstallerProvider {

    async applyModMode(mod: ManifestV2, tree: FileTree, profile: Profile, location: string, mode: number): Promise<R2Error | void> {
        return (await ProfileInstallerResolverProvider.instance.determineLoader(GameManager.activeGame, mod))
            .applyModMode(mod, tree, profile, location, mode);
    }

    async disableMod(mod: ManifestV2, profile: Profile): Promise<R2Error | void> {
        return (await ProfileInstallerResolverProvider.instance.determineLoader(GameManager.activeGame, mod))
            .disableMod(mod, profile);
    }

    async enableMod(mod: ManifestV2, profile: Profile): Promise<R2Error | void> {
        return (await ProfileInstallerResolverProvider.instance.determineLoader(GameManager.activeGame, mod))
            .enableMod(mod, profile);
    }

    async getDescendantFiles(tree: FileTree | null, location: string): Promise<string[]> {
        const files: string[] = [];
        if (tree === null) {
            const newTree = await FileTree.buildFromLocation(location);
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

    async installForManifestV2(mod: ManifestV2, profile: Profile, location: string): Promise<R2Error | null> {
        return (await ProfileInstallerResolverProvider.instance.determineLoader(GameManager.activeGame, mod))
            .installForManifestV2(mod, profile, location);
    }

    async installMod(mod: ManifestV2, profile: Profile): Promise<R2Error | null> {
        return (await ProfileInstallerResolverProvider.instance.determineLoader(GameManager.activeGame, mod))
            .installMod(mod, profile);
    }

    async installModLoader(bieLocation: string, modLoaderMapping: ModLoaderPackageMapping, profile: Profile): Promise<R2Error | null> {
        return (await ProfileInstallerResolverProvider.instance.getLoader(modLoaderMapping.loaderType))
            .installModLoader(bieLocation, modLoaderMapping, profile);
    }

    async resolveBepInExTree(profile: Profile, location: string, folderName: string, mod: ManifestV2, tree: FileTree): Promise<R2Error | void> {
        return (await ProfileInstallerResolverProvider.instance.determineLoader(GameManager.activeGame, mod))
            .resolveBepInExTree(profile, location, folderName, mod, tree);
    }

    async uninstallMod(mod: ManifestV2, profile: Profile): Promise<R2Error | null> {
        return (await ProfileInstallerResolverProvider.instance.determineLoader(GameManager.activeGame, mod))
            .uninstallMod(mod, profile);
    }

}
