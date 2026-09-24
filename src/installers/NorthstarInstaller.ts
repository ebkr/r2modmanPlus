import { InstallArgs, PackageInstaller, uninstallModLoader } from './PackageInstaller';
import path from "../providers/node/path/path";
import FsProvider from '../providers/generic/file/FsProvider';
import { getModLoaderMapping } from '../model/schema/ThunderstoreSchema';

const basePackageFiles = ["manifest.json", "readme.md", "icon.png"];

export class NorthstarInstaller implements PackageInstaller {
    /**
     * Handles installation of Northstar
     */
    async install(args: InstallArgs) {
        const {
            mod,
            packagePath,
            profile,
        } = args;

        const mapping = getModLoaderMapping(mod.getName());
        const mappingRoot = mapping ? mapping.rootFolder : "";

        let northstarRoot: string;
        if (mappingRoot.trim().length > 0) {
            northstarRoot = path.join(packagePath, mappingRoot);
        } else {
            northstarRoot = path.join(packagePath);
        }
        for (const item of (await FsProvider.instance.readdir(northstarRoot))) {
            if (!basePackageFiles.includes(item.toLowerCase())) {
                if ((await FsProvider.instance.stat(path.join(northstarRoot, item))).isFile()) {
                    await FsProvider.instance.copyFile(path.join(northstarRoot, item), profile.joinToProfilePath(item));
                } else {
                    await FsProvider.instance.copyFolder(path.join(northstarRoot, item), profile.joinToProfilePath(item));
                }
            }
        }
    }

    async uninstall(args: InstallArgs) {
        await uninstallModLoader(args.mod, args.profile);
    }
}
