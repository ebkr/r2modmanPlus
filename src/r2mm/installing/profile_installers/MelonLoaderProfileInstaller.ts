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
import ConflictManagementProvider from '../../../providers/generic/installing/ConflictManagementProvider';
import ModMode from '../../../model/enums/ModMode';
import { RuleType } from '../../../r2mm/installing/InstallationRules';

/**
 * TODO:
 * - Implementations
 * - Track files (where to store? [profile]/_state? somewhere else?)
 * - ConflictManagementProvider should be used on enable/disable/uninstall. Newly installed will have higher priority than already installed mods.
 */
export default class MelonLoaderProfileInstaller extends ProfileInstallerProvider {

    private rule: RuleType;

    constructor(rule: RuleType) {
        super(rule);
        this.rule = rule;
    }

    async applyModMode(mod: ManifestV2, tree: FileTree, profile: Profile, location: string, mode: number): Promise<R2Error | void> {
        try {
            const modStateFilePath = path.join(location, "_state", `${mod.getName()}-state.yml`);
            if (await FsProvider.instance.exists(modStateFilePath)) {
                const fileContents = (await FsProvider.instance.readFile(modStateFilePath)).toString();
                const tracker: ModFileTracker = yaml.parse(fileContents);
                for (const [key, value] of tracker.files) {
                    if (await ConflictManagementProvider.instance.isFileActive(mod, profile, value)) {
                        if (mode === ModMode.DISABLED) {
                            if (await FsProvider.instance.exists(path.join(location, value))) {
                                await FsProvider.instance.unlink(path.join(location, value));
                            }
                        } else {
                            if (await FsProvider.instance.exists(path.join(location, value))) {
                                await FsProvider.instance.unlink(path.join(location, value));
                                await FsProvider.instance.copyFile(key, path.join(location, value));
                            }
                        }
                    }
                }
            }
        } catch (e) {
            if (e instanceof R2Error) {
                return e;
            } else {
                const err: Error = e;
                return new R2Error(`Error installing mod: ${mod.getName()}`, err.message, null);
            }
        }
    }

    async disableMod(mod: ManifestV2, profile: Profile): Promise<R2Error | void> {
        return this.applyModMode(mod, new FileTree(), profile, profile.getPathOfProfile(), ModMode.DISABLED);
    }

