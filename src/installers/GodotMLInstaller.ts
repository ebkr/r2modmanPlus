import { PackageInstaller } from "./PackageInstaller";
import ModLoaderPackageMapping from "../model/installing/ModLoaderPackageMapping";
import Profile from "../model/Profile";
import path from "path";
import FsProvider from "../providers/generic/file/FsProvider";

export class GodotMLInstaller extends PackageInstaller {
    /**
     * Handles installation of GodotML
     */
    async install(mlLocation: string, modLoaderMapping: ModLoaderPackageMapping, profile: Profile) {
        const copyFrom = path.join(mlLocation, "addons", "mod_loader");
        const copyTo = path.join(profile.getPathOfProfile(), "addons", "mod_loader");
        const fs = FsProvider.instance;

        if (await fs.exists(copyFrom)) {
            if (!await fs.exists(copyTo)) {
                await fs.mkdirs(copyTo);
            }
            await fs.copyFolder(copyFrom, copyTo);
        }
    }
}
