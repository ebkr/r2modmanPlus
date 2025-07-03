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
 * Copies all files as-is from mods cache folder to
 * mods/TeamName-PackageName in profile folder.
 */
export class DirectCopyInstaller implements PackageInstaller {
    private getModFolder(args: InstallArgs): string {
        return args.profile.joinToProfilePath('mods', args.mod.getName());
    }

    private throwActionError(e: unknown, action: string): void {
        const name = `Failed to ${action} mod`;
        const solution = 'Is the game still running?';
        throw FileWriteError.fromThrownValue(e, name, solution);
    }

    async install(args: InstallArgs): Promise<void> {
        const { packagePath } = args;
        const files = await FsProvider.instance.readdir(packagePath);
        const targetFolder = this.getModFolder(args);
        await FileUtils.ensureDirectory(targetFolder);

        try {
            for (const item of files) {
                const sourcePath = path.join(packagePath, item);
                const targetPath = path.join(targetFolder, item);
                await FileUtils.copyFileOrFolder(sourcePath, targetPath);
            }
        } catch (e) {
            this.throwActionError(e, 'install');
        }
    }

    async uninstall(args: InstallArgs): Promise<void> {
        try {
            FileUtils.recursiveRemoveDirectoryIfExists(this.getModFolder(args));
        } catch (e) {
            this.throwActionError(e, 'uninstall');
        }
    }

    async disable(args: InstallArgs): Promise<void> {
        try {
            await disableModByRenamingFiles(this.getModFolder(args));
        } catch (e) {
            this.throwActionError(e, 'disable');
        }
    }

    async enable(args: InstallArgs): Promise<void> {
        try {
            await enableModByRenamingFiles(this.getModFolder(args));
        } catch (e) {
            this.throwActionError(e, 'enable');
        }
    }
}
