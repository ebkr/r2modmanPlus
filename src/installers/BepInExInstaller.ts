import { InstallArgs, PackageInstaller } from "./PackageInstaller";
import path from "path";
import FsProvider from "../providers/generic/file/FsProvider";
import { MODLOADER_PACKAGES } from "../r2mm/installing/profile_installers/ModLoaderVariantRecord";
import { PackageLoader } from "../model/schema/ThunderstoreSchema";

const basePackageFiles = ["manifest.json", "readme.md", "icon.png"];

export class BepInExInstaller implements PackageInstaller {
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
            entry.packageName.toLowerCase() == mod.getName().toLowerCase()
        );
        const mappingRoot = mapping ? mapping.rootFolder : "";

        let bepInExRoot: string;
        if (mappingRoot.trim().length > 0) {
            bepInExRoot = path.join(packagePath, mappingRoot);
        } else {
            bepInExRoot = path.join(packagePath);
        }
        for (const item of (await FsProvider.instance.readdir(bepInExRoot))) {
            if (!basePackageFiles.includes(item.toLowerCase())) {
                if ((await FsProvider.instance.stat(path.join(bepInExRoot, item))).isFile()) {
                    await FsProvider.instance.copyFile(path.join(bepInExRoot, item), profile.joinToProfilePath(item));
                } else {
                    await FsProvider.instance.copyFolder(path.join(bepInExRoot, item), profile.joinToProfilePath(item));
                }
            }
        }
    }
}
