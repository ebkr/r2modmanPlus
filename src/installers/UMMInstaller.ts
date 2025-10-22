import path from "../providers/node/path/path";

import {
    disableModByRenamingFiles,
    enableModByRenamingFiles,
    InstallArgs,
    PackageInstaller
} from './PackageInstaller';
import FileWriteError from '../model/errors/FileWriteError';
import FsProvider from '../providers/generic/file/FsProvider';
import FileUtils from '../utils/FileUtils';

export class UMMInstaller implements PackageInstaller {

    private static readonly TRACKED = ['UMM', 'doorstop_config.ini', 'winhttp.dll'];

    async install(args: InstallArgs): Promise<void> {
        const { packagePath, profile } = args;

        try {
            for (const fileOrFolder of UMMInstaller.TRACKED) {
                const cachePath = path.join(packagePath, fileOrFolder);
                const profilePath = profile.joinToProfilePath(fileOrFolder);
                await FileUtils.copyFileOrFolder(cachePath, profilePath);
            }
        } catch (e) {
            throw FileWriteError.fromThrownValue(e, 'Failed to install Unity Mod Manager');
        }
    }

    async uninstall(args: InstallArgs): Promise<void> {
        try {
            for (const fileOrFolder of UMMInstaller.TRACKED) {
                const profilePath = args.profile.joinToProfilePath(fileOrFolder);

                if (!(await FsProvider.instance.exists(profilePath))) {
                    continue;
                }

                if ((await FsProvider.instance.stat(profilePath)).isDirectory()) {
                    await FileUtils.recursiveRemoveDirectoryIfExists(profilePath);
                } else {
                    await FsProvider.instance.unlink(profilePath);
                }
            }
        } catch (e) {
            throw FileWriteError.fromThrownValue(
                e,
                'Failed to uninstall Unity Mod Manager',
                'Is the game still running?'
            );
        }
    }
}

/**
 * TODO: like UMMInstaller, but called for the mod packages.
 */
export class UMMPluginInstaller implements PackageInstaller {
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
     * TODO copy files from cache to proper places in profile.
     * This implementation is just copied from RecursiveMelonLoader as an
     * example of placing different stuff in different places in the profile
     * based on structure inside the package zip. IIRC the plan was to have
     * a few special cases for Broforce too. No need to use this implementation,
     * feel free to make your own if it makes sense.
     *
     * Ideally the files for each mod is placed in a teamName-packageName
     * namespaced folders within the target path(s) to avoid conflicts and make
     * cleanup easier.
     *
     * Ideally this too would be universal instead of Broforce specific. IMO
     * Broforce specific stuff can be included here, if it's unlikely to conflict
     * with possible other games later on. Any game specific stuff should be marked
     * as such by a comment. One option to avoid having game specific stuff here
     * would be to use the installRules (by editing ecosystem.json). They would
     * have to be compatible with the current installRule specification though,
     * which may or may not work nicely.
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

    /**
     * TODO: remove mod files from profile folder
     */
    async uninstall(args: InstallArgs): Promise<void> {
        try {
            FileUtils.recursiveRemoveDirectoryIfExists(this.getModsPath(args));
            FileUtils.recursiveRemoveDirectoryIfExists(this.getUserDataPath(args));
        } catch (e) {
            this.throwActionError(e, 'uninstall');
        }
    }

    /**
     * TODO By default R2MM/TSMM disable mods by renaming the files.
     * Some other strategy can be used if it makes more sense given UMM's
     * in-game mod disabling. Not that R2MM/TSMM separately tracks the status
     * in mods.yml file, so the file names are not the only source of truth.
     */
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
