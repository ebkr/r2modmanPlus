import { InstallArgs, PackageInstaller } from "./PackageInstaller";
import FsProvider from "../providers/generic/file/FsProvider";
import FileTree from "../model/file/FileTree";
import R2Error from "../model/errors/R2Error";
import fsextra from "fs-extra"
import path from "path";
import { addToStateFile } from "./InstallRuleInstaller";
import FileNotFoundError from "../model/errors/FileNotFoundError";

const basePackageFiles = ["manifest.json", "readme.md", "icon.png"];

export class NickelInstaller extends PackageInstaller {
    /**
     * This implementation installs the Nickel loader, a custom ML for Cobalt Core.
     * https://github.com/Shockah/Nickel
     */
    async install(args: InstallArgs) {
        const {
            mod,
            packagePath,
            profile,
        } = args;

        const fileRelocs = new Map<string, string>();

        const fs = FsProvider.instance;
        const profileDir = profile.getPathOfProfile();

        const srcNickel = path.join(packagePath, "Nickel");
        const destNickel = path.join(profileDir, "Nickel");
        await fs.copyFolder(srcNickel, destNickel);
        
        // Remove the `ModLibrary` subdirectory, moving it up in the dir structure.
        const srcMl = path.join(destNickel, "ModLibrary");
        const destMl = path.join(profileDir, "ModLibrary");
        await fsextra.move(srcMl, destMl);

        await fs.mkdirs(path.join(profileDir, "ModSaves"));

        const relocTargets = ["Nickel", "ModLibrary"];
        for (const target of relocTargets) {
            const abs = path.join(profileDir, target);
            fileRelocs.set(abs, target);
        }

        await addToStateFile(mod, fileRelocs, profile);
    }
}

export class NickelPluginInstaller extends PackageInstaller {
    /**
     * Install a Nickel plugin of format:
     * Author-PackageName.zip
     * - PackageName/
     * - - nickel.json
     * - - ...
     * - manifest.json
     * - README.md
     * - icon.png
     */
    async install(args: InstallArgs) {
        const {
            mod,
            packagePath,
            profile,
        } = args;

        const fs = FsProvider.instance;
        const fileRelocs = new Map<string, string>();
        const profileDir = profile.getPathOfProfile();

        const packageTree = await FileTree.buildFromLocation(packagePath);
        if (packageTree instanceof R2Error) {
            throw packageTree;
        }

        const nickelManifest = packageTree.getRecursiveFiles().find((x) => path.basename(x) == "nickel.json");
        if (nickelManifest == undefined) {
            const err = new R2Error(
                `nickel.json could not be found within the Nickel package ${mod}`,
                "Failed to find Nickel manifest `nickel.json`",
                null,
            );
            throw err;
        }
        const targetDir = path.dirname(nickelManifest);
        const targetTree = await FileTree.buildFromLocation(targetDir);
        if (targetTree instanceof R2Error) {
            throw targetTree;
        }

        const relDestPackageDir = path.join("ModLibrary", `${mod.getName()}`);
        const destPackageDir = path.join(profileDir, relDestPackageDir);
        if (!(await fs.exists(destPackageDir))) {
            await fs.mkdirs(destPackageDir);
        }

        for (const file of targetTree.getRecursiveFiles()) {
            const relDest = file.replace(targetDir, "");
            const dest = path.join(destPackageDir, relDest);

            const destDir = path.dirname(dest);
            if (!(await fs.exists(destDir))) {
                await fs.mkdirs(destDir);
            }

            await fs.copyFile(file, dest);
            fileRelocs.set(file, path.join(relDestPackageDir, relDest));
        }

        await addToStateFile(mod, fileRelocs, profile);
    }
}
