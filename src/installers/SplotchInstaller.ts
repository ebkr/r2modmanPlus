import FileTree from "../model/file/FileTree";
import FsProvider from "../providers/generic/file/FsProvider";
import R2Error from "../model/errors/R2Error";
import path from "path";
import { InstallRuleInstaller, addToStateFile } from "./InstallRuleInstaller";
import { InstallArgs, PackageInstaller } from "./PackageInstaller";
import { ProfileLinker } from "./ProfileLinker";
import Profile from "../model/Profile";
import Game from "../model/game/Game";

export class SplotchInstaller extends PackageInstaller {
    /**
     * This implementation installs Splotch, a modloader for Bopl Battle.
     * https://github.com/commandblox/Splotch
     */
    async install(args: InstallArgs) {
        const {
            mod,
            packagePath,
            profile,
        } = args;

        const fileRelocs = new Map<string, string>();
        const fs = FsProvider.instance;
        const profilePath = profile.getPathOfProfile();

        const targets = [
            "Splotch",
            "winhttp.dll",
            "doorstop_config.ini",
        ];

        for (const target of targets) {
            let src = path.join(packagePath, target);
            let srcStat = await fs.lstat(src);
            let dest = path.join(profilePath, target);

            if (srcStat.isFile()) {
                fs.copyFile(src, dest);
                fileRelocs.set(src, target);
                continue;
            }

            fs.copyFolder(src, dest);

            let srcTree = await FileTree.buildFromLocation(src);
            if (srcTree instanceof R2Error) {
                throw srcTree;
            }

            // Add the dirs files to the state.
            let srcFiles = srcTree.getRecursiveFiles();
            for (const src of srcFiles) {
                let relDest = src.replace(packagePath, "");
                fileRelocs.set(src, relDest);
            }
        }

        await fs.mkdirs(path.join(profilePath, "splotch_mods"));
        await fs.mkdirs(path.join(profilePath, "splotch_config"));

        await addToStateFile(mod, fileRelocs, profile);
    }
}

export class SplotchPluginInstaller extends PackageInstaller {
    readonly installer = new InstallRuleInstaller({
        gameName: "none" as any,
        rules: [
            {
                route: "splotch_mods",
                isDefaultLocation: true,
                defaultFileExtensions: [],
                trackingMethod: "PACKAGE_ZIP",
                subRoutes: [],
            },
        ]
    });

    async install(args: InstallArgs) { 
        await this.installer.install(args);
    }
}

export class SplotchLinker extends ProfileLinker {
    async perform(profile: Profile, game: Game, gameDir: string): Promise<string[]> { 
        const fs = FsProvider.instance;
        const profilePath = profile.getPathOfProfile();
        const linkedPaths = [];
        const linkTargets = [
            "winhttp.dll",
            "doorstop_config.ini",
        ]

        for (const linkTarget of linkTargets) {
            const absSrc = path.join(profilePath, linkTarget);
            const absDest = path.join(gameDir, linkTarget);
            const srcStat = await fs.lstat(absSrc);

            if (srcStat instanceof R2Error) {
                throw srcStat;
            }

            if (await fs.exists(absDest)) {
                await fs.unlink(absDest);
            }

            fs.copyFile(absSrc, absDest);
            linkedPaths.push(absDest);
        }

        return linkedPaths;
    }
}

