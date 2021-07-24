import ProfileInstallerProvider from '../../../providers/ror2/installing/ProfileInstallerProvider';
import ManifestV2 from '../../../model/ManifestV2';
import FileTree from '../../../model/file/FileTree';
import R2Error from '../../../model/errors/R2Error';
import Profile from '../../../model/Profile';
import ModLoaderPackageMapping from '../../../model/installing/ModLoaderPackageMapping';

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
        return Promise.resolve(null);
    }

    async installMod(mod: ManifestV2, profile: Profile): Promise<R2Error | null> {
        return Promise.resolve(null);
    }

    async installModLoader(bieLocation: string, bepInExVariant: ModLoaderPackageMapping, profile: Profile): Promise<R2Error | null> {
        return Promise.resolve(null);
    }

    async resolveBepInExTree(profile: Profile, location: string, folderName: string, mod: ManifestV2, tree: FileTree): Promise<R2Error | null> {
        return Promise.resolve(null);
    }

    async uninstallMod(mod: ManifestV2, profile: Profile): Promise<R2Error | null> {
        return Promise.resolve(null);
    }

}
