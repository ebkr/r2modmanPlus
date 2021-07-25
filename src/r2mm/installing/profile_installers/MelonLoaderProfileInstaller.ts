import ProfileInstallerProvider from '../../../providers/ror2/installing/ProfileInstallerProvider';
import ManifestV2 from '../../../model/ManifestV2';
import FileTree from '../../../model/file/FileTree';
import R2Error from '../../../model/errors/R2Error';
import Profile from '../../../model/Profile';
import ModLoaderPackageMapping from '../../../model/installing/ModLoaderPackageMapping';
import path from 'path';
import PathResolver from '../../../r2mm/manager/PathResolver';
import GameManager from '../../../model/game/GameManager';
import { MOD_LOADER_VARIANTS } from '../../../r2mm/installing/profile_installers/ModLoaderVariantRecord';
import FileUtils from '../../../utils/FileUtils';
import FsProvider from '../../../providers/generic/file/FsProvider';
import yaml from "yaml";
import ModFileTracker from '../../../model/installing/ModFileTracker';

const INSTALLATION_RULES = {
    Mods: {_files: [".dll"]},
    Plugins: {_files: [".plugin.dll"]},
    MelonLoader: {
        Managed: {_files: [".managed.dll"]}
    },
    UserData: {
        CustomItems: {_files: [".melon"]},
        CustomMaps: {_files: [".bcm"]},
        PlayerModels: {_files: [".body"]},
        CustomLoadScreens: {_files: [".load"]},
        Music: {_files: [".wav"]},
        Food: {_files: [".food"]},
        Scoreworks: {_files: [".sw"]},
        CustomSkins: {_files: [".png"]}
    }
}

/**
 * TODO:
 * - Implementations
 * - Track files (where to store? [profile]/_state? somewhere else?)
 * - ConflictManagementProvider should be used on enable/disable/uninstall. Newly installed will have higher priority than already installed mods.
 */
export default class MelonLoaderProfileInstaller extends ProfileInstallerProvider {

    async applyModMode(mod: ManifestV2, tree: FileTree, location: string, mode: number): Promise<R2Error | void> {
        return Promise.resolve(undefined);
    }

    async disableMod(mod: ManifestV2, profile: Profile): Promise<R2Error | void> {
        return Promise.resolve(undefined);
    }

    async enableMod(mod: ManifestV2, profile: Profile): Promise<R2Error | void> {
        return Promise.resolve(undefined);
    }

    async getDescendantFiles(tree: FileTree | null, location: string): Promise<string[]> {
        return Promise.resolve([]);
    }

    async installForManifestV2(mod: ManifestV2, profile: Profile, location: string): Promise<R2Error | null> {
        const fileTree: FileTree | R2Error = await FileTree.buildFromLocation(location);
        if (fileTree instanceof R2Error) {
            return fileTree;
        }
        fileTree.removeFiles(
            path.join(location, "manifest.json"),
            path.join(location, "README.md"),
            path.join(location, "icon.png")
        );
        const result = await this.resolveBepInExTree(profile, location, path.basename(location), mod, fileTree);
        if (result instanceof R2Error) {
            return result;
        }
        // TODO: Install files.
        return null;
    }

    async installMod(mod: ManifestV2, profile: Profile): Promise<R2Error | null> {
        const cacheDirectory = path.join(PathResolver.MOD_ROOT, 'cache');
        const cachedLocationOfMod: string = path.join(cacheDirectory, mod.getName(), mod.getVersionNumber().toString());

        const activeGame = GameManager.activeGame;
        const bepInExVariant = MOD_LOADER_VARIANTS[activeGame.internalFolderName];
        const variant = bepInExVariant.find(value => value.packageName.toLowerCase() === mod.getName().toLowerCase());
        if (variant !== undefined) {
            return this.installModLoader(cachedLocationOfMod, variant, profile);
        }
        return this.installForManifestV2(mod, profile, cachedLocationOfMod);
    }

    async installModLoader(bieLocation: string, bepInExVariant: ModLoaderPackageMapping, profile: Profile): Promise<R2Error | null> {
        return Promise.resolve(null);
    }

