import { InstallArgs, PackageInstaller } from "./PackageInstaller";
import Profile, { ImmutableProfile } from "../model/Profile";
import FsProvider from "../providers/generic/file/FsProvider";
import path from "path";
import ManifestV2 from "../model/ManifestV2";
import R2Error from "../model/errors/R2Error";
import FileTree from "../model/file/FileTree";
import InstallationRules, { CoreRuleType, ManagedRule, RuleSubtype } from "../r2mm/installing/InstallationRules";
import FileUtils from "../utils/FileUtils";
import yaml from "yaml";
import ModFileTracker from "../model/installing/ModFileTracker";
import ConflictManagementProvider from "../providers/generic/installing/ConflictManagementProvider";
import PathResolver from "../r2mm/manager/PathResolver";
import ZipProvider from "../providers/generic/zip/ZipProvider";

type InstallRuleArgs = {
    profile: ImmutableProfile,
    coreRule: CoreRuleType,
    rule: ManagedRule,
    installSources: string[],
    mod: ManifestV2,
};


async function installUntracked(profile: ImmutableProfile, rule: ManagedRule, installSources: string[], mod: ManifestV2) {
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
) {
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
                if ((await FsProvider.instance.lstat(cacheContentLocation)).isFile()) {
                    await FsProvider.instance.copyFile(cacheContentLocation, contentDest);
                } else {
                    await FsProvider.instance.copyFolder(cacheContentLocation, contentDest);
                }
            }
        }
    }
}


async function installPackageZip(profile: ImmutableProfile, rule: ManagedRule, installSources: string[], mod: ManifestV2) {
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


async function installSubDirNoFlatten(profile: ImmutableProfile, rule: ManagedRule, installSources: string[], mod: ManifestV2) {
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

async function buildInstallForRuleSubtype(
    rule: CoreRuleType,
    location: string,
    folderName: string,
    mod: ManifestV2,
    tree: FileTree
): Promise<Map<RuleSubtype, string[]>> {
    const flatRules = InstallationRules.getAllManagedPaths(rule.rules);
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
        const subType = InstallationRules.getRuleSubtypeFromManagedRule(matchingRule, rule);
        const updatedArray = installationIntent.get(subType) || [];
        updatedArray.push(file);
        installationIntent.set(subType, updatedArray);
    }
    for (const file of tree.getDirectories()) {
        // Only expect one (for now).
        // If multiple then will need to implement a way to reverse search folder path.
        let matchingRule: ManagedRule | undefined = flatRules.find(value => path.basename(value.route).toLowerCase() === file.getDirectoryName().toLowerCase());
        if (matchingRule === undefined) {
            const nested = await buildInstallForRuleSubtype(rule, path.join(location, file.getDirectoryName()), folderName, mod, file);
            for (let [rule, files] of nested.entries()) {
                const arr = installationIntent.get(rule) || [];
                arr.push(...files);
                installationIntent.set(rule, arr);
            }
        } else {
            const subType = InstallationRules.getRuleSubtypeFromManagedRule(matchingRule, rule);
            const arr = installationIntent.get(subType) || [];
            arr.push(file.getTarget());
            installationIntent.set(subType, arr);
        }
    }
    return installationIntent;
}


export async function addToStateFile(mod: ManifestV2, files: Map<string, string>, profile: ImmutableProfile) {
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

async function installState(args: InstallRuleArgs) {
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

export class InstallRuleInstaller implements PackageInstaller {
    public readonly rule: CoreRuleType;

    constructor(rules: CoreRuleType) {
        this.rule = rules;
    }

    /**
     * Handles installation of packages according to the install rules defined
     * for it.
     */
    async install(args: InstallArgs) {
        const { mod, profile, packagePath } = args;
        const files: FileTree | R2Error = await FileTree.buildFromLocation(packagePath);
        if (files instanceof R2Error) {
            throw files;
        }
        const result = await this.resolveBepInExTree(
            profile,
            packagePath,
            path.basename(packagePath),
            mod,
            files,
        );
        if (result instanceof R2Error) {
            throw result;
        }
    }

    async resolveBepInExTree(profile: ImmutableProfile, location: string, folderName: string, mod: ManifestV2, tree: FileTree): Promise<R2Error | void> {
        const installationIntent = await buildInstallForRuleSubtype(this.rule, location, folderName, mod, tree);
        for (let [rule, files] of installationIntent.entries()) {
            const managedRule = InstallationRules.getManagedRuleForSubtype(this.rule, rule);

            const args: InstallRuleArgs = {
                profile,
                coreRule: this.rule,
                rule: managedRule,
                installSources: files,
                mod,
            }
            switch (rule.trackingMethod) {
                case 'STATE': await installState(args); break;
                case 'SUBDIR': await installSubDir(profile, managedRule, files, mod); break;
                case 'NONE': await installUntracked(profile, managedRule, files, mod); break;
                case 'SUBDIR_NO_FLATTEN': await installSubDirNoFlatten(profile, managedRule, files, mod); break;
                case 'PACKAGE_ZIP': await installPackageZip(profile, managedRule, files, mod); break;
            }
        }
        return Promise.resolve(undefined);
    }
}