    async enableMod(mod: ManifestV2, profile: Profile): Promise<R2Error | void> {
        return this.applyModMode(mod, new FileTree(), profile, profile.getPathOfProfile(), ModMode.ENABLED);
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

        await ConflictManagementProvider.instance.overrideInstalledState(mod, profile);

        try {
            const modStateFilePath = path.join(profile.getPathOfProfile(), "_state", `${mod.getName()}-state.yml`);
            if (await FsProvider.instance.exists(modStateFilePath)) {
                const fileContents = (await FsProvider.instance.readFile(modStateFilePath)).toString();
                const tracker: ModFileTracker = yaml.parse(fileContents);
                for (const [key, value] of tracker.files) {
                    await FileUtils.ensureDirectory(path.dirname(path.join(profile.getPathOfProfile(), value)));
                    if (await FsProvider.instance.exists(path.join(profile.getPathOfProfile(), value))) {
                        await FsProvider.instance.unlink(path.join(profile.getPathOfProfile(), value));
                    }
                    await FsProvider.instance.copyFile(key, path.join(profile.getPathOfProfile(), value))
                }
            }
        } catch (e) {
            if (e instanceof R2Error) {
                return e;
            }
            const err: Error = e;
            return new R2Error(`Error installing mod: ${mod.getName()}`, err.message, null);
        }

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

    async installModLoader(cacheLocation: string, bepInExVariant: ModLoaderPackageMapping, profile: Profile): Promise<R2Error | null> {
        const tree = await FileTree.buildFromLocation(cacheLocation);
        if (tree instanceof R2Error) {
            return tree;
        }
        tree.removeFiles(
            path.join(cacheLocation, "manifest.json"),
            path.join(cacheLocation, "README.md"),
            path.join(cacheLocation, "icon.png")
        );
        for (const value of tree.getRecursiveFiles()) {
            const relativeFile = path.relative(cacheLocation, value);
            const dir = path.join(profile.getPathOfProfile(), path.dirname(relativeFile));
            await FileUtils.ensureDirectory(dir);
            if (await FsProvider.instance.exists(path.join(profile.getPathOfProfile(), relativeFile))) {
                await FsProvider.instance.unlink(path.join(profile.getPathOfProfile(), relativeFile));
            }
            try {
                await FsProvider.instance.copyFile(value, path.join(profile.getPathOfProfile(), relativeFile));
            } catch (e) {
                if (e instanceof R2Error) {
                    return e;
                } else {
                    const err: Error = e;
                    return new R2Error("Failed to copy file", err.message, null);
                }
            }
        }
        return Promise.resolve(null);
    }

    async resolveBepInExTree(profile: Profile, location: string, folderName: string, mod: ManifestV2, tree: FileTree): Promise<R2Error | void> {
        const fileRelocations: Map<string, string> = new Map();
        for (const directory of tree.getDirectories()) {
            let dirMatched = false;
            const matchingDir = Object.keys(this.rule.rules).find(value => value.toLowerCase() === directory.getDirectoryName().toLowerCase());
            if (matchingDir !== undefined) {
                dirMatched = true;
                directory.getRecursiveFiles().forEach(file => {
                    fileRelocations.set(file, path.relative(location, file));
                })
            } else {
                Object.keys(this.rule.rules)
                    .flatMap(topLevel => {
                        // Need to keep track of parent key for fileRelocationResult path.
                        return {
                            topLevel: topLevel,
                            values: Object.keys((this.rule.rules as any)[topLevel])
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

        const filePaths = this.calculateFilePaths(this.rule.rules);

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
                fileRelocations.set(value, path.join(this.rule._defaultPath, path.basename(value)));
            }
        })

        try {
            await this.addToStateFile(mod, fileRelocations, profile)
        } catch (e) {
            if (e instanceof R2Error) {
                return e;
            } else {
                const err: Error = e;
                return new R2Error(`Failed to add mod [${mod.getName()}] to state file`, err.message, null);
            }
        }

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

    public async addToStateFile(mod: ManifestV2, files: Map<string, string>, profile: Profile) {
        await FileUtils.ensureDirectory(path.join(profile.getPathOfProfile(), "_state"));
        let existing: Map<string, string> = new Map();
        if (await FsProvider.instance.exists(path.join(profile.getPathOfProfile(), "_state", `${mod.getName()}-state.yml`))) {
            const read = await FsProvider.instance.readFile(path.join(profile.getPathOfProfile(), "_state", `${mod.getName()}-state.yml`));
            const tracker = (yaml.parse(read.toString()) as ModFileTracker);
            existing = new Map(tracker.files);
        }
        files.forEach((value, key) => {
            existing.set(key, value);
        })
        const mft: ModFileTracker = {
            modName: mod.getName(),
            files: Array.from(existing.entries())
        }
        await FsProvider.instance.writeFile(path.join(profile.getPathOfProfile(), "_state", `${mod.getName()}-state.yml`), yaml.stringify(mft));
    }

    async uninstallMod(mod: ManifestV2, profile: Profile): Promise<R2Error | null> {
        const stateFilePath = path.join(profile.getPathOfProfile(), "_state", `${mod.getName()}-state.yml`);
        if (await FsProvider.instance.exists(stateFilePath)) {
            const read = await FsProvider.instance.readFile(stateFilePath);
            const tracker = (yaml.parse(read.toString()) as ModFileTracker);
            for (const [cacheFile, installFile] of tracker.files) {
                if (await FsProvider.instance.exists(path.join(profile.getPathOfProfile(), installFile))) {
                    await FsProvider.instance.unlink(path.join(profile.getPathOfProfile(), installFile));
                }
            }
            // TODO: Read state file to know which mods to remove
            await FsProvider.instance.unlink(path.join(profile.getPathOfProfile(), "_state", `${mod.getName()}-state.yml`));
        }
        // TODO: Apply ConflictManagementProvider to re-populate any loose files from a list of removed ones.
        return Promise.resolve(null);
    }

}
