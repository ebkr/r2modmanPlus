import { InstallArgs, InstallerCapability, PackageInstaller } from "./PackageInstaller";
import path from "path";
import FsProvider from "../providers/generic/file/FsProvider";
import { MODLOADER_PACKAGES } from "../r2mm/installing/profile_installers/ModLoaderVariantRecord";
import { PackageLoader } from "../model/installing/PackageLoader";

const basePackageFiles = ["manifest.json", "readme.md", "icon.png"];

export class ReturnOfModdingInstaller extends PackageInstaller {
    async capability(): Promise<InstallerCapability> {
        return {
            install: true,
            uninstall: false,
            enable: false,
            disable: false,
        }
    }

    /**
     * Handles installation of BepInEx
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

    async uninstall(args: InstallArgs): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async enable(args: InstallArgs): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async disable(args: InstallArgs): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
