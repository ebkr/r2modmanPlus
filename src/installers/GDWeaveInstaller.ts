import { InstallArgs, PackageInstaller } from "./PackageInstaller";
import path from "path";
import FsProvider from "../providers/generic/file/FsProvider";
import { addToStateFile } from "./InstallRuleInstaller";
import FileUtils from "../utils/FileUtils";

const basePackageFiles = ["manifest.json", "readme.md", "icon.png"];

// Adapted from the BepInEx & Lovely installers
export class GDWeaveInstaller implements PackageInstaller {
    async install(args: InstallArgs) {
        const fs = FsProvider.instance;
        const fileRelocations = new Map<string, string>();

        const winmmSrc = path.join(args.packagePath, "winmm.dll");
        const winmmDest = args.profile.joinToProfilePath("winmm.dll");
        await fs.copyFile(winmmSrc, winmmDest);
        fileRelocations.set(winmmSrc, "winmm.dll");

        for (const item of (await FsProvider.instance.readdir(args.packagePath))) {
            if (basePackageFiles.includes(item.toLowerCase())) continue;

            const srcPath = path.join(args.packagePath, item);
            const destPath = args.profile.joinToProfilePath(item);
            if ((await FsProvider.instance.stat(srcPath)).isFile()) {
                await FsProvider.instance.copyFile(srcPath, destPath);
            } else {
                await FsProvider.instance.copyFolder(srcPath, destPath);
            }
        }

        await addToStateFile(args.mod, fileRelocations, args.profile);
    }
}

async function searchForManifest(fs: FsProvider, dir: string): Promise<string | null> {
    if (await fs.exists(path.join(dir, "manifest.json"))) {
        return dir;
    }

    for (const item of await fs.readdir(dir)) {
        if ((await fs.stat(path.join(dir, item))).isDirectory()) {
            const result = await searchForManifest(fs, path.join(dir, item));
            if (result) return result;
        }
    }

    return null;
}

export class GDWeavePluginInstaller implements PackageInstaller {
    async install(args: InstallArgs) {
        const fs = FsProvider.instance;
        const installDir = path.join("GDWeave", "mods", args.mod.getName());
        const files = await FsProvider.instance.readdir(args.packagePath);

        // Packaging is all over the place. Find a folder with a manifest.json
        // not at the top level (because the top level is Thunderstore's packaging)
        let modFolder: string | null = null;
        for (const item of files) {
            if ((await fs.stat(path.join(args.packagePath, item))).isDirectory()) {
                const result = await searchForManifest(fs, path.join(args.packagePath, item));
                if (result) {
                    modFolder = result;
                    break;
                }
            }
        }

        if (!modFolder) {
            throw new Error("Could not find mod folder");
        } else {
            for (const file of await fs.readdir(modFolder)) {
                const srcPath = path.join(modFolder, file);
                const destPath = args.profile.joinToProfilePath(installDir, file);

                await FileUtils.ensureDirectory(path.dirname(destPath));
                await fs.copyFile(srcPath, destPath);
            }
        }
    }
}
