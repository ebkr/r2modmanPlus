import {
    disableModByRenamingFiles,
    enableModByRenamingFiles,
    InstallArgs,
    PackageInstaller
} from './PackageInstaller';
import path from 'path';
import FsProvider from '../providers/generic/file/FsProvider';
import FileUtils from '../utils/FileUtils';
import { MODLOADER_PACKAGES } from '../r2mm/installing/profile_installers/ModLoaderVariantRecord';
import { PackageLoader } from '../model/schema/ThunderstoreSchema';
import FileWriteError from '../model/errors/FileWriteError';
import R2Error from '../model/errors/R2Error';

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
    getModFolderInProfile(args: InstallArgs): string {
        return args.profile.joinToProfilePath(
            'GDWeave',
            'mods',
            args.mod.getName()
        );
    }

    async install(args: InstallArgs) {
        // Packaging is all over the place. Find a folder with a manifest.json
        // not at the top level (because the top level is Thunderstore's packaging)
        const modFolderInCache = await searchForManifest(args.packagePath);
        if (!modFolderInCache) {
            throw new R2Error(
                'Could not find mod folder',
                'Either the mod package is malformed, or the files extracted to cache are corrupted'
            );
        }

        const modFolderInProfile = this.getModFolderInProfile(args);

        try {
            await FsProvider.instance.copyFolder(modFolderInCache, modFolderInProfile);
        } catch (e) {
            const name = 'Failed to copy mod to profile';
            throw FileWriteError.fromThrownValue(e, name);
        }
    }

    async uninstall(args: InstallArgs): Promise<void> {
        try {
            await FileUtils.recursiveRemoveDirectoryIfExists(
                this.getModFolderInProfile(args)
            );
        } catch (e) {
            const name = 'Failed to delete mod from profile root';
            const solution = 'Is the game still running?';
            throw FileWriteError.fromThrownValue(e, name, solution);
        }
    }

    async enable(args: InstallArgs): Promise<void> {
        try {
            await enableModByRenamingFiles(
                this.getModFolderInProfile(args)
            );
        } catch (e) {
            const name = 'Failed to enable mod';
            const solution = 'Is the game still running?';
            throw FileWriteError.fromThrownValue(e, name, solution);
        }
    }

    async disable(args: InstallArgs): Promise<void> {
        try {
            await disableModByRenamingFiles(
                this.getModFolderInProfile(args)
            );
        } catch (e) {
            const name = 'Failed to disable mod';
            const solution = 'Is the game still running?';
            throw FileWriteError.fromThrownValue(e, name, solution);
        }
    }
}
