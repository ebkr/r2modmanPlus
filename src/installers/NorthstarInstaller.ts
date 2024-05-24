import { InstallArgs, PackageInstaller } from './PackageInstaller';
import path from 'path';
import FsProvider from '../providers/generic/file/FsProvider';
import { MODLOADER_PACKAGES } from '../r2mm/installing/profile_installers/ModLoaderVariantRecord';
import { PackageLoader } from '../model/installing/PackageLoader';

const basePackageFiles = ["manifest.json", "readme.md", "icon.png"];

export class NorthstarInstaller extends PackageInstaller {
    /**
     * Handles installation of Northstar
     */
    async install(args: InstallArgs) {
        const {
            mod,
            packagePath,
            profile,
        } = args;

        const mapping = MODLOADER_PACKAGES.find((entry) =>
            entry.packageName.toLowerCase() == mod.getName().toLowerCase() &&
            entry.loaderType == PackageLoader.NORTHSTAR,
        );
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
                    await FsProvider.instance.copyFile(path.join(northstarRoot, item), path.join(profile.getPathOfProfile(), item));
                } else {
                    await FsProvider.instance.copyFolder(path.join(northstarRoot, item), path.join(profile.getPathOfProfile(), item));
                }
            }
        }
    }
}
