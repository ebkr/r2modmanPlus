import { InstallArgs, PackageInstaller } from "./PackageInstaller";
import { ImmutableProfile } from "../model/Profile";
import FsProvider from "../providers/generic/file/FsProvider";
import path from "../providers/node/path/path";
import ManifestV2 from "../model/ManifestV2";
import R2Error, { throwForR2Error } from "../model/errors/R2Error";
import FileTree from "../model/file/FileTree";
import FileUtils from "../utils/FileUtils";
import yaml from "yaml";
import ModFileTracker from "../model/installing/ModFileTracker";
import ConflictManagementProvider from "../providers/generic/installing/ConflictManagementProvider";
import PathResolver from "../r2mm/manager/PathResolver";
import ZipProvider from "../providers/generic/zip/ZipProvider";
import { getGameConfigBySettingsIdentifier, TrackingMethod } from "../model/schema/ThunderstoreSchema";
import ModMode from "../model/enums/ModMode";
import GameManager from "../model/game/GameManager";

type CoreRuleType = {
    gameName: string,
    rules: RuleSubtype[],
    relativeFileExclusions: string[] | null,
}

type RuleSubtype = {
    route: string,
    trackingMethod: TrackingMethod,
    subRoutes: RuleSubtype[],
    defaultFileExtensions: string[],
    isDefaultLocation?: boolean
}

type ManagedRule = {
    route: string,
    ref: RuleSubtype,
    trackingMethod: TrackingMethod,
    extensions: string[],
    isDefaultLocation: boolean
}

type InstallRuleArgs = {
    profile: ImmutableProfile,
    coreRule: CoreRuleType,
    rule: ManagedRule,
    installSources: string[],
    mod: ManifestV2,
};

/**
 * Produce a flattened structure of all navigable paths maintained by the install rules.
 */
export function getAllManagedPaths(rules: RuleSubtype[], pathBuilder?: string): ManagedRule[] {
    const paths: ManagedRule[] = [];
    rules.forEach(value => {
        const route = !pathBuilder ? value.route : path.join(pathBuilder, value.route);
        paths.push({
            route: route,
            trackingMethod: value.trackingMethod,
            extensions: value.defaultFileExtensions,
            isDefaultLocation: value.isDefaultLocation || false,
            ref: value
        });
        getAllManagedPaths(value.subRoutes, route).forEach(x => paths.push(x));
    });
    return paths;
}

function getRuleSubtypeFromManagedRule(managedRule: ManagedRule, rule: CoreRuleType): RuleSubtype {
    for (const value of rule.rules) {
        if (value.route === managedRule.route) {
            return value;
        } else {
            const nested = getRuleSubtypeFromManagedRuleInner(managedRule, value, value.route);
            if (nested !== undefined) {
                return nested;
            }
        }
    }

    throw new Error("RuleSubtype does not exist for ManagedRule.");
}

function getRuleSubtypeFromManagedRuleInner(
    managedRule: ManagedRule,
    subType: RuleSubtype,
    realRoute: string
): RuleSubtype | undefined {
    if (realRoute === managedRule.route) {
        return subType;
    } else {
        for (const subRoute of subType.subRoutes) {
            const nested = getRuleSubtypeFromManagedRuleInner(managedRule, subRoute, path.join(realRoute, subRoute.route));
            if (nested !== undefined) {
                return nested;
            }
        }
    }
    return;
}

function getManagedRuleForSubtype(rule: CoreRuleType, subType: RuleSubtype): ManagedRule {
    return getAllManagedPaths(rule.rules).find(value => getRuleSubtypeFromManagedRule(value, rule) === subType)!;
}

