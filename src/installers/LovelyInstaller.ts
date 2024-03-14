import { InstallArgs, PackageInstaller } from "./PackageInstaller";
import { InstallRuleInstaller, addToStateFile } from "./InstallRuleInstaller";
import FsProvider from "../providers/generic/file/FsProvider";
import FileUtils from "../utils/FileUtils";
import FileTree from "../model/file/FileTree";
import R2Error from "../model/errors/R2Error";
import path from "path";

export class LovelyInstaller extends PackageInstaller {
    async install(args: InstallArgs) {
        const {
            mod,
            packagePath,
            profile,
        } = args;

        const profilePath = profile.getPathOfProfile();
        const fs = FsProvider.instance;
        const fileRelocations = new Map<string, string>();

        // Assuming this is the lovely-injector package.
        const targets = [
            ["dwmapi.dll", "dwmapi.dll"],
            ["lovely/config.toml", "mods/lovely/config.toml"]
        ];

        for (const target of targets) {
            const absSrc = path.join(packagePath, target[0]);
            const absDest = path.join(profilePath, target[1]);

            await FileUtils.ensureDirectory(path.dirname(absDest));
            await fs.copyFile(absSrc, absDest);

            fileRelocations.set(absSrc, target[1]);
        }

        await addToStateFile(mod, fileRelocations, profile);
    }
}

export class LovelyPluginInstaller extends PackageInstaller {
    async install(args: InstallArgs) {
        const {
            mod,
            packagePath,
            profile,
        } = args;

        const profilePath = profile.getPathOfProfile();
        const installDir = path.join("mods", mod.getName());

        const fs = FsProvider.instance;
        const fileRelocations = new Map<string, string>();

        const srcTree = await FileTree.buildFromLocation(packagePath);
        if (srcTree instanceof R2Error) {
            throw R2Error;
        }
 
        const srcFiles = srcTree.getRecursiveFiles();
        for (const srcFile of srcFiles) {
            const relFile = srcFile.replace(packagePath, "");
            const destFile = path.join(profilePath, installDir, relFile);

            console.log(`destFile: ${destFile}`);

            await FileUtils.ensureDirectory(path.dirname(destFile));
            await fs.copyFile(srcFile, destFile);

            fileRelocations.set(srcFile, path.join(installDir, relFile));
        }

        await addToStateFile(mod, fileRelocations, profile);
    }
}
