import path from "path";

import { InstallRuleInstaller } from "./InstallRuleInstaller";
import { InstallArgs, PackageInstaller } from "./PackageInstaller";
import { PackageLoader } from "../model/installing/PackageLoader";
import FsProvider from "../providers/generic/file/FsProvider";
import { MODLOADER_PACKAGES } from "../r2mm/installing/profile_installers/ModLoaderVariantRecord";

const basePackageFiles = ["manifest.json", "readme.md", "icon.png"];

export class ReturnOfModdingInstaller extends PackageInstaller {
    /**
     * Handles installation of ReturnOfModding mod loader
     */
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
}

export class ReturnOfModdingPluginInstaller extends PackageInstaller {
    readonly installer = new InstallRuleInstaller({
        gameName: "none" as any,  // This isn't acutally used for actual installation but needs some value
        rules: [
            {
                route: path.join("ReturnOfModding", "plugins"),
                isDefaultLocation: true,
                defaultFileExtensions: [],
                trackingMethod: "SUBDIR",
                subRoutes: [],
            },
            {
                route: path.join("ReturnOfModding", "plugins_data"),
                defaultFileExtensions: [],
                trackingMethod: "SUBDIR",
                subRoutes: [],
            },
            {
                route: path.join("ReturnOfModding", "config"),
                defaultFileExtensions: [],
                trackingMethod: "SUBDIR",
                subRoutes: [],
            }
        ]
    });

    /**
     * Handles installation of mods that use ReturnOfModding mod loader
     */
    async install(args: InstallArgs) {
        await this.installer.install(args);
    }
}
