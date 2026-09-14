import {
    disableModByRenamingFiles,
    enableModByRenamingFiles,
    InstallArgs,
    PackageInstaller,
} from "./PackageInstaller";
import FileWriteError from "../model/errors/FileWriteError";
import R2Error from "../model/errors/R2Error";
import FsProvider from "../providers/generic/file/FsProvider";
import path from "../providers/node/path/path";
import { MODLOADER_PACKAGES } from "../r2mm/installing/profile_installers/ModLoaderVariantRecord";
import FileUtils from "../utils/FileUtils";

export class MioInstaller implements PackageInstaller {
    async install(args: InstallArgs) {
        const {
            mod,
            packagePath,
            profile,
        } = args;

        const fs = FsProvider.instance;

        const mapping = MODLOADER_PACKAGES.find(
            (entry) => entry.packageName.toLowerCase() === mod.getName().toLowerCase()
        );
        const mioRoot = path.join(packagePath, mapping ? mapping.rootFolder : "");

        const proxyDllSrc = path.join(mioRoot, "winhttp.dll");
        const proxyDllDest = profile.joinToProfilePath("winhttp.dll");
        await fs.copyFile(proxyDllSrc, proxyDllDest);

        const loaderFolderSrc = path.join(mioRoot, "mio-mod-loader");
        const loaderFolderDest = profile.joinToProfilePath("mio-mod-loader");
        await fs.copyFolder(loaderFolderSrc, loaderFolderDest);
    }

    async uninstall(args: InstallArgs) {
        const { profile } = args;
        const fs = FsProvider.instance;

        try {
            const proxyDllPath = profile.joinToProfilePath("winhttp.dll");
            if (await fs.exists(proxyDllPath)) {
                await fs.unlink(proxyDllPath);
            }

            const loaderFolderPath = profile.joinToProfilePath("mio-mod-loader");
            await FileUtils.recursiveRemoveDirectoryIfExists(loaderFolderPath);
        } catch (e) {
            const name = "Failed to delete MIO mod loader files from profile";
            const solution = "Is the game still running?";
            throw FileWriteError.fromThrownValue(e, name, solution);
        }
    }
}

async function findFolderContainingModJson(folder: string): Promise<string | undefined> {
    const fs = FsProvider.instance;

    if (await fs.exists(path.join(folder, "mod.json"))) {
        return folder;
    }

    for (const entry of await fs.readdir(folder)) {
        const entryPath = path.join(folder, entry);
        if (!(await fs.lstat(entryPath)).isDirectory()) {
            continue;
        }

        const modFolder = await findFolderContainingModJson(entryPath);
        if (modFolder) {
            return modFolder;
        }
    }

    return undefined;
}

export class MioPluginInstaller implements PackageInstaller {
    private getModFolderInProfile(args: InstallArgs) {
        return args.profile.joinToProfilePath("mods", args.mod.getName());
    }

    async install(args: InstallArgs) {
        const modFolderInCache = await findFolderContainingModJson(args.packagePath);
        if (modFolderInCache === undefined) {
            throw new R2Error(
                `Failed to find mod.json in ${args.mod.getName()}`,
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
