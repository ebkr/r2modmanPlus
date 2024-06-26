import { InstallArgs, InstallerCapability, PackageInstaller } from "./PackageInstaller";
import path from "path";
import FsProvider from "../providers/generic/file/FsProvider";
import FileTree from "../model/file/FileTree";
import FileUtils from "../utils/FileUtils";
import R2Error from "../model/errors/R2Error";
import { InstallRuleInstaller } from "./InstallRuleInstaller";

export class ShimloaderInstaller extends PackageInstaller {
    async capability(): Promise<InstallerCapability> {
        return {
            install: true,
            uninstall: false,
            enable: false,
            disable: false,
        }
    }

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
            const absDest = path.join(profile.getPathOfProfile(), targetPath[1]);

            await FileUtils.ensureDirectory(path.dirname(absDest));
            await fs.copyFile(absSrc, absDest);

            fileRelocations.set(absSrc, targetPath[1]);
        }

        // The config subdir needs to be created for shimloader (it will get cranky if it's not there).
        const configDir = path.join(profile.getPathOfProfile(), "shimloader", "cfg");
        if (!await fs.exists(configDir)) {
            await fs.mkdirs(configDir);
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

export class ShimloaderPluginInstaller extends PackageInstaller {
    async capability(): Promise<InstallerCapability> {
        return {
            install: true,
            uninstall: false,
            enable: false,
            disable: false,
        }
    }

    readonly installer = new InstallRuleInstaller({
        gameName: "none" as any,  // This isn't acutally used for actual installation but needs some value
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
        await this.installer.install(args);
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
