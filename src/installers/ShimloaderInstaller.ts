import { InstallArgs, PackageInstaller } from "./PackageInstaller";
import path from "../providers/node/path/path";
import FsProvider from "../providers/generic/file/FsProvider";
import FileTree from "../model/file/FileTree";
import FileUtils from "../utils/FileUtils";
import R2Error from "../model/errors/R2Error";

export class ShimloaderInstaller implements PackageInstaller {
    /**
     * Handle installation of unreal-shimloader
     */
    async install(args: InstallArgs) {
        const {
            mod,
            packagePath,
            profile,
        } = args;

        const fs = FsProvider.instance;
        const fileRelocations = new Map<string, string>();

        const targets = [
            ["dwmapi.dll", "dwmapi.dll"],
            ["UE4SS/ue4ss.dll", "ue4ss.dll"],
            ["UE4SS/UE4SS-settings.ini", "UE4SS-settings.ini"],
        ];

        const ue4ssTree = await FileTree.buildFromLocation(path.join(packagePath, "UE4SS/Mods"));
        if (ue4ssTree instanceof R2Error) {
            throw ue4ssTree;
        }

        for (const subFile of ue4ssTree.getRecursiveFiles()) {
            const relSrc = path.relative(path.join(packagePath, "UE4SS/Mods"), subFile);

            targets.push([path.join("UE4SS/Mods", relSrc), path.join("shimloader/mod", relSrc)]);
        }

        for (const targetPath of targets) {
            const absSrc = path.join(packagePath, targetPath[0]);
            const absDest = profile.joinToProfilePath(targetPath[1]);

            await FileUtils.ensureDirectory(path.dirname(absDest));
            await fs.copyFile(absSrc, absDest);

            fileRelocations.set(absSrc, targetPath[1]);
        }

        // The config subdir needs to be created for shimloader (it will get cranky if it's not there).
        const configDir = profile.joinToProfilePath("shimloader", "cfg");
        if (!await fs.exists(configDir)) {
            await fs.mkdirs(configDir);
        }
    }
}
