import path from 'path';

import { InstallArgs, PackageInstaller } from './PackageInstaller';
import FileWriteError from '../model/errors/FileWriteError';
import R2Error from '../model/errors/R2Error';
import VersionNumber from '../model/VersionNumber';
import FsProvider from '../providers/generic/file/FsProvider';
import FileUtils from '../utils/FileUtils';

/**
 * Handles (un)installation of MelonLoader v0.6.6 and above.
 */
export class NewMelonLoaderInstaller implements PackageInstaller {
    private static readonly TRACKED = ['MelonLoader', 'version.dll'];

    async install(args: InstallArgs) {
        const { mod, packagePath, profile } = args;

        // The NewMelonLoaderPluginInstaller places mod files into subfolders in the
        // profile folder. This is only supported on MelonLoader v0.6.6 and above.
        // Therefore a game that uses NewMelonLoaderPluginInstaller should always also
        // use NewMelonLoaderInstaller, which checks the mod loader version before installing.
        if (!mod.getVersionNumber().isEqualOrNewerThan(new VersionNumber('0.6.6'))) {
            throw new R2Error(
                'MelonLoader v0.6.6 or above is required',
                `Choose a newer MelonLoader version to install. If newer versions
                 are not available, this is likely a bug in the mod manager.`
            );
        }

        try {
            for (const fileOrFolder of NewMelonLoaderInstaller.TRACKED) {
                const cachePath = path.join(packagePath, fileOrFolder);
                const profilePath = profile.joinToProfilePath(fileOrFolder);
                await FileUtils.copyFileOrFolder(cachePath, profilePath);
            }
        } catch (e) {
            throw FileWriteError.fromThrownValue(e, 'Failed to install MelonLoader');
        }
    }

    async uninstall(args: InstallArgs) {
        try {
            for (const fileOrFolder of NewMelonLoaderInstaller.TRACKED) {
                const fullPath = args.profile.joinToProfilePath(fileOrFolder);

                if (!(await FsProvider.instance.exists(fullPath))) {
                    continue;
                }

                if ((await FsProvider.instance.stat(fullPath)).isDirectory()) {
                    await FileUtils.recursiveRemoveDirectoryIfExists(fullPath);
                } else {
                    await FsProvider.instance.unlink(fullPath);
                }
            }
        } catch (e) {
            throw FileWriteError.fromThrownValue(e, 'Failed to uninstall MelonLoader', 'Is the game still running?');
        }
    }
}

/**
 * Handles mod operations in a NewMelonLoaderInstaller compatible way.
 */
export class NewMelonLoaderPluginInstaller implements PackageInstaller {
    getModsPath(args: InstallArgs): string {
        return args.profile.joinToProfilePath('Mods', args.mod.getName());
    }

    getUserDataPath(args: InstallArgs): string {
        return args.profile.joinToProfilePath('UserData', args.mod.getName());
    }

    /**
     * Copy UserData as-is to UserData/<PackageName>/ and everything else
     * to Mods/<PackageName>/
     */
    async install(args: InstallArgs) {
        const files = await FsProvider.instance.readdir(args.packagePath);

        // Sanity check for manifest.json e.g. against a corrupted cache.
        // Manifest.json is required for MelonLoader's recursive loading to work.
        if (!files.includes('manifest.json')) {
            throw new R2Error(
                `manifest.json not found in source directory ${args.packagePath}`,
                `The files extracted to cache are likely corrupted and should be removed.`
            );
        }

        const modsPath = this.getModsPath(args);
        await FileUtils.ensureDirectory(modsPath);

        try {
            for (const item of files) {
                const sourceFull = path.join(args.packagePath, item);

                if (item === 'UserData') {
                    const userDataPath = this.getUserDataPath(args);
                    await FileUtils.ensureDirectory(userDataPath);
                    await FileUtils.copyFileOrFolder(sourceFull, userDataPath);
                } else {
                    const targetPath = path.join(modsPath, item);
                    await FileUtils.copyFileOrFolder(sourceFull, targetPath);
                }
            }
        } catch (e) {
            throw FileWriteError.fromThrownValue(e, 'Failed to install mod', 'Is the game still running?');
        }
    }

    async uninstall(args: InstallArgs) {
        try {
            FileUtils.recursiveRemoveDirectoryIfExists(this.getModsPath(args));
            FileUtils.recursiveRemoveDirectoryIfExists(this.getUserDataPath(args));
        } catch (e) {
            throw FileWriteError.fromThrownValue(e, 'Failed to uninstall mod', 'Is the game still running?');
        }
    }

    async disable(args: InstallArgs) {
        // As MelonLoader's recursive loading requires manifest.json to be present,
        // renaming the manifest file is enough to disable the mod.
        const enabled = path.join(this.getModsPath(args), 'manifest.json');
        const disabled = path.join(this.getModsPath(args), 'manifest.disabled');

        if (!(await FsProvider.instance.exists(enabled))) {
            throw new R2Error(
                `${enabled} not found`,
                'The mod is already disabled or the installation is corrupted.',
                'Try uninstalling and reinstalling the mod.'
            );
        }

        try {
            await FsProvider.instance.rename(enabled, disabled);
        } catch (e) {
            throw FileWriteError.fromThrownValue(e, 'Failed to disable mod', 'Is the game still running?');
        }
    }

    async enable(args: InstallArgs) {
        const enabled = path.join(this.getModsPath(args), 'manifest.json');
        const disabled = path.join(this.getModsPath(args), 'manifest.disabled');

        if (!(await FsProvider.instance.exists(disabled))) {
            throw new R2Error(
                `${disabled} not found`,
                'The mod is not disabled or the installation is corrupted.',
                'Try uninstalling and reinstalling the mod.'
            );
        }

        try {
            await FsProvider.instance.rename(disabled, enabled);
        } catch (e) {
            throw FileWriteError.fromThrownValue(e, 'Failed to enable mod', 'Is the game still running?');
        }
    }
}
