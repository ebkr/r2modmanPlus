import path from "../providers/node/path/path";
import { InstallArgs, PackageInstaller } from './PackageInstaller';
import FileWriteError from '../model/errors/FileWriteError';
import FsProvider from '../providers/generic/file/FsProvider';
import FileUtils from '../utils/FileUtils';

export class GodotMLInstaller implements PackageInstaller {
    // JSON_Schema_Validator present on v7.0.1+ only.
    private static readonly TRACKED = ['mod_loader', 'JSON_Schema_Validator']

    /**
     * Handles installation of GodotML
     */
    async install(args: InstallArgs) {
        const { packagePath, profile } = args;

        try {
            for (const fileOrFolder of GodotMLInstaller.TRACKED) {
                const copyFrom = path.join(packagePath, 'addons', fileOrFolder);

                if (!await FsProvider.instance.exists(copyFrom)) {
                    continue;
                }

                const copyTo = profile.joinToProfilePath('addons', fileOrFolder);
                await FileUtils.copyFileOrFolder(copyFrom, copyTo);
            }
        } catch (e) {
            throw FileWriteError.fromThrownValue(e, 'Failed to install GodotML');
        }
    }
}
