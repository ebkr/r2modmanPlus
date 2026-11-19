import FileWriteError from "../model/errors/FileWriteError";
import R2Error from "../model/errors/R2Error";
import FileTree from "../model/file/FileTree";
import { ImmutableProfile } from "../model/Profile";
import ManifestV2 from "../model/ManifestV2";
import { isModLoaderPackage } from "../model/schema/ThunderstoreSchema";
import FsProvider from "../providers/generic/file/FsProvider";
import path from "../providers/node/path/path";
import PathResolver from "../r2mm/manager/PathResolver";

export type InstallArgs = {
    mod: ManifestV2;
    profile: ImmutableProfile;
    packagePath: string;
};

export interface PackageInstaller {
    install(args: InstallArgs): Promise<void>;
    uninstall(args: InstallArgs): Promise<void>;

    // Plugin installers only.
    enable?(args: InstallArgs): Promise<void>;
    disable?(args: InstallArgs): Promise<void>;
}

export async function disableModByRenamingFiles(folderName: string) {
    const tree = await FileTree.buildFromLocation(folderName);
    if (tree instanceof R2Error) {
        throw tree;
    }

    for (const filePath of tree.getRecursiveFiles()) {
        if (!filePath.toLowerCase().endsWith(".old")) {
            await FsProvider.instance.rename(filePath, `${filePath}.old`);
        }
    }
}

export async function enableModByRenamingFiles(folderName: string) {
    const tree = await FileTree.buildFromLocation(folderName);
    if (tree instanceof R2Error) {
        throw tree;
    }

    for (const filePath of tree.getRecursiveFiles()) {
        if (filePath.toLowerCase().endsWith(".old")) {
            await FsProvider.instance.rename(
                filePath,
                filePath.substring(0, filePath.length - (".old").length)
            );
        }
    }
}

export function getInstallArgs(mod: ManifestV2, profile: ImmutableProfile): InstallArgs {
    const cacheDirectory = path.join(PathResolver.MOD_ROOT, "cache");
    const packagePath = path.join(cacheDirectory, mod.getName(), mod.getVersionNumber().toString());
    return {mod, profile, packagePath};
}

// Implementation shared by BepInExInstaller, MelonLoaderInstaller and others.
export async function uninstallModLoader(mod: ManifestV2, profile: ImmutableProfile) {
    const fs = FsProvider.instance;

    try {
        if (isModLoaderPackage(mod.getName())) {
            for (const file of (await fs.readdir(profile.getProfilePath()))) {
                if (file.toLowerCase() === "mods.yml") {
                    continue;
                }
                const filePath = profile.joinToProfilePath(file);
                if ((await fs.lstat(filePath)).isFile()) {
                    await fs.unlink(filePath);
                }
            }
        }
    } catch(e) {
        const name = "Failed to delete mod loader files from profile root";
        const solution = "Is the game still running?";
        throw FileWriteError.fromThrownValue(e, name, solution);
    }
}
