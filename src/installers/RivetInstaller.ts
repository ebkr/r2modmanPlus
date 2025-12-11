import path from "../providers/node/path/path";

import {
    disableModByRenamingFiles,
    enableModByRenamingFiles,
    InstallArgs,
    PackageInstaller,
} from "./PackageInstaller";

import FileWriteError from "../model/errors/FileWriteError";
import FsProvider from "../providers/generic/file/FsProvider";
import FileUtils from "../utils/FileUtils";

export class RivetInstaller implements PackageInstaller {
    private static readonly TRACKED = ["version.dll", "Rivet.ini", "Rivet"];

    async install(args: InstallArgs): Promise<void> {
        const { packagePath, profile } = args;

        try {
            for (const file of RivetInstaller.TRACKED) {
                const packDir = path.join(packagePath, "RivetPack")
                const cachePath = path.join(packDir, file);

                const profilePath = profile.joinToProfilePath(file);
                await FileUtils.copyFileOrFolder(cachePath, profilePath);
            }
        } catch (e) {
            throw FileWriteError.fromThrownValue(e, "Failed to install Rivet loader");
        }
    }

    async uninstall(args: InstallArgs): Promise<void> {
        const { packagePath, profile } = args;

        for (const file of RivetInstaller.TRACKED) {
            const profilePath = profile.joinToProfilePath(file);

            if (!(await FsProvider.instance.exists(profilePath))) {
                continue;
            }

            if (file === "Rivet") {
                // Remove everything apart from Mods
                const rivetContents = await FsProvider.instance.readdir(profilePath);
                for (const item of rivetContents) {
                    if (item.toLowerCase() === "mods") {
                        continue;
                    }

                    const itemPath = path.join(profilePath, item);
                    if ((await FsProvider.instance.stat(itemPath)).isDirectory()) {
                        await FileUtils.recursiveRemoveDirectoryIfExists(itemPath);
                    } else {
                        await FsProvider.instance.unlink(itemPath);
                    }
                }

                // Keep going to next tracked file
                continue;
            }

            if ((await FsProvider.instance.stat(profilePath)).isDirectory()) {
                await FileUtils.recursiveRemoveDirectoryIfExists(profilePath);
            } else {
                await FsProvider.instance.unlink(profilePath);
            }
        }
    }
}

export class RivetPluginInstaller implements PackageInstaller {
    private getModsPath(args: InstallArgs): string {
        return args.profile.joinToProfilePath("Rivet", "Mods", args.mod.getName());
    }

    private throwActionError(e: unknown, action: string): void {
        const name = `Failed to ${action} Rivet mod`;
        const solution = "Is the game still running?";
        throw FileWriteError.fromThrownValue(e, name, solution);
    }

    async install(args: InstallArgs): Promise<void> {
        const files = await FsProvider.instance.readdir(args.packagePath);
        const modsPath = this.getModsPath(args);
        await FileUtils.ensureDirectory(modsPath);

        try {
            for (const item of files) {
                const sourceFull = path.join(args.packagePath, item);

                const targetPath = path.join(modsPath, item);
                await FileUtils.copyFileOrFolder(sourceFull, targetPath);
            }
        } catch (e) {
            this.throwActionError(e, "install");
        }
    }

    async uninstall(args: InstallArgs): Promise<void> {
        try {
            await FileUtils.recursiveRemoveDirectoryIfExists(this.getModsPath(args));
        } catch (e) {
            this.throwActionError(e, "uninstall");
        }
    }

    async disable(args: InstallArgs): Promise<void> {
        try {
            await disableModByRenamingFiles(this.getModsPath(args));
        } catch (e) {
            this.throwActionError(e, "disable");
        }
    }

    async enable(args: InstallArgs): Promise<void> {
        try {
            await enableModByRenamingFiles(this.getModsPath(args));
        } catch (e) {
            this.throwActionError(e, "enable");
        }
    }
}