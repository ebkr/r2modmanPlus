import { InstallArgs, PackageInstaller, uninstallModLoader } from "./PackageInstaller";
import path from "../providers/node/path/path";
import FsProvider from "../providers/generic/file/FsProvider";
import { getModLoaderMapping } from "../model/schema/ThunderstoreSchema";

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

        const mapping = getModLoaderMapping(mod.getName());
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

    async uninstall(args: InstallArgs) {
        await uninstallModLoader(args.mod, args.profile);
    }
}
