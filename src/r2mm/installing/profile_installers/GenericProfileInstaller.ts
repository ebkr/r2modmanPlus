import ProfileInstallerProvider from '../../../providers/ror2/installing/ProfileInstallerProvider';
import ManifestV2 from '../../../model/ManifestV2';
import Profile from '../../../model/Profile';
import FileTree from '../../../model/file/FileTree';
import R2Error from '../../../model/errors/R2Error';
import ModLoaderPackageMapping from '../../../model/installing/ModLoaderPackageMapping';
import path from 'path';
import FsProvider from '../../../providers/generic/file/FsProvider';
import ModFileTracker from '../../../model/installing/ModFileTracker';
import yaml from 'yaml';
import ConflictManagementProvider from '../../../providers/generic/installing/ConflictManagementProvider';
import ModMode from '../../../model/enums/ModMode';
import InstallationRules, { CoreRuleType } from '../../installing/InstallationRules';
import PathResolver from '../../../r2mm/manager/PathResolver';
import GameManager from '../../../model/game/GameManager';
import { MOD_LOADER_VARIANTS } from '../../installing/profile_installers/ModLoaderVariantRecord';
import FileWriteError from '../../../model/errors/FileWriteError';
import FileUtils from '../../../utils/FileUtils';
import { GetInstallerIdForLoader, GetInstallerIdForPlugin } from '../../../model/installing/PackageLoader';
import { PackageInstallers } from "../../../installers/registry";
import { InstallArgs } from "../../../installers/PackageInstaller";
import { InstallRuleInstaller } from "../../../installers/InstallRuleInstaller";
import { ShimloaderPluginInstaller } from "../../../installers/ShimloaderInstaller";


export default class GenericProfileInstaller extends ProfileInstallerProvider {

    private readonly rule: CoreRuleType | undefined;
    private readonly legacyInstaller: InstallRuleInstaller;

    constructor() {
        super();
        this.rule = InstallationRules.RULES.find(value => value.gameName === GameManager.activeGame.internalFolderName)!;
        this.legacyInstaller = new InstallRuleInstaller(this.rule);
    }

