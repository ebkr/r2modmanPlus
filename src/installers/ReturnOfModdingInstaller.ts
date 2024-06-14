import path from "path";

import { InstallRuleInstaller } from "./InstallRuleInstaller";
import { InstallArgs, PackageInstallerV2 } from "./PackageInstaller";
import FileWriteError from "../model/errors/FileWriteError";
import { PackageLoader } from "../model/installing/PackageLoader";
import FsProvider from "../providers/generic/file/FsProvider";
import { MODLOADER_PACKAGES } from "../r2mm/installing/profile_installers/ModLoaderVariantRecord";
import FileUtils from "../utils/FileUtils";

const basePackageFiles = ["manifest.json", "readme.md", "icon.png"];

/**
 * Handles (un)installation of ReturnOfModding mod loader
 */
export class ReturnOfModdingInstaller extends PackageInstallerV2 {
    async install(args: InstallArgs) {
        const {
            mod,
            packagePath,
            profile,
        } = args;

        const mapping = MODLOADER_PACKAGES.find((entry) =>
            entry.packageName.toLowerCase() == mod.getName().toLowerCase() &&
            entry.loaderType == PackageLoader.RETURN_OF_MODDING,
        );
        const mappingRoot = mapping ? mapping.rootFolder : "";

        let root: string;
        if (mappingRoot.trim().length > 0) {
            root = path.join(packagePath, mappingRoot);
        } else {
            root = path.join(packagePath);
        }
        for (const item of (await FsProvider.instance.readdir(root))) {
            if (!basePackageFiles.includes(item.toLowerCase())) {
                if ((await FsProvider.instance.stat(path.join(root, item))).isFile()) {
                    await FsProvider.instance.copyFile(path.join(root, item), path.join(profile.getPathOfProfile(), item));
                } else {
                    await FsProvider.instance.copyFolder(path.join(root, item), path.join(profile.getPathOfProfile(), item));
                }
            }
        }
    }

    async uninstall(args: InstallArgs): Promise<void> {
        const fs = FsProvider.instance;
        const {profile} = args;

        try {
            // Delete all files except mods.yml from profile root. Ignore directories.
            for (const file of (await fs.readdir(profile.getPathOfProfile()))) {
                const filePath = path.join(profile.getPathOfProfile(), file);
                if ((await fs.lstat(filePath)).isFile()) {
                    if (file.toLowerCase() !== 'mods.yml') {
                        await fs.unlink(filePath);
                    }
                }
            }
        } catch(e) {
            const name = "Failed to delete ReturnOfModding files from profile root";
            const solution = "Is the game still running?";
            throw FileWriteError.fromThrownValue(e, name, solution);
        }
    };
}

/**
 * Handles (un)installation of mods that use ReturnOfModding mod loader
 */
export class ReturnOfModdingPluginInstaller extends PackageInstallerV2 {
    _ROOT = "ReturnOfModding";
    _PLUGINS = "plugins";
    _DATA = "plugins_data";
    _CONFIG = "config"

    readonly installer = new InstallRuleInstaller({
        gameName: "none" as any,  // This isn't actually used for actual installation but needs some value
        rules: [
            {
                route: path.join(this._ROOT, this._PLUGINS),
                isDefaultLocation: true,
                defaultFileExtensions: [],
                trackingMethod: "SUBDIR_NO_FLATTEN",
                subRoutes: [],
            },
            {
                route: path.join(this._ROOT, this._DATA),
                defaultFileExtensions: [],
                trackingMethod: "SUBDIR_NO_FLATTEN",
                subRoutes: [],
            },
            {
                route: path.join(this._ROOT, this._CONFIG),
                defaultFileExtensions: [],
                trackingMethod: "SUBDIR_NO_FLATTEN",
                subRoutes: [],
            }
        ]
    });


    async install(args: InstallArgs) {
        await this.installer.install(args);
    }

    async uninstall(args: InstallArgs): Promise<void> {
        const {mod, profile} = args;

        try {
            // Persist config dir, remove the rest.
            await FileUtils.recursiveRemoveDirectoryIfExists(
                path.join(profile.getPathOfProfile(), this._ROOT, this._PLUGINS, mod.getName())
            );
            await FileUtils.recursiveRemoveDirectoryIfExists(
                path.join(profile.getPathOfProfile(), this._ROOT, this._DATA, mod.getName())
            );
        } catch(e) {
            const name = `Failed to delete ${mod.getName()} files from profile`;
            const solution = "Is the game still running?";
            throw FileWriteError.fromThrownValue(e, name, solution);
        }
    };
}
