import { PackageInstaller } from "./PackageInstaller";
import ModLoaderPackageMapping from "../model/installing/ModLoaderPackageMapping";
import Profile from "../model/Profile";
import FsProvider from "../providers/generic/file/FsProvider";
import path from "path";

const basePackageFiles = ["manifest.json", "readme.md", "icon.png"];

export class MelonLoaderInstaller extends PackageInstaller {
    /**
     * Handles installation of MelonLoader
     */
    async install(mlLocation: string, modLoaderMapping: ModLoaderPackageMapping, profile: Profile) {
        for (const item of (await FsProvider.instance.readdir(mlLocation))) {
            if (!basePackageFiles.includes(item.toLowerCase())) {
                if ((await FsProvider.instance.stat(path.join(mlLocation, item))).isFile()) {
                    await FsProvider.instance.copyFile(path.join(mlLocation, item), path.join(profile.getPathOfProfile(), item));
                } else {
                    await FsProvider.instance.copyFolder(path.join(mlLocation, item), path.join(profile.getPathOfProfile(), item));
                }
            }
        }
    }
}
