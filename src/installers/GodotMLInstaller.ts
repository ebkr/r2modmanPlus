import { InstallArgs, PackageInstaller } from "./PackageInstaller";
import path from "../providers/node/path/path";
import FsProvider from "../providers/generic/file/FsProvider";

export class GodotMLInstaller implements PackageInstaller {
    /**
     * Handles installation of GodotML
     */
    async install(args: InstallArgs) {
        const { packagePath, profile } = args;

        const copyFrom = path.join(packagePath, "addons", "mod_loader");
        const copyTo = profile.joinToProfilePath("addons", "mod_loader");
        const fs = FsProvider.instance;

        if (await fs.exists(copyFrom)) {
            if (!await fs.exists(copyTo)) {
                await fs.mkdirs(copyTo);
            }
            await fs.copyFolder(copyFrom, copyTo);
        }
    }
}