    private async applyModModeForSubdir(mod: ManifestV2, tree: FileTree, profile: Profile, location: string, mode: number): Promise<R2Error | void> {
        // TODO: Call through the installer interface. For now we hardcode the only known case because expanding the
        //       installer system is out of scope.
        //
        //       In other words, this entire functionality of enabling & disabling mods should exist as a callable on
        //       installers rather than here. Below is a dirty hack to fetch the install rules for the current only
        //       known case.
        let rule = this.rule;
        const installerId = GetInstallerIdForPlugin(GameManager.activeGame.packageLoader);
        if (installerId) {
            const installer = PackageInstallers[installerId];
            if (installer instanceof ShimloaderPluginInstaller) {
                rule = installer.installer.rule;
            }
        }
        if (!rule) {
            return;
        }

        const subDirPaths = InstallationRules.getAllManagedPaths(rule.rules)
            .filter(value => value.trackingMethod === "SUBDIR");

        for (const dir of subDirPaths) {
            if (await FsProvider.instance.exists(path.join(profile.getPathOfProfile(), dir.route))) {
                const dirContents = await FsProvider.instance.readdir(path.join(profile.getPathOfProfile(), dir.route));
                for (const namespacedDir of dirContents) {
                    if (namespacedDir === mod.getName()) {
                        const tree = await FileTree.buildFromLocation(path.join(profile.getPathOfProfile(), dir.route, namespacedDir));
                        if (tree instanceof R2Error) {
                            return tree;
                        }
                        for (const value of tree.getRecursiveFiles()) {
                            if (mode === ModMode.DISABLED && mod.isEnabled() && !value.toLowerCase().endsWith(".old")) {
                                await FsProvider.instance.rename(value, `${value}.old`);
                            } else if (mode === ModMode.ENABLED && !mod.isEnabled() && value.toLowerCase().endsWith(".old")) {
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
                        if (await FsProvider.instance.exists(path.join(location, value))) {
                            await FsProvider.instance.unlink(path.join(location, value));
                        }
                        if (mode === ModMode.ENABLED) {
                            await FsProvider.instance.copyFile(key, path.join(location, value));
                        }
                    }
                }
            }
        } catch (e) {
            return R2Error.fromThrownValue(e, `Error installing mod: ${mod.getName()}`);
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
        return this.applyModMode(mod, new FileTree(), profile, profile.getPathOfProfile(), ModMode.DISABLED);
    }

    async enableMod(mod: ManifestV2, profile: Profile): Promise<R2Error | void> {
        return this.applyModMode(mod, new FileTree(), profile, profile.getPathOfProfile(), ModMode.ENABLED);
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

    async installForManifestV2(args: InstallArgs): Promise<R2Error | null> {
        try {
            await this.legacyInstaller.install(args);
            return null;
        } catch (e) {
            return R2Error.fromThrownValue(e);
        }
    }

    async installMod(mod: ManifestV2, profile: Profile): Promise<R2Error | null> {
        const cacheDirectory = path.join(PathResolver.MOD_ROOT, 'cache');
        const cachedLocationOfMod: string = path.join(cacheDirectory, mod.getName(), mod.getVersionNumber().toString());

        const activeGame = GameManager.activeGame;
        const bepInExVariant = MOD_LOADER_VARIANTS[activeGame.internalFolderName];
        const variant = bepInExVariant.find(value => value.packageName.toLowerCase() === mod.getName().toLowerCase());

        const args: InstallArgs = {
            mod: mod,
            profile: profile,
            packagePath: cachedLocationOfMod,
        }

        if (variant !== undefined) {
            return this.installModLoader(variant, args);
        }

        const pluginInstaller = GetInstallerIdForPlugin(activeGame.packageLoader);

        if (pluginInstaller !== null) {
            await PackageInstallers[pluginInstaller].install(args);
            return Promise.resolve(null);
        }

        // Revert to legacy install behavior.
        return this.installForManifestV2(args);
    }

    async installModLoader(mapping: ModLoaderPackageMapping, args: InstallArgs): Promise<R2Error | null> {
        const installerId = GetInstallerIdForLoader(mapping.loaderType);
        if (installerId) {
            await PackageInstallers[installerId].install(args);
            return Promise.resolve(null);
        } else {
            return new R2Error(
                "Installer not found",
                `Failed to find an appropriate installer for the package ${mapping.packageName}`
            );
        }
    }

    private async uninstallPackageZip(mod: ManifestV2, profile: Profile) {
        const fs = FsProvider.instance;

        const recursiveDelete = async (mainPath: string, match: string) => {
            for (const subpath of (await fs.readdir(mainPath))) {
                const fullSubpath = path.join(mainPath, subpath);
                const subpathInfo = await fs.lstat(fullSubpath);
                if (subpathInfo.isDirectory()) {
                    await recursiveDelete(fullSubpath, match);
                } else if (subpathInfo.isFile() && subpath == match) {
                    await fs.unlink(fullSubpath);
                }
            }
        }

        await recursiveDelete(profile.getPathOfProfile(), `${mod.getName()}.ts.zip`);
    }

    private async uninstallSubDir(mod: ManifestV2, profile: Profile): Promise<R2Error | null> {
        const activeGame = GameManager.activeGame;
        const fs = FsProvider.instance;
        const bepInExVariant = MOD_LOADER_VARIANTS[activeGame.internalFolderName];
        if (bepInExVariant.find(value => value.packageName.toLowerCase() === mod.getName().toLowerCase())) {
            let filePath = ""
            try {
                for (const file of (await fs.readdir(profile.getPathOfProfile()))) {
                    filePath = path.join(profile.getPathOfProfile(), file);
                    if ((await fs.lstat(filePath)).isFile()) {
                        if (file.toLowerCase() !== 'mods.yml') {
                            await fs.unlink(filePath);
                        }
                    }
                }
            } catch(e) {
                const name = `Failed to delete mod loader file (Path: ${filePath}) from profile root`;
                const solution = `The file may still be in use by the game or you may lack sufficient file privileges`;
                return FileWriteError.fromThrownValue(e, name, solution);
            }
        }

        // BepInEx & shimloader plugin uninstall logic
        // TODO: Move to work through the installer interface
        const profilePath = profile.getPathOfProfile();
        const searchLocations = ["BepInEx", "shimloader"];
        for (const searchLocation of searchLocations) {
            const bepInExLocation: string = path.join(profilePath, searchLocation);
            if (!(await fs.exists(bepInExLocation))) {
                continue
            }

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
                const name = 'Failed to remove files';
                const solution = 'Is the game still running? If so, close it and try again.';
                return R2Error.fromThrownValue(e, name, solution);
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
                    if ((await FsProvider.instance.readdir(path.dirname(path.join(profile.getPathOfProfile(), installFile)))).length === 0) {
                        await FsProvider.instance.rmdir(path.dirname(path.join(profile.getPathOfProfile(), installFile)));
                    }
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
        try {
            await this.uninstallPackageZip(mod, profile);
        } catch (e) {
            return R2Error.fromThrownValue(e, "Failed to remove files");
        }
        return null;
    }
}
