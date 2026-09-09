import { InstallArgs, PackageInstaller, uninstallModLoader } from "./PackageInstaller";
import { addToStateFile, applyModeState, uninstallState } from "./InstallRulePluginInstaller";
import FsProvider from "../providers/generic/file/FsProvider";
import FileUtils from "../utils/FileUtils";
import FileTree from "../model/file/FileTree";
import ModMode from "../model/enums/ModMode";
import R2Error from "../model/errors/R2Error";
import path from "../providers/node/path/path";

export class LovelyInstaller implements PackageInstaller {
    async install(args: InstallArgs) {
        const {
            mod,
            packagePath,
            profile,
        } = args;

        const fs = FsProvider.instance;
        const fileRelocations = new Map<string, string>();

        // 0.9.0 was version.dll, 0.10.0+ is winmm.dll.
        const dllTargets = ["version.dll", "winmm.dll"];

        for (const dllTarget of dllTargets) {
            const dwmSrc = path.join(packagePath, dllTarget);
            const dwmDest = profile.joinToProfilePath(dllTarget);

            if (!await fs.exists(dwmSrc)) {
                continue;
            }

            await fs.copyFile(dwmSrc, dwmDest);
            fileRelocations.set(dwmSrc, dllTarget);
        }

        // Files within the lovely subdirectory need to be recursively copied into the destination.
        const lovelyTree = await FileTree.buildFromLocation(path.join(packagePath, "lovely"));
        if (lovelyTree instanceof R2Error) {
            throw lovelyTree;
        }

        const targets = lovelyTree.getRecursiveFiles().map((x) => x.replace(packagePath, "")).map((x) => [x, path.join("mods", x)]);
        for (const target of targets) {
            const absSrc = path.join(packagePath, target[0]!);
            const absDest = profile.joinToProfilePath(target[1]!);

            await FileUtils.ensureDirectory(path.dirname(absDest));
            await fs.copyFile(absSrc, absDest);

            fileRelocations.set(absSrc, target[1]!);
        }

        await addToStateFile(mod, fileRelocations, profile);
    }

    async uninstall(args: InstallArgs) {
        await uninstallModLoader(args.mod, args.profile);
    }
}

export class LovelyPluginInstaller implements PackageInstaller {
    async install(args: InstallArgs) {
        const {
            mod,
            packagePath,
            profile,
        } = args;

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
            const destFile = profile.joinToProfilePath(installDir, relFile);

            await FileUtils.ensureDirectory(path.dirname(destFile));
            await fs.copyFile(srcFile, destFile);

            fileRelocations.set(srcFile, path.join(installDir, relFile));
        }

        await addToStateFile(mod, fileRelocations, profile);
    }

    async isDisabled(args: InstallArgs, lazy = true) {
        const lovelyignore = await this.checkModLovelyIgnored(args);
        if (lazy && lovelyignore) return { lovelyignore };
        const blacklist = await this.checkModBlacklisted(args);
        if (lovelyignore || blacklist) return { lovelyignore, blacklist };
        return false
    }

    async checkModLovelyIgnored(args: InstallArgs) {
        const {
            mod,
            profile,
        } = args;
        const lovelyignore = profile.joinToProfilePath("mods", mod.getName(), ".lovelyignore");

        const fs = FsProvider.instance;
        if (await fs.exists(lovelyignore)) return lovelyignore;
    }

    async checkModBlacklisted(args: InstallArgs) {
        const {
            mod,
            profile,
        } = args;
        const blacklistPath = profile.joinToProfilePath("mods", "lovely", "blacklist.txt");

        const fs = FsProvider.instance;
        if (!await fs.exists(blacklistPath)) return;
        // NOTE: Using node:fs.lines() would likely be more efficent, but I didn't
        // want to bother implementing it for all the fs implementations
        const fileContent = (await fs.readFile(blacklistPath)).toString();
        for (const line of fileContent.split(/\r?\n/g)) {
            if (line === mod.getName()) {
                return blacklistPath;
            }
        }
    }

    async uninstall(args: InstallArgs) {
        await this.enable(args); // We don't want lingering disabled metadata to cause a mod to be disabled immediatly after install
        await uninstallState(args.mod, args.profile);
    }

    async enable(args: InstallArgs) {
        const {
            mod,
        } = args;
        const info = await this.isDisabled(args, false)
        if (!info) return console.warn("Told to enable a lovely mod (" + mod.getName() + "), but mod was not disabled?");
        const fs = FsProvider.instance;
        if (info.lovelyignore) {
            await fs.unlink(info.lovelyignore);
        }
        if (info.blacklist) {
            let fileContent = (await fs.readFile(info.blacklist)).toString();
            fileContent = fileContent.split(/\r?\n/g)
            .filter(l => l !== mod.getName())
            .join("\n")
            await fs.writeFile(info.blacklist, fileContent);
        }
    }

    async disable(args: InstallArgs) {
        // NOTE: I elected to use .lovelyignore simply because it's simpler to implement.
        // If we ever end up installing mods as zip files instead of extracting them
        // we will need to use the blacklist!
        const {
            mod,
            profile,
        } = args;
        const lovelyignore = profile.joinToProfilePath("mods", mod.getName(), ".lovelyignore");

        const fs = FsProvider.instance;
        await fs.writeFile(lovelyignore, "");
    }

    async isLoaderDisabled(args: InstallArgs) {
        return !!(await this.isDisabled(args));
    }
}
