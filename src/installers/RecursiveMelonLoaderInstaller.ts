import path from 'path';

import {
    disableModByRenamingFiles,
    enableModByRenamingFiles,
    InstallArgs,
    PackageInstaller
} from './PackageInstaller';
import FileWriteError from '../model/errors/FileWriteError';
import R2Error from '../model/errors/R2Error';
import VersionNumber from '../model/VersionNumber';
import FsProvider from '../providers/generic/file/FsProvider';
import FileUtils from '../utils/FileUtils';

/**
 * Handles (un)installation of MelonLoader v0.7.0 and above.
 */
export class RecursiveMelonLoaderInstaller implements PackageInstaller {
    private static readonly TRACKED = ['MelonLoader', 'version.dll'];

    async install(args: InstallArgs): Promise<void> {
        const { mod, packagePath, profile } = args;

        // The RecursiveMelonLoaderPluginInstaller places mod files into subfolders in
        // the profile folder. This is only supported on MelonLoader v0.7.0 and above.
        // Therefore a game that uses RecursiveMelonLoaderPluginInstaller should always
        // also use RecursiveMelonLoaderInstaller, which checks the mod loader version
        // before installing.
        if (!mod.getVersionNumber().isEqualOrNewerThan(new VersionNumber('0.7.0'))) {
            throw new R2Error(
                'MelonLoader v0.7.0 or above is required',
                `Choose a newer MelonLoader version to install. If newer versions
                 are not available, this is likely a bug in the mod manager.`
            );
        }

        try {
            for (const fileOrFolder of RecursiveMelonLoaderInstaller.TRACKED) {
                const cachePath = path.join(packagePath, fileOrFolder);
                const profilePath = profile.joinToProfilePath(fileOrFolder);
                await FileUtils.copyFileOrFolder(cachePath, profilePath);
            }
        } catch (e) {
            throw FileWriteError.fromThrownValue(e, 'Failed to install MelonLoader');
        }
    }

    async uninstall(args: InstallArgs): Promise<void> {
        try {
            for (const fileOrFolder of RecursiveMelonLoaderInstaller.TRACKED) {
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
 * Handles mod operations in a RecursiveMelonLoaderInstaller compatible way.
 */
export class RecursiveMelonLoaderPluginInstaller implements PackageInstaller {
    private getModsPath(args: InstallArgs): string {
        return args.profile.joinToProfilePath('Mods', args.mod.getName());
    }

    private getUserDataPath(args: InstallArgs): string {
        return args.profile.joinToProfilePath('UserData', args.mod.getName());
    }

    private throwActionError(e: unknown, action: string): void {
        const name = `Failed to ${action} mod`;
        const solution = 'Is the game still running?';
        throw FileWriteError.fromThrownValue(e, name, solution);
    }

    /**
     * Copy UserData as-is to UserData/<PackageName>/ and everything else
     * to Mods/<PackageName>/
     */
    async install(args: InstallArgs): Promise<void> {
        const files = await FsProvider.instance.readdir(args.packagePath);
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
            this.throwActionError(e, 'install');
        }
    }

    async uninstall(args: InstallArgs): Promise<void> {
        try {
            FileUtils.recursiveRemoveDirectoryIfExists(this.getModsPath(args));
            FileUtils.recursiveRemoveDirectoryIfExists(this.getUserDataPath(args));
        } catch (e) {
            this.throwActionError(e, 'uninstall');
        }
    }

    async disable(args: InstallArgs): Promise<void> {
        try {
            await disableModByRenamingFiles(this.getModsPath(args));
        } catch (e) {
            this.throwActionError(e, 'disable');
        }
    }

    async enable(args: InstallArgs): Promise<void> {
        try {
            await enableModByRenamingFiles(this.getModsPath(args));
        } catch (e) {
            this.throwActionError(e, 'enable');
        }
    }
}
