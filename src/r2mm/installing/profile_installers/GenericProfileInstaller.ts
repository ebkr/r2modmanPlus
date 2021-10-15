import ProfileInstallerProvider from 'src/providers/ror2/installing/ProfileInstallerProvider';
import ManifestV2 from 'src/model/ManifestV2';
import Profile from 'src/model/Profile';
import FileTree from 'src/model/file/FileTree';
import R2Error from 'src/model/errors/R2Error';
import ModLoaderPackageMapping from 'src/model/installing/ModLoaderPackageMapping';
import path from 'path';
import FsProvider from 'src/providers/generic/file/FsProvider';
import ModFileTracker from 'src/model/installing/ModFileTracker';
import yaml from 'yaml';
import ConflictManagementProvider from 'src/providers/generic/installing/ConflictManagementProvider';
import ModMode from 'src/model/enums/ModMode';
import InstallationRules, { CoreRuleType, ManagedRule, RuleSubtype } from 'src/r2mm/installing/InstallationRules';
import PathResolver from 'src/r2mm/manager/PathResolver';
import GameManager from 'src/model/game/GameManager';
import { MOD_LOADER_VARIANTS } from 'src/r2mm/installing/profile_installers/ModLoaderVariantRecord';
import FileWriteError from 'src/model/errors/FileWriteError';
import FileUtils from 'src/utils/FileUtils';

export default class GenericProfileInstaller extends ProfileInstallerProvider {

    private rule: CoreRuleType;

    constructor() {
        super();
        this.rule = InstallationRules.RULES.find(value => value.gameName === GameManager.activeGame.internalFolderName)!;
    }

    private async applyModModeForSubdir(mod: ManifestV2, tree: FileTree, profile: Profile, location: string, mode: number): Promise<R2Error | void> {
        const subDirPaths = InstallationRules.getAllManagedPaths(this.rule.rules)
            .filter(value => value.trackingMethod === "SUBDIR");
        for (const dir of subDirPaths) {
            const dirContents = await FsProvider.instance.readdir(path.join(profile.getPathOfProfile(), dir.route));
            for (const namespacedDir of dirContents) {
                if (namespacedDir === mod.getName()) {
                    const tree = await FileTree.buildFromLocation(path.join(profile.getPathOfProfile(), dir.route, namespacedDir));
                    if (tree instanceof R2Error) {
                        return tree;
                    }
                    for (const value of tree.getRecursiveFiles()) {
                        if (mode === ModMode.DISABLED) {
                            await FsProvider.instance.rename(value, `${value}.old`);
                        } else {
                            if (value.toLowerCase().endsWith(".old")) {
                                await FsProvider.instance.rename(value, value.substring(0, value.length - ('.old').length));
                            }
                        }
                    }
                }
            }
        }
    }

