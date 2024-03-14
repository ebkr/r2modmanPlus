import { InstallArgs, PackageInstaller } from "./PackageInstaller";
import { InstallRuleInstaller, addToStateFile } from "./InstallRuleInstaller";
import FsProvider from "../providers/generic/file/FsProvider";
import FileUtils from "../utils/FileUtils";
import FileTree from "../model/file/FileTree";
import R2Error from "../model/errors/R2Error";
import path from "path";

export class LovelyInstaller extends PackageInstaller {
    readonly installer = new InstallRuleInstaller({
        gameName: "Balatro",
        rules: [
            {
                route: path.join("shimloader", "mod"),
                isDefaultLocation: true,
                defaultFileExtensions: [],
                trackingMethod: "SUBDIR",
                subRoutes: [],
            },
            {
                route: path.join("shimloader", "pak"),
                defaultFileExtensions: [],
                trackingMethod: "SUBDIR",
                subRoutes: [],
            },
            {
                route: path.join("shimloader", "cfg"),
                defaultFileExtensions: [],
                trackingMethod: "NONE",
                subRoutes: [],
            }
        ]
    });

    async install(args: InstallArgs) {
        const {
            mod,
            packagePath,
            profile,
        } = args;

        const profilePath = profile.getPathOfProfile();
        const fs = FsProvider.instance;
        const fileRelocations = new Map<string, string>();

        const targets = [
            "dwmapi.dll",
            "mods/lovely/config.toml"
        ];

        for (const target of targets) {
            const absSrc = path.join(packagePath, target);
            const absDest = path.join(profilePath, target);

            await FileUtils.ensureDirectory(absDest);
            await fs.copyFile(absSrc, absDest);

            fileRelocations.set(absSrc, target);
        }

        await addToStateFile(mod, fileRelocations, profile);
    }
}

export class LovelyPluginInstaller extends PackageInstaller {
    readonly installer = new InstallRuleInstaller({
        gameName: "none" as any,  // This isn't acutally used for actual installation but needs some value
        rules: [
            {
                route: [],
                isDefaultLocation: true,
                defaultFileExtensions: [],
                trackingMethod: "SUBDIR",
                subRoutes: [],
            },
        ]
    });

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
            await FileUtils.ensureDirectory(path.basename(srcFile));
            await fs.copyFile(srcFile, path.join(profilePath, relFile));

            fileRelocations.set(srcFile, relFile);
        }
    }
}
