import { InstallArgs, PackageInstaller } from "./PackageInstaller";
import { addToStateFile, applyModeState, uninstallState } from "./InstallRulePluginInstaller";
import FileWriteError from "../model/errors/FileWriteError";
import FsProvider from "../providers/generic/file/FsProvider";
import FileUtils from "../utils/FileUtils";
import FileTree from "../model/file/FileTree";
import ModMode from "../model/enums/ModMode";
import R2Error from "../model/errors/R2Error";
import path from "../providers/node/path/path";

export class LovelyInstaller implements PackageInstaller {
    // 0.9.0 was version.dll, 0.10.0+ is winmm.dll.
    private static readonly DLL_TARGETS = ["version.dll", "winmm.dll"];

    async install(args: InstallArgs) {
        const {
            mod,
            packagePath,
            profile,
        } = args;

        const fs = FsProvider.instance;
        const fileRelocations = new Map<string, string>();

        for (const dllTarget of LovelyInstaller.DLL_TARGETS) {
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
        const { mod, profile } = args;
        const fs = FsProvider.instance;

        try {
            await uninstallState(mod, profile);

            // Delete the lovely binary even if the state file is missing.
            for (const dllTarget of LovelyInstaller.DLL_TARGETS) {
                const dllPath = profile.joinToProfilePath(dllTarget);
                if (await fs.exists(dllPath)) {
                    await fs.unlink(dllPath);
                }
            }
        } catch (e) {
            const name = "Failed to delete lovely files from profile";
            const solution = "Is the game still running?";
            throw FileWriteError.fromThrownValue(e, name, solution);
        }
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

    async uninstall(args: InstallArgs) {
        await uninstallState(args.mod, args.profile);
    }

    async enable(args: InstallArgs) {
        await applyModeState(args.mod, args.profile, ModMode.ENABLED);
    }

    async disable(args: InstallArgs) {
        await applyModeState(args.mod, args.profile, ModMode.DISABLED);
    }
}
