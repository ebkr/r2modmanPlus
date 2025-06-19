import path from "path";

import { InstallRuleInstaller } from "./InstallRuleInstaller";
import { InstallArgs, PackageInstaller } from "./PackageInstaller";
import FileWriteError from "../model/errors/FileWriteError";
import { PackageLoader } from "../model/schema/ThunderstoreSchema";
import FsProvider from "../providers/generic/file/FsProvider";
import { MODLOADER_PACKAGES } from "../r2mm/installing/profile_installers/ModLoaderVariantRecord";
import FileUtils from "../utils/FileUtils";
import { TrackingMethod } from "../model/schema/ThunderstoreSchema";

const basePackageFiles = ["manifest.json", "readme.md", "icon.png"];

/**
 * Handles (un)installation of ReturnOfModding mod loader
 */
export class ReturnOfModdingInstaller implements PackageInstaller {
    async install(args: InstallArgs) {
        const {mod, packagePath, profile} = args;

        const mapping = MODLOADER_PACKAGES.find((entry) =>
            entry.packageName.toLowerCase() == mod.getName().toLowerCase() &&
            entry.loaderType == PackageLoader.RETURN_OF_MODDING,
        );

        if (mapping === undefined) {
            throw new Error(`ReturnOfModdingInstaller found no loader for ${mod.getName()}`);
        }

        const root = path.join(packagePath, mapping.rootFolder);
        const allContents = await FsProvider.instance.readdir(root);
        const toCopy = allContents.filter((x) => !basePackageFiles.includes(x));

        for (const fileOrFolder of toCopy) {
            await FileUtils.copyFileOrFolder(
                path.join(root, fileOrFolder),
                profile.joinToProfilePath(fileOrFolder)
            );
        }
    }

    async uninstall(args: InstallArgs): Promise<void> {
        const fs = FsProvider.instance;
        const {profile} = args;

        try {
            // Delete all files except mods.yml from profile root. Ignore directories.
            for (const file of (await fs.readdir(profile.getProfilePath()))) {
                if (file.toLowerCase() === 'mods.yml') {
                    continue;
                }
                const filePath = profile.joinToProfilePath(file);
                if ((await fs.lstat(filePath)).isFile()) {
                    await fs.unlink(filePath);
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
export class ReturnOfModdingPluginInstaller implements PackageInstaller {
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
                trackingMethod: TrackingMethod.SUBDIR_NO_FLATTEN,
                subRoutes: [],
            },
            {
                route: path.join(this._ROOT, this._DATA),
                defaultFileExtensions: [],
                trackingMethod: TrackingMethod.SUBDIR_NO_FLATTEN,
                subRoutes: [],
            },
            {
                route: path.join(this._ROOT, this._CONFIG),
                defaultFileExtensions: [],
                trackingMethod: TrackingMethod.SUBDIR_NO_FLATTEN,
                subRoutes: [],
            }
        ],
        relativeFileExclusions: null
    });


    async install(args: InstallArgs) {
        await this.installer.install(args);
    }

    async uninstall(args: InstallArgs): Promise<void> {
        const fs = FsProvider.instance;
        const {mod, profile} = args;

        // Remove the plugin dir.
        // Remove the data dir, but keep the cache subdir if it exists.
        // Leave the config dir alone.
        try {
            const pluginPath = profile.joinToProfilePath(this._ROOT, this._PLUGINS, mod.getName())
            const dataPath = profile.joinToProfilePath(this._ROOT, this._DATA, mod.getName());

            await FileUtils.recursiveRemoveDirectoryIfExists(pluginPath);

            if (await fs.exists(dataPath)) {
                let hasCache = false;

                for (const file of (await fs.readdir(dataPath))) {
                    const filePath = path.join(dataPath, file);

                    if ((await fs.lstat(filePath)).isDirectory()) {
                        if (file.toLowerCase() === "cache") {
                            hasCache = true;
                        } else {
                            await FileUtils.recursiveRemoveDirectoryIfExists(filePath);
                        }
                    } else {
                        await fs.unlink(filePath);
                    }
                }

                if (!hasCache) {
                    await FileUtils.recursiveRemoveDirectoryIfExists(dataPath);
                }
            }
        } catch(e) {
            const name = `Failed to delete ${mod.getName()} files from profile`;
            const solution = "Is the game still running?";
            throw FileWriteError.fromThrownValue(e, name, solution);
        }
    };
}
