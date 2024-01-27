import { PackageInstaller } from "./PackageInstaller";
import ModLoaderPackageMapping from "../model/installing/ModLoaderPackageMapping";
import Profile from "../model/Profile";
import path from "path";
import FsProvider from "../providers/generic/file/FsProvider";

const basePackageFiles = ["manifest.json", "readme.md", "icon.png"];

export class BepInExInstaller extends PackageInstaller {
    /**
     * Handles installation of BepInEx
     */
    async install(bieLocation: string, modLoaderMapping: ModLoaderPackageMapping, profile: Profile) {
        let bepInExRoot: string;
        if (modLoaderMapping.rootFolder.trim().length > 0) {
            bepInExRoot = path.join(bieLocation, modLoaderMapping.rootFolder);
        } else {
            bepInExRoot = path.join(bieLocation);
        }
        for (const item of (await FsProvider.instance.readdir(bepInExRoot))) {
            if (!basePackageFiles.includes(item.toLowerCase())) {
                if ((await FsProvider.instance.stat(path.join(bepInExRoot, item))).isFile()) {
                    await FsProvider.instance.copyFile(path.join(bepInExRoot, item), path.join(profile.getPathOfProfile(), item));
                } else {
                    await FsProvider.instance.copyFolder(path.join(bepInExRoot, item), path.join(profile.getPathOfProfile(), item));
                }
            }
        }
    }
}
