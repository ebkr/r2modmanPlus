import {
    disableModByRenamingFiles,
    enableModByRenamingFiles,
    InstallArgs,
    PackageInstaller
} from './PackageInstaller';
import path from '../providers/node/path/path';
import FsProvider from '../providers/generic/file/FsProvider';
import FileUtils from '../utils/FileUtils';
import {MODLOADER_PACKAGES} from '../r2mm/installing/profile_installers/ModLoaderVariantRecord';
import FileWriteError from '../model/errors/FileWriteError';
import R2Error from '../model/errors/R2Error';

export class MioInstaller implements PackageInstaller {
    async install(args: InstallArgs): Promise<void> {
        const {mod, packagePath, profile} = args;
        const mapping = MODLOADER_PACKAGES.find(entry => entry.packageName === mod.getName())!;

        const root = path.join(packagePath, mapping.rootFolder);
        try {
            for (const folder of ['mods', 'modconfig']) {
                await FileUtils.ensureDirectory(profile.joinToProfilePath(folder));
            }
            for (const fileOrFolder of ['winhttp.dll', 'mio-mod-loader']) {
                await FileUtils.copyFileOrFolder(
                    path.join(root, fileOrFolder),
                    profile.joinToProfilePath(fileOrFolder)
                );
            }
        } catch (e) {
            throw FileWriteError.fromThrownValue(e, 'Failed to install MIO mod loader');
        }
    }

    async uninstall(args: InstallArgs): Promise<void> {
        try {
            const proxyPath = args.profile.joinToProfilePath('winhttp.dll');
            if (await FsProvider.instance.exists(proxyPath)) {
                await FsProvider.instance.unlink(proxyPath);
            }
            await FileUtils.recursiveRemoveDirectoryIfExists(args.profile.joinToProfilePath('mio-mod-loader'));
        } catch (e) {
            throw FileWriteError.fromThrownValue(e, 'Failed to uninstall MIO mod loader', 'Is the game still running?');
        }
    }
}

async function findModFolder(directory: string): Promise<string | null> {
    const fs = FsProvider.instance;
    if (await fs.exists(path.join(directory, 'mod.json'))) {
        return directory;
    }

    for (const entry of await fs.readdir(directory)) {
        const entryPath = path.join(directory, entry);
        if ((await fs.lstat(entryPath)).isDirectory()) {
            const folder = await findModFolder(entryPath);
            if (folder) {
                return folder;
            }
        }
    }
    return null;
}

export class MioPluginInstaller implements PackageInstaller {
    private getModFolder(args: InstallArgs): string {
        return args.profile.joinToProfilePath('mods', args.mod.getName());
    }

    async install(args: InstallArgs): Promise<void> {
        const folder = await findModFolder(args.packagePath);
        if (!folder) {
            throw new R2Error(
                'Could not find a MIO mod folder',
                'The package must contain a mod.json file.'
            );
        }

        try {
            // The loader reads mod.json only in immediate children of the mods directory.
            const destination = this.getModFolder(args);
            await FileUtils.ensureDirectory(destination);
            await FsProvider.instance.copyFolder(folder, destination);
        } catch (e) {
            throw FileWriteError.fromThrownValue(e, 'Failed to install MIO mod');
        }
    }

    async uninstall(args: InstallArgs): Promise<void> {
        try {
            await FileUtils.recursiveRemoveDirectoryIfExists(this.getModFolder(args));
        } catch (e) {
            throw FileWriteError.fromThrownValue(e, 'Failed to uninstall MIO mod', 'Is the game still running?');
        }
    }

    async enable(args: InstallArgs): Promise<void> {
        try {
            await enableModByRenamingFiles(this.getModFolder(args));
        } catch (e) {
            throw FileWriteError.fromThrownValue(e, 'Failed to enable MIO mod', 'Is the game still running?');
        }
    }

    async disable(args: InstallArgs): Promise<void> {
        try {
            await disableModByRenamingFiles(this.getModFolder(args));
        } catch (e) {
            throw FileWriteError.fromThrownValue(e, 'Failed to disable MIO mod', 'Is the game still running?');
        }
    }
}