    async resolveBepInExTree(profile: Profile, location: string, folderName: string, mod: ManifestV2, tree: FileTree): Promise<R2Error | void> {
        const fileRelocations: Map<string, string> = new Map();
        for (const directory of tree.getDirectories()) {
            let dirMatched = false;
            const matchingDir = Object.keys(INSTALLATION_RULES).find(value => value.toLowerCase() === directory.getDirectoryName().toLowerCase());
            if (matchingDir !== undefined) {
                dirMatched = true;
                directory.getRecursiveFiles().forEach(file => {
                    fileRelocations.set(file, path.relative(location, file));
                })
            } else {
                Object.keys(INSTALLATION_RULES)
                    .flatMap(topLevel => {
                        // Need to keep track of parent key for fileRelocationResult path.
                        return {
                            topLevel: topLevel,
                            values: Object.keys((INSTALLATION_RULES as any)[topLevel])
                        }
                    })
                    .forEach(entry => {
                        entry.values.forEach(subLevel => {
                            if (subLevel.toLowerCase() !== "_files") {
                                if (directory.getDirectoryName().toLowerCase() === subLevel.toLowerCase()) {
                                    dirMatched = true;
                                    directory.getRecursiveFiles().forEach(file => {
                                        fileRelocations.set(file, path.join(entry.topLevel, path.relative(location, file)));
                                    })
                                }
                            }
                        })
                    });
            }
            if (!dirMatched) {
                const resolveResult = await this.resolveBepInExTree(profile, path.join(location, directory.getDirectoryName()), directory.getDirectoryName(), mod, directory)
                if (resolveResult instanceof R2Error) {
                    return resolveResult;
                }
            }
        }

        const filePaths = this.calculateFilePaths(INSTALLATION_RULES);

        // Sort in descending order.
        // This way ".dll" will be matched after ".plugin.dll" to ensure .plugin.dll takes priority.
        const sortedFilePaths = Object.keys(filePaths).sort((a, b) => {
            return b.length - a.length;
        });

        tree.getFiles().forEach(value => {
            const firstMatchingEnd = sortedFilePaths.find(fp => value.toLowerCase().endsWith(fp.toLowerCase()));
            if (firstMatchingEnd !== undefined) {
                // Is registered extension.
                fileRelocations.set(value, path.join(filePaths[firstMatchingEnd], path.basename(value)));
            } else {
                fileRelocations.set(value, path.join("Mods", path.basename(value)));
            }
        })

        this.addToStateFile(mod, fileRelocations)
        console.log(fileRelocations);

        return;
    }

    private calculateFilePaths(obj: any): {[ext: string]: string} {
        const rebuild: any = {};
        for (const key of Object.keys(obj)) {
            if (key.toLowerCase() === "_files") {
                (obj[key] as string[]).forEach(value => {
                    // Leave blank because parent call will populate the correct directory.
                    rebuild[value] = "";
                })
            } else {
                const recursive = this.calculateFilePaths(obj[key]);
                for (const rKey of Object.keys(recursive)) {
                    rebuild[rKey] = path.join(key, recursive[rKey]);
                }
            }
        }
        return rebuild;
    }

    private async addToStateFile(mod: ManifestV2, files: Map<string, string>) {
        await FileUtils.ensureDirectory(path.join(PathResolver.MOD_ROOT, "_state"));
        let existing: Map<string, string> = new Map();
        if (await FsProvider.instance.exists(path.join(PathResolver.MOD_ROOT, "_state", `${mod.getName()}-state.yml`))) {
            const read = await FsProvider.instance.readFile(path.join(PathResolver.MOD_ROOT, "_state", `${mod.getName()}-state.yml`));
            existing = (yaml.parse(read.toString()) as ModFileTracker).files;
        }
        files.forEach((value, key) => {
            existing.set(key, value);
        })
        const mft = new ModFileTracker(mod.getName(), existing);
        await FsProvider.instance.writeFile(path.join(PathResolver.MOD_ROOT, "_state", `${mod.getName()}-state.yml`), yaml.stringify(mft));
    }

    async uninstallMod(mod: ManifestV2, profile: Profile): Promise<R2Error | null> {
        if (await FsProvider.instance.exists(path.join(PathResolver.MOD_ROOT, "_state", `${mod.getName()}-state.yml`))) {
            await FsProvider.instance.unlink(path.join(PathResolver.MOD_ROOT, "_state", `${mod.getName()}-state.yml`));
        }
        return Promise.resolve(null);
    }

}
