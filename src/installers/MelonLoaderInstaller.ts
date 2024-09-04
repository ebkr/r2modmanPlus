import { InstallArgs, PackageInstaller } from "./PackageInstaller";
import FsProvider from "../providers/generic/file/FsProvider";
import path from "path";

const basePackageFiles = ["manifest.json", "readme.md", "icon.png"];

export class MelonLoaderInstaller implements PackageInstaller {
    /**
     * Handles installation of MelonLoader
     */
    async install(args: InstallArgs) {
        const { packagePath, profile } = args;

        for (const item of (await FsProvider.instance.readdir(packagePath))) {
            if (!basePackageFiles.includes(item.toLowerCase())) {
                if ((await FsProvider.instance.stat(path.join(packagePath, item))).isFile()) {
                    await FsProvider.instance.copyFile(path.join(packagePath, item), path.join(profile.getPathOfProfile(), item));
                } else {
                    await FsProvider.instance.copyFolder(path.join(packagePath, item), path.join(profile.getPathOfProfile(), item));
                }
            }
        }
    }
}
