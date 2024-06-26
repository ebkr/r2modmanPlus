import { InstallArgs, InstallerCapability, PackageInstaller } from "./PackageInstaller";
import path from "path";
import FsProvider from "../providers/generic/file/FsProvider";

export class GodotMLInstaller extends PackageInstaller {
    async capability(): Promise<InstallerCapability> {
        return {
            install: true,
            uninstall: false,
            enable: false,
            disable: false,
        }
    }

    /**
     * Handles installation of GodotML
     */
    async install(args: InstallArgs) {
        const { packagePath, profile } = args;

        const copyFrom = path.join(packagePath, "addons", "mod_loader");
        const copyTo = path.join(profile.getPathOfProfile(), "addons", "mod_loader");
        const fs = FsProvider.instance;

        if (await fs.exists(copyFrom)) {
            if (!await fs.exists(copyTo)) {
                await fs.mkdirs(copyTo);
            }
            await fs.copyFolder(copyFrom, copyTo);
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
