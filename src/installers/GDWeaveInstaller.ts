import { InstallArgs, PackageInstaller } from './PackageInstaller';
import path from 'path';
import FsProvider from '../providers/generic/file/FsProvider';
import FileUtils from '../utils/FileUtils';
import { MODLOADER_PACKAGES } from '../r2mm/installing/profile_installers/ModLoaderVariantRecord';
import { PackageLoader } from '../model/installing/PackageLoader';
import FileWriteError from '../model/errors/FileWriteError';

export class GDWeaveInstaller implements PackageInstaller {
    async install(args: InstallArgs) {
        const { mod, packagePath, profile } = args;

        const mapping = MODLOADER_PACKAGES.find(
            (entry) =>
                entry.packageName.toLowerCase() ==
                    mod.getName().toLowerCase() &&
                entry.loaderType == PackageLoader.GDWEAVE
        );

        if (!mapping) {
            throw new Error(`Missing modloader for ${mod.getName()}`);
        }

        const root = path.join(packagePath, mapping.rootFolder);
        const toCopy = ['winmm.dll', 'GDWeave'];

        for (const fileOrFolder of toCopy) {
            await FileUtils.copyFileOrFolder(
                path.join(root, fileOrFolder),
                profile.joinToProfilePath(fileOrFolder)
            );
        }
    }

    async uninstall(args: InstallArgs): Promise<void> {
        const { profile } = args;

        try {
            // Remove GDWeave/core, but keep mods and config subfolder and the log file.
            const toDelete = [
                profile.joinToProfilePath('winmm.dll'),
                profile.joinToProfilePath('GDWeave', 'core'),
            ];
            for (const fileOrFolder of toDelete) {
                if (!(await FsProvider.instance.exists(fileOrFolder))) {
                    continue;
                }

                if ((await FsProvider.instance.lstat(fileOrFolder)).isFile()) {
                    await FsProvider.instance.unlink(fileOrFolder);
                } else {
                    await FileUtils.recursiveRemoveDirectoryIfExists(
                        fileOrFolder
                    );
                }
            }
        } catch (e) {
            const name = 'Failed to delete GDWeave files from profile root';
            const solution = 'Is the game still running?';
            throw FileWriteError.fromThrownValue(e, name, solution);
        }
    }
}

async function searchForManifest(
    dir: string,
    topLevel: boolean = true
): Promise<string | null> {
    // Ignore `manifest.json` at the top level - that's Thunderstore's
    if (
        !topLevel &&
        (await FsProvider.instance.exists(path.join(dir, 'manifest.json')))
    ) {
        return dir;
    }

    for (const item of await FsProvider.instance.readdir(dir)) {
        if (
            (await FsProvider.instance.stat(path.join(dir, item))).isDirectory()
        ) {
            const result = await searchForManifest(path.join(dir, item), false);
            if (result) return result;
        }
    }

    return null;
}

export class GDWeavePluginInstaller implements PackageInstaller {
    async install(args: InstallArgs) {
        const { mod, packagePath, profile } = args;

        // Packaging is all over the place. Find a folder with a manifest.json
        // not at the top level (because the top level is Thunderstore's packaging)
        const modFolder = await searchForManifest(packagePath);
        if (!modFolder) {
            throw new Error('Could not find mod folder');
        }

        const root = profile.joinToProfilePath(
            'GDWeave',
            'mods',
            mod.getName()
        );
        await FsProvider.instance.copyFolder(modFolder, root);
    }

    async uninstall(args: InstallArgs): Promise<void> {
        const { mod, profile } = args;
        const root = profile.joinToProfilePath(
            'GDWeave',
            'mods',
            mod.getName()
        );

        try {
            await FileUtils.recursiveRemoveDirectoryIfExists(root);
        } catch (e) {
            const name = 'Failed to delete mod from profile root';
            const solution = 'Is the game still running?';
            throw FileWriteError.fromThrownValue(e, name, solution);
        }
    }
}