async function installUntracked(
    profile: ImmutableProfile,
    rule: ManagedRule,
    installSources: string[],
    mod: ManifestV2
): Promise<void> {
    // Functionally identical to the install method of subdir, minus the subdirectory.
    const ruleDir = profile.joinToProfilePath(rule.route);
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

async function installSubDir(
    profile: ImmutableProfile,
    rule: ManagedRule,
    installSources: string[],
    mod: ManifestV2,
): Promise<void> {
    const subDir = profile.joinToProfilePath(rule.route, mod.getName());
    await FileUtils.ensureDirectory(subDir);
    for (const source of installSources) {
        if ((await FsProvider.instance.lstat(source)).isFile()) {
            const dest = path.join(subDir, path.basename(source));
            await FsProvider.instance.copyFile(source, dest);
        } else {
            for (const content of (await FsProvider.instance.readdir(source))) {
                const cacheContentLocation = path.join(source, content);
                const contentDest = path.join(subDir, content);
                const isCacheContentLocationFile = (await FsProvider.instance.lstat(cacheContentLocation)).isFile();
                if (isCacheContentLocationFile) {
                    await FsProvider.instance.copyFile(cacheContentLocation, contentDest);
                } else {
                    await FsProvider.instance.copyFolder(cacheContentLocation, contentDest);
                }
            }
        }
    }
}

async function installPackageZip(
    profile: ImmutableProfile,
    rule: ManagedRule,
    installSources: string[],
    mod: ManifestV2
): Promise<void> {
    /*
        This install method repackages the entire mod as-is and places it to the
        destination route. Essentially the same as SUBDIR_NO_FLATTEN, but as a
        zip instead of a directory. The zip name will be the mod ID.
     */
    const destDir = profile.joinToProfilePath(rule.route);
    await FileUtils.ensureDirectory(destDir);
    const destination = path.join(destDir, `${mod.getName()}.ts.zip`);
    const cacheDirectory = path.join(PathResolver.MOD_ROOT, 'cache');
    const cachedLocationOfMod: string = path.join(cacheDirectory, mod.getName(), mod.getVersionNumber().toString());
    const builder = ZipProvider.instance.zipBuilder();
    await builder.addFolder("", cachedLocationOfMod);
    await builder.createZip(destination);
}

async function installSubDirNoFlatten(
    profile: ImmutableProfile,
    rule: ManagedRule,
    installSources: string[],
    mod: ManifestV2
): Promise<void> {
    const subDir = profile.joinToProfilePath(rule.route, mod.getName());
    await FileUtils.ensureDirectory(subDir);
    const cacheDirectory = path.join(PathResolver.MOD_ROOT, 'cache');
    const cachedLocationOfMod: string = path.join(cacheDirectory, mod.getName(), mod.getVersionNumber().toString());
    for (const source of installSources) {
        const relativePath = path.relative(cachedLocationOfMod, source);
        if ((await FsProvider.instance.lstat(source)).isFile()) {
            const dest = path.join(subDir, relativePath);
            await FileUtils.ensureDirectory(path.dirname(dest));
            await FsProvider.instance.copyFile(source, dest);
        } else {
            for (const content of (await FsProvider.instance.readdir(source))) {
                const cacheContentLocation = path.join(source, content);
                const contentDest = path.join(subDir, content);
                await FileUtils.ensureDirectory(path.dirname(contentDest));
                if ((await FsProvider.instance.lstat(cacheContentLocation)).isFile()) {
                    await FsProvider.instance.copyFile(cacheContentLocation, contentDest);
                } else {
                    await FsProvider.instance.copyFolder(cacheContentLocation, contentDest);
                }
            }
        }
    }
}

type BestFitRule = {
    rule: ManagedRule,
    count: number
}

function getBestFitRule(matchingRules: ManagedRule[], file: FileTree): BestFitRule | undefined {
    if (matchingRules.length === 0) {
        return undefined;
    }
    if (matchingRules.length === 1) {
        return {
            rule: matchingRules[0]!,
            count: 0
        };
    }

    const fileParts = file.getTarget().split(path.sep).reverse();
    return matchingRules.map(value => {
        const ruleParts = value.route.split('/').reverse();
        let numberOfMatches = 0;
        for (let i = 0; i < fileParts.length; i++) {
            if (fileParts[i] === undefined || ruleParts[i] === undefined) {
                break;
            }
            if (fileParts[i] === ruleParts[i]) {
                numberOfMatches++;
            }
        }
        return {
            rule: value,
            count: numberOfMatches
        };
    }).reduce((previousValue, currentValue) => {
        if (currentValue.count > previousValue.count) {
            return currentValue;
        }
        return previousValue;
    });
}

async function buildInstallForRuleSubtype(
    rule: CoreRuleType,
    location: string,
    folderName: string,
    mod: ManifestV2,
    tree: FileTree
): Promise<Map<RuleSubtype, string[]>> {
    const flatRules = getAllManagedPaths(rule.rules);
    const installationIntent = new Map<RuleSubtype, string[]>();
    for (const file of tree.getFiles()) {
        // Find matching rule for file based on extension name.
        // If a matching extension name is longer (EG: .plugin.dll vs .dll) then assume the longer one is the correct match.
        let matchingRule: ManagedRule | undefined;
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
        if (matchingRule === undefined) {
            continue;
        }
        const subType = getRuleSubtypeFromManagedRule(matchingRule, rule);
        const updatedArray = installationIntent.get(subType) || [];
        updatedArray.push(file);
        installationIntent.set(subType, updatedArray);
    }
    for (const file of tree.getDirectories()) {
        const matchingRules: ManagedRule[] = flatRules.filter(value => path.basename(value.route).toLowerCase() === file.getDirectoryName().toLowerCase());
        const matchingRule: ManagedRule | undefined = getBestFitRule(matchingRules, file)?.rule;

        if (matchingRule === undefined) {
            const nested = await buildInstallForRuleSubtype(rule, path.join(location, file.getDirectoryName()), folderName, mod, file);
            for (let [rule, files] of nested.entries()) {
                const arr = installationIntent.get(rule) || [];
                arr.push(...files);
                installationIntent.set(rule, arr);
            }
        } else {
            const subType = getRuleSubtypeFromManagedRule(matchingRule, rule);
            const arr = installationIntent.get(subType) || [];
            arr.push(file.getTarget());
            installationIntent.set(subType, arr);
        }
    }
    return installationIntent;
}

export async function addToStateFile(
    mod: ManifestV2,
    files: Map<string, string>,
    profile: ImmutableProfile
): Promise<void> {
    await FileUtils.ensureDirectory(profile.joinToProfilePath("_state"));
    let existing: Map<string, string> = new Map();
    if (await FsProvider.instance.exists(profile.joinToProfilePath("_state", `${mod.getName()}-state.yml`))) {
        const read = await FsProvider.instance.readFile(profile.joinToProfilePath("_state", `${mod.getName()}-state.yml`));
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
    await FsProvider.instance.writeFile(profile.joinToProfilePath("_state", `${mod.getName()}-state.yml`), yaml.stringify(mft));
    await ConflictManagementProvider.instance.overrideInstalledState(mod, profile);
}

async function installState(args: InstallRuleArgs): Promise<void> {
    const { profile, coreRule, rule, installSources, mod } = args;
    const fileRelocations = new Map<string, string>();
    for (const source of installSources) {
        if (!(coreRule.relativeFileExclusions || []).find(value => value.toLowerCase() === path.basename(source.toLowerCase()))) {
            if ((await FsProvider.instance.lstat(source)).isFile()) {
                fileRelocations.set(source, path.join(rule.route, path.basename(source)));
            } else {
                const tree = await FileTree.buildFromLocation(source);
                if (tree instanceof R2Error) {
                    throw tree;
                }
                for (const subFile of tree.getRecursiveFiles()) {
                    if (!(coreRule.relativeFileExclusions || []).find(value => value.toLowerCase() === path.relative(source, subFile))) {
                        fileRelocations.set(subFile, path.join(rule.route, path.relative(source, subFile)));
                    }
                }
            }
        }
    }
    for (let [source, relative] of fileRelocations.entries()) {
        await FileUtils.ensureDirectory(profile.joinToProfilePath(path.dirname(relative)));
        await FsProvider.instance.copyFile(source, profile.joinToProfilePath(relative));
    }
    await addToStateFile(mod, fileRelocations, profile);
}

async function uninstallPackageZip(mod: ManifestV2, profile: ImmutableProfile): Promise<void> {
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

    await recursiveDelete(profile.getProfilePath(), `${mod.getName()}.ts.zip`);
}

async function uninstallSubDir(mod: ManifestV2, profile: ImmutableProfile): Promise<void> {
    const fs = FsProvider.instance;
    const searchLocations = ["BepInEx", "shimloader", "UMM"].map((x) => profile.joinToProfilePath(x));

    for (const searchLocation of searchLocations) {
        if (!(await fs.exists(searchLocation))) {
            continue
        }

        for (const file of (await fs.readdir(searchLocation))) {
            if ((await fs.lstat(path.join(searchLocation, file))).isDirectory()) {
                for (const folder of (await fs.readdir(path.join(searchLocation, file)))) {
                    const folderPath = path.join(searchLocation, file, folder);
                    if (folder === mod.getName() && (await fs.lstat(folderPath)).isDirectory()) {
                        await FileUtils.emptyDirectory(folderPath);
                        await fs.rmdir(folderPath);
                    }
                }
            }
        }
    }
}

export async function uninstallState(mod: ManifestV2, profile: ImmutableProfile): Promise<void> {
    const stateFilePath = profile.joinToProfilePath("_state", `${mod.getName()}-state.yml`);
    if (await FsProvider.instance.exists(stateFilePath)) {
        const read = await FsProvider.instance.readFile(stateFilePath);
        const tracker = (yaml.parse(read.toString()) as ModFileTracker);
        for (const [cacheFile, installFile] of tracker.files) {
            if (await FsProvider.instance.exists(profile.joinToProfilePath(installFile))) {
                await FsProvider.instance.unlink(profile.joinToProfilePath(installFile));
                if ((await FsProvider.instance.readdir(path.dirname(profile.joinToProfilePath(installFile)))).length === 0) {
                    await FsProvider.instance.rmdir(path.dirname(profile.joinToProfilePath(installFile)));
                }
            }
        }
        await FsProvider.instance.unlink(profile.joinToProfilePath("_state", `${mod.getName()}-state.yml`));
    }
}

// Enables or disables a mod installed with InstallRulePluginInstaller using SUBDIR/SUBDIR_NO_FLATTEN tracking methods.
async function applyModeSubDirs(mod: ManifestV2, profile: ImmutableProfile, mode: number, rule: CoreRuleType): Promise<void> {
    const subDirPaths = getAllManagedPaths(rule.rules)
        .filter(value => [TrackingMethod.SUBDIR, TrackingMethod.SUBDIR_NO_FLATTEN].includes(value.trackingMethod));

    for (const dir of subDirPaths) {
        if (await FsProvider.instance.exists(profile.joinToProfilePath(dir.route))) {
            const dirContents = await FsProvider.instance.readdir(profile.joinToProfilePath(dir.route));
            for (const namespacedDir of dirContents) {
                if (namespacedDir === mod.getName()) {
                    const tree = throwForR2Error(
                        await FileTree.buildFromLocation(profile.joinToProfilePath(dir.route, namespacedDir))
                    );
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

// Enables or disables a mod installed with InstallRulePluginInstaller using STATE tracking method.
export async function applyModeState(mod: ManifestV2, profile: ImmutableProfile, mode: number): Promise<void> {
    const modStateFilePath = profile.joinToProfilePath("_state", `${mod.getName()}-state.yml`);
    if (await FsProvider.instance.exists(modStateFilePath)) {
        const fileContents = (await FsProvider.instance.readFile(modStateFilePath)).toString();
        const tracker: ModFileTracker = yaml.parse(fileContents);
        for (const [key, value] of tracker.files) {
            if (await ConflictManagementProvider.instance.isFileActive(mod, profile, value)) {
                const filePath = profile.joinToProfilePath(value);
                if (await FsProvider.instance.exists(filePath)) {
                    await FsProvider.instance.unlink(filePath);
                }
                if (mode === ModMode.ENABLED) {
                    await FsProvider.instance.copyFile(key, filePath);
                }
            }
        }
    }
}

export class InstallRulePluginInstaller implements PackageInstaller {
    private ruleOverride: CoreRuleType|undefined;

    /**
     * @param ruleOverride can be used to ignore installation rules provided by
     *                     Thunderstore ecosystem.
     *
     * This can be used e.g. in PackageInstaller implementations or test cases.
     * Note that the override last the instance's whole lifetime, causing it to
     * ignore changes in the active game. Therefore it shouldn't be used in the
     * shared instance initiated in registry.ts.
     */
    constructor(ruleOverride?: CoreRuleType) {
        this.ruleOverride = ruleOverride;
    }

    private get rule(): CoreRuleType {
        if (this.ruleOverride !== undefined) {
            return this.ruleOverride;
        }

        // While it's not ideal that this same method is called repeatedly,
        // the code path below currently takes <1ms to execute so we should be fine.
        const gameConfig = getGameConfigBySettingsIdentifier(GameManager.activeGame.settingsIdentifier);
        if (gameConfig === undefined) {
            throw new Error(`Game config not found for ${GameManager.activeGame.settingsIdentifier}`);
        }

        return {
            gameName: gameConfig.internalFolderName,
            rules: gameConfig.installRules,
            relativeFileExclusions: gameConfig.relativeFileExclusions
        };
    }

    /**
     * Handles installation of packages according to the install rules defined
     * for it.
     */
    async install(args: InstallArgs) {
        const { mod, profile, packagePath } = args;
        const fileTree = throwForR2Error(await FileTree.buildFromLocation(packagePath))
        await this.resolveFileTreeInstall(profile, packagePath, path.basename(packagePath), mod, fileTree);
    }

    private async resolveFileTreeInstall(
        profile: ImmutableProfile,
        location: string,
        folderName: string,
        mod: ManifestV2,
        tree: FileTree
    ): Promise<void> {
        const installationIntent = await buildInstallForRuleSubtype(this.rule, location, folderName, mod, tree);
        for (let [rule, files] of installationIntent.entries()) {
            const managedRule = getManagedRuleForSubtype(this.rule, rule);

            const args: InstallRuleArgs = {
                profile,
                coreRule: this.rule,
                rule: managedRule,
                installSources: files,
                mod,
            }
            switch (rule.trackingMethod) {
                case TrackingMethod.STATE: await installState(args); break;
                case TrackingMethod.SUBDIR: await installSubDir(profile, managedRule, files, mod); break;
                case TrackingMethod.NONE: await installUntracked(profile, managedRule, files, mod); break;
                case TrackingMethod.SUBDIR_NO_FLATTEN: await installSubDirNoFlatten(profile, managedRule, files, mod); break;
                case TrackingMethod.PACKAGE_ZIP: await installPackageZip(profile, managedRule, files, mod); break;
            }
        }
    }

    async uninstall(args: InstallArgs) {
        try {
            await uninstallState(args.mod, args.profile);
            await uninstallSubDir(args.mod, args.profile);
            await uninstallPackageZip(args.mod, args.profile);
        } catch (e) {
            const name = 'Failed to remove files';
            const solution = 'Is the game still running? If so, close it and try again.';
            throw R2Error.fromThrownValue(e, name, solution);
        }
    }

    // PACKAGE_ZIP tracking method not supported currently.
    // NONE tracking method won't implement enabling.
    async enable(args: InstallArgs) {
        await applyModeSubDirs(args.mod, args.profile, ModMode.ENABLED, this.rule);
        await applyModeState(args.mod, args.profile, ModMode.ENABLED);
    }

    // PACKAGE_ZIP tracking method not supported currently.
    // NONE tracking method won't implement disabling.
    async disable(args: InstallArgs) {
        await applyModeSubDirs(args.mod, args.profile, ModMode.DISABLED, this.rule);
        await applyModeState(args.mod, args.profile, ModMode.DISABLED);
    }
}
