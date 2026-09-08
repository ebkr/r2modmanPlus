import {
    disableModByRenamingFiles,
    enableModByRenamingFiles,
    InstallArgs,
    PackageInstaller,
} from "./PackageInstaller";
import FileNotFoundError from "../model/errors/FileNotFoundError";
import FileWriteError from "../model/errors/FileWriteError";
import FsProvider from "../providers/generic/file/FsProvider";
import path from "../providers/node/path/path";
import FileUtils from "../utils/FileUtils";

export class GDPatchInstaller implements PackageInstaller {
    async install(args: InstallArgs) {
        const {
            packagePath,
            profile,
        } = args;

        const fs = FsProvider.instance;

        const windowsLoaderSrc = path.join(packagePath, "gdpatch_loader.dll");
        const windowsLoaderDest = profile.joinToProfilePath("winmm.dll");
        await fs.copyFile(windowsLoaderSrc, windowsLoaderDest);

        const linuxLoaderSrc = path.join(packagePath, "libgdpatch_loader.so");
        const linuxLoaderDest = profile.joinToProfilePath("libgdpatch_loader.so");
        await fs.copyFile(linuxLoaderSrc, linuxLoaderDest);

        const macosLoaderSrc = path.join(packagePath, "libgdpatch_loader.dylib");
        const macosLoaderDest = profile.joinToProfilePath("libgdpatch_loader.dylib");
        await fs.copyFile(macosLoaderSrc, macosLoaderDest);
    }

    async uninstall(args: InstallArgs) {
        const { profile } = args;
        const fs = FsProvider.instance;

        const loaderPaths = [
            profile.joinToProfilePath("winmm.dll"),
            profile.joinToProfilePath("libgdpatch_loader.so"),
            profile.joinToProfilePath("libgdpatch_loader.dylib"),
        ];

        try {
            for (const loaderPath of loaderPaths) {
                if (await fs.exists(loaderPath)) {
                    await fs.unlink(loaderPath);
                }
            }
        } catch (e) {
            const name = "Failed to delete GDPatch loader files from profile";
            const solution = "Is the game still running?";
            throw FileWriteError.fromThrownValue(e, name, solution);
        }
    }
}

async function findFolderContainingModToml(folder: string): Promise<string | undefined> {
    const fs = FsProvider.instance;

    if (await fs.exists(path.join(folder, "gdpatch_mod.toml"))) {
        return folder;
    }

    for (const entry of await fs.readdir(folder)) {
        const entryPath = path.join(folder, entry);
        if ((await fs.lstat(entryPath)).isFile()) {
            continue;
        }

        const modFolder = await findFolderContainingModToml(entryPath);
        if (modFolder) {
            return modFolder;
        }
    }

    return undefined;
}

export class GDPatchPluginInstaller implements PackageInstaller {
    private getModFolderInProfile(args: InstallArgs) {
        return args.profile.joinToProfilePath("GDPatch", "mods", args.mod.getName());
    }

    async install(args: InstallArgs) {
        const modFolderInCache = await findFolderContainingModToml(args.packagePath);
        if (modFolderInCache === undefined) {
            throw new FileNotFoundError(
                `Failed to find gdpatch_mod.toml in ${args.mod.getName()}`,
                "Either the mod package is malformed, or the files extracted to cache are corrupted"
            );
        }

        const modFolderInProfile = this.getModFolderInProfile(args);
        await FileUtils.ensureDirectory(modFolderInProfile);
        await FsProvider.instance.copyFolder(modFolderInCache, modFolderInProfile);
    }

    async uninstall(args: InstallArgs) {
        try {
            await FileUtils.recursiveRemoveDirectoryIfExists(this.getModFolderInProfile(args));
        } catch (e) {
            const name = `Failed to delete ${args.mod.getName()} from profile`;
            const solution = "Is the game still running?";
            throw FileWriteError.fromThrownValue(e, name, solution);
        }
    }

    async enable(args: InstallArgs) {
        try {
            await enableModByRenamingFiles(this.getModFolderInProfile(args));
        } catch (e) {
            const name = `Failed to enable ${args.mod.getName()}`;
            const solution = "Is the game still running?";
            throw FileWriteError.fromThrownValue(e, name, solution);
        }
    }

    async disable(args: InstallArgs) {
        try {
            await disableModByRenamingFiles(this.getModFolderInProfile(args));
        } catch (e) {
            const name = `Failed to disable ${args.mod.getName()}`;
            const solution = "Is the game still running?";
            throw FileWriteError.fromThrownValue(e, name, solution);
        }
    }
}