    private async applyModModeForState(mod: ManifestV2, tree: FileTree, profile: Profile, location: string, mode: number): Promise<R2Error | void> {
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

    async applyModMode(mod: ManifestV2, tree: FileTree, profile: Profile, location: string, mode: number): Promise<R2Error | void> {
        const appliedState = await this.applyModModeForState(mod, tree, profile, location, mode);
        if (appliedState instanceof R2Error) {
            return appliedState;
        }
        const appliedSub = await this.applyModModeForSubdir(mod, tree, profile, location, mode);
        if (appliedSub instanceof R2Error) {
            return appliedSub;
        }
    }

    async disableMod(mod: ManifestV2, profile: Profile): Promise<R2Error | void> {
        return this.applyModMode(mod, new FileTree(), profile, "", ModMode.DISABLED);
    }

    async enableMod(mod: ManifestV2, profile: Profile): Promise<R2Error | void> {
        return this.applyModMode(mod, new FileTree(), profile, "", ModMode.ENABLED);
    }

    async getDescendantFiles(tree: FileTree | null, location: string): Promise<string[]> {
        const files: string[] = [];
        if (tree === null) {
            const newTree = await FileTree.buildFromLocation(location);
            if (newTree instanceof R2Error) {
                return files;
            }
            tree = newTree;
        }
        for (const directory of tree.getDirectories()) {
            files.push(...(await this.getDescendantFiles(directory, path.join(location, directory.getDirectoryName()))));
        }
        tree.getFiles().forEach((file: string) => {
            files.push(file);
        })
        return files;
    }

    async installForManifestV2(mod: ManifestV2, profile: Profile, location: string): Promise<R2Error | null> {
        const files: FileTree | R2Error = await FileTree.buildFromLocation(location);
        if (files instanceof R2Error) {
            return files;
        }
        const result = await this.resolveBepInExTree(profile, location, path.basename(location), mod, files);
        if (result instanceof R2Error) {
            return result;
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

    async installModLoader(bieLocation: string, modLoaderMapping: ModLoaderPackageMapping, profile: Profile): Promise<R2Error | null> {
        return Promise.resolve(null);
    }

    private async buildInstallForRuleSubtype(location: string, folderName: string, mod: ManifestV2, tree: FileTree): Promise<Map<RuleSubtype, string[]>> {
        const flatRules = InstallationRules.getAllManagedPaths(this.rule.rules);
        const installationIntent = new Map<RuleSubtype, string[]>();
        for (const file of tree.getFiles()) {
            // Find matching rule for file based on extension name.
            // If a matching extension name is longer (EG: .plugin.dll vs .dll) then assume the longer one is the correct match.
            let matchingRule: ManagedRule;
            try {
                matchingRule = flatRules.filter(value => value.extensions.find(ext => file.toLowerCase().endsWith(ext.toLowerCase())))
                    .reduce((previousValue, currentValue) => {
                        const extA = previousValue.extensions.find(ext => file.toLowerCase().endsWith(ext.toLowerCase()));
                        const extB = currentValue.extensions.find(ext => file.toLowerCase().endsWith(ext.toLowerCase()));
                        if (extA!.length > extB!.length) {
                            return previousValue;
                        }
                        return currentValue;
                    });
            } catch (e) {
                // No matching rule
                matchingRule = flatRules.find(value => value.isDefaultLocation)!;
            }
            const subType = InstallationRules.getRuleSubtypeFromManagedRule(matchingRule, this.rule);
            const updatedArray = installationIntent.get(subType) || [];
            updatedArray.push(file);
            installationIntent.set(subType, updatedArray);
        }
        for (const file of tree.getDirectories()) {
            // Only expect one (for now).
            // If multiple then will need to implement a way to reverse search folder path.
            let matchingRule: ManagedRule | undefined = flatRules.find(value => path.basename(value.route).toLowerCase() === file.getDirectoryName());
            if (matchingRule === undefined) {
                const nested = await this.buildInstallForRuleSubtype(path.join(location, file.getDirectoryName()), folderName, mod, file);
                for (let [rule, files] of nested.entries()) {
                    const arr = installationIntent.get(rule) || [];
                    arr.push(...files);
                    installationIntent.set(rule, arr);
                }
            } else {
                const subType = InstallationRules.getRuleSubtypeFromManagedRule(matchingRule, this.rule);
                const arr = installationIntent.get(subType) || [];
                arr.push(file.getTarget());
                installationIntent.set(subType, arr);
            }
        }
        return installationIntent;
    }

    private async installSubDir(profile: Profile, rule: RuleSubtype, installSources: string[], mod: ManifestV2) {
        const subDir = path.join(profile.getPathOfProfile(), rule.route, mod.getName());
        await FileUtils.ensureDirectory(subDir);
        for (const source of installSources) {
            if ((await FsProvider.instance.lstat(source)).isFile()) {
                await FsProvider.instance.copyFile(source, path.join(subDir, path.basename(source)));
            } else {
                for (const content of (await FsProvider.instance.readdir(source))) {
                    if ((await FsProvider.instance.lstat(path.join(source, content))).isFile()) {
                        await FsProvider.instance.copyFile(path.join(source, content), path.join(subDir, content));
                    } else {
                        await FsProvider.instance.copyFolder(path.join(source, content), path.join(subDir, content));
                    }
                }
            }
        }
    }

    /**
     * TODO: Remember to call addToStateFile.
     * @param profile
     * @param installSources installSources can contain both file and directory. Need to work out how to install directories.
     * Probably don't track directories themselves but files within - Delete folder if no files on uninstall?
     * @private
     */
    private async installState(profile: Profile, rule: RuleSubtype, installSources: string[], mod: ManifestV2) {

    }

    // Functionally identical to the install method of subdir, minus the subdirectory.
    private async installUntracked(profile: Profile, rule: RuleSubtype, installSources: string[], mod: ManifestV2) {
        const ruleDir = path.join(profile.getPathOfProfile(), rule.route);
        await FileUtils.ensureDirectory(ruleDir);
        for (const source of installSources) {
            if ((await FsProvider.instance.lstat(source)).isFile()) {
                await FsProvider.instance.copyFile(source, path.join(ruleDir, path.basename(source)));
            } else {
                for (const content of (await FsProvider.instance.readdir(source))) {
                    if ((await FsProvider.instance.lstat(path.join(source, content))).isFile()) {
                        await FsProvider.instance.copyFile(path.join(source, content), path.join(ruleDir, content));
                    } else {
                        await FsProvider.instance.copyFolder(path.join(source, content), path.join(ruleDir, content));
                    }
                }
            }
        }
    }

    async resolveBepInExTree(profile: Profile, location: string, folderName: string, mod: ManifestV2, tree: FileTree): Promise<R2Error | void> {
        const installationIntent = await this.buildInstallForRuleSubtype(location, folderName, mod, tree);
        for (let [rule, files] of installationIntent.entries()) {
            switch (rule.trackingMethod) {
                case 'STATE': await this.installState(profile, rule, files, mod); break;
                case 'SUBDIR': await this.installSubDir(profile, rule, files, mod); break;
                case 'NONE': await this.installUntracked(profile, rule, files, mod); break;
            }
        }
        return Promise.resolve(undefined);
    }

    private async uninstallSubDir(mod: ManifestV2, profile: Profile): Promise<R2Error | null> {
        const activeGame = GameManager.activeGame;
        const fs = FsProvider.instance;
        const bepInExVariant = MOD_LOADER_VARIANTS[activeGame.internalFolderName];
        if (bepInExVariant.find(value => value.packageName.toLowerCase() === mod.getName().toLowerCase())) {
            try {
                for (const file of (await fs.readdir(profile.getPathOfProfile()))) {
                    const filePath = path.join(profile.getPathOfProfile(), file);
                    if ((await fs.lstat(filePath)).isFile()) {
                        if (file.toLowerCase() !== 'mods.yml') {
                            await fs.unlink(filePath);
                        }
                    }
                }
            } catch(e) {
                const err: Error = e;
                return new FileWriteError(
                    'Failed to delete BepInEx file from profile root',
                    err.message,
                    'Is the game still running?'
                );
            }
        }
        const bepInExLocation: string = path.join(profile.getPathOfProfile(), 'BepInEx');
        if (await fs.exists(bepInExLocation)) {
            try {
                for (const file of (await fs.readdir(bepInExLocation))) {
                    if ((await fs.lstat(path.join(bepInExLocation, file))).isDirectory()) {
                        for (const folder of (await fs.readdir(path.join(bepInExLocation, file)))) {
                            const folderPath: string = path.join(bepInExLocation, file, folder);
                            if (folder === mod.getName() && (await fs.lstat(folderPath)).isDirectory()) {
                                await FileUtils.emptyDirectory(folderPath);
                                await fs.rmdir(folderPath);
                            }
                        }
                    }
                }
            } catch (e) {
                const err: Error = e;
                return new R2Error(
                    "Failed to remove files",
                    err.message,
                    'Is the game still running? If so, close it and try again.'
                );
            }
        }
        return Promise.resolve(null);
    }

    private async uninstallState(mod: ManifestV2, profile: Profile): Promise<R2Error | null> {
        const stateFilePath = path.join(profile.getPathOfProfile(), "_state", `${mod.getName()}-state.yml`);
        if (await FsProvider.instance.exists(stateFilePath)) {
            const read = await FsProvider.instance.readFile(stateFilePath);
            const tracker = (yaml.parse(read.toString()) as ModFileTracker);
            for (const [cacheFile, installFile] of tracker.files) {
                if (await FsProvider.instance.exists(path.join(profile.getPathOfProfile(), installFile))) {
                    await FsProvider.instance.unlink(path.join(profile.getPathOfProfile(), installFile));
                }
            }
            await FsProvider.instance.unlink(path.join(profile.getPathOfProfile(), "_state", `${mod.getName()}-state.yml`));
        }
        return Promise.resolve(null);
    }

    async uninstallMod(mod: ManifestV2, profile: Profile): Promise<R2Error | null> {
        const uninstallState = await this.uninstallState(mod, profile);
        if (uninstallState instanceof R2Error) {
            return uninstallState;
        }
        const uninstallSubDir = await this.uninstallSubDir(mod, profile);
        if (uninstallSubDir instanceof R2Error) {
            return uninstallSubDir;
        }
        return null;
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

}
