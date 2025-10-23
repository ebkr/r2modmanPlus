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