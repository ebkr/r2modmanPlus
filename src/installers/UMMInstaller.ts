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

/**
 * TODO: define install and uninstall methods for the UMM mod loader package.
 * This is used for the mod loader only, not the mods themselves. Mod loader package
 * installers don't support the disable/enable functionality.
 *
 * I've provided some example implementations, feel free to adjust them as needed.
 * Check the other installer implementations in this folder for ideas.
 *
 * As discussed in the Discord, ideally this would be universal UMM support, not
 * Broforce exclusive.
 */
export class UMMInstaller implements PackageInstaller {
    /**
     * This assumes the package zip to have a following structure.
     * UMM-UMM.zip
     * ├ UMM
     * │ └ whatever files UMM requires
     * ├ someDoorstop.dll
     * ├ manifest.json (ignored by installer)
     * ├ icon.png (ignored by installer)
     * ├ README.md (ignored by installer)
     * └ CHANGELOG.md (optional, ignored by installer)
     *
     * Adjust as needed. Also worth noting that this ignores the "rootFolder" defined
     * in the ecosystem.json file for simplicity's sake. If you think the root folder
     * might differ for different games, it can be loaded dynamically in the installer
     * method, check other installer implementation for examples.
     */
    private static readonly TRACKED = ['someDoorstop.dll', 'UMM'];

    /**
     * TODO: When install is called, the files from the package zip have already
     * been downloaded and extracted into the cache folder. This method should do
     * whatever is required for them to be placed in the proper locations in the
     * profile folder. After the mod installation the profile folder should contain:
     *
     * ProfileFolder
     * ├ _state (folder used internally by mod manager, not relevant here)
     * ├ UMM (or some other name, folder containing mod loader files)
     * ├ mods.yml (mod manager internal file for tracking mod states)
     * └ someDoorstop.dll
     *
     * The idea is to keep the root of the profile relatively clear, as all contents
     * not excluded in ModLinker.performLink will get copied to game folder. If installed
     * mods are not placed under UMM folder, they can have their own folder in the profile
     * root, but this should be excluded in ModLinker.
     */
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

    /**
     * TODO: this should undo whatever the install method did to the profile folder.
     */
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
