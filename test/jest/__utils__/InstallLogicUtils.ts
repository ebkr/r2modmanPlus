import * as path from 'path';

import InMemoryFsProvider from '../__tests__/stubs/providers/InMemory.FsProvider';
import R2Error from '../../../src/model/errors/R2Error';
import FileTree from '../../../src/model/file/FileTree';
import GameManager from '../../../src/model/game/GameManager';
import ManifestV2 from '../../../src/model/ManifestV2';
import Profile from '../../../src/model/Profile';
import VersionNumber from '../../../src/model/VersionNumber';
import FsProvider from '../../../src/providers/generic/file/FsProvider';
import NodeFs from '../../../src/providers/generic/file/NodeFs';
import ConflictManagementProvider from '../../../src/providers/generic/installing/ConflictManagementProvider';
import ProfileInstallerProvider from '../../../src/providers/ror2/installing/ProfileInstallerProvider';
import ProfileProvider from '../../../src/providers/ror2/model_implementation/ProfileProvider';
import ConflictManagementProviderImpl from '../../../src/r2mm/installing/ConflictManagementProviderImpl';
import InstallationRuleApplicator from '../../../src/r2mm/installing/default_installation_rules/InstallationRuleApplicator';
import GenericProfileInstaller from '../../../src/r2mm/installing/profile_installers/GenericProfileInstaller';
import PathResolver from '../../../src/r2mm/manager/PathResolver';

class ProfileProviderImpl extends ProfileProvider {
    ensureProfileDirectory(directory: string, profile: string): void {
        FsProvider.instance.mkdirs(path.join(directory, profile));
    }
}

/**
 * Tasks required before each test, including:
 * - Setup providers
 * - Activate game based on internalFolderName
 * - Create a profile
 */
export async function installLogicBeforeEach(internalFolderName: string) {
    const inMemoryFs = new InMemoryFsProvider();
    FsProvider.provide(() => inMemoryFs);
    InMemoryFsProvider.clear();
    PathResolver.MOD_ROOT = 'MODS';
    await inMemoryFs.mkdirs(PathResolver.MOD_ROOT);

    const game = GameManager.findByFolderName(internalFolderName);
    if (game === undefined) {
        throw new Error(`GameManager has no record of ${internalFolderName}`);
    }
    GameManager.activeGame = game;

    ProfileProvider.provide(() => new ProfileProviderImpl());
    new Profile('TestProfile');
    await inMemoryFs.mkdirs(Profile.getActiveProfile().getProfilePath());

    ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
    InstallationRuleApplicator.apply();
    ConflictManagementProvider.provide(() => new ConflictManagementProviderImpl());
    InMemoryFsProvider.setMatchMode("CASE_SENSITIVE");
}

/**
 * Return a minimal fake package
 */
export function createManifest(name: string, author: string, version?: VersionNumber): ManifestV2  {
    const manifest = new ManifestV2()
    manifest.setManifestVersion(2);
    manifest.setAuthorName(author);
    manifest.setName(`${author}-${name}`);
    manifest.setDisplayName(name);
    manifest.setVersionNumber(version ? version : new VersionNumber("1.0.0"));
    return manifest;
};

/**
 * Use FsProvider to write fake package files into cache dir
 */
export async function createPackageFilesIntoCache(pkg: ManifestV2, filePaths: string[]) {
    const fs = FsProvider.instance;
    const cachePkgRoot = path.join(PathResolver.MOD_ROOT, "cache", pkg.getName(), pkg.getVersionNumber().toString());
    await fs.mkdirs(cachePkgRoot);

    for (const sourcePath of filePaths) {
        const destPath = path.join(cachePkgRoot, sourcePath);
        await fs.mkdirs(path.dirname(destPath));
        await fs.writeFile(destPath, "");
        expect(await fs.exists(destPath));
    }
}

/**
 * Create "cached package" from the contents of "folder-structure-testing" folder.
 */
export async function setupFolderStructureTestFiles(pkg: ManifestV2) {
    // Read the file structure from disk.
    FsProvider.provide(() => new NodeFs());
    const baseFolderStructurePath = path.join(__dirname, "../../folder-structure-testing");
    const tree = await FileTree.buildFromLocation(baseFolderStructurePath);
    if (tree instanceof R2Error) {
        throw new Error("Unable to find folder-structure-testing folder");
    }

    const testFiles = tree.getRecursiveFiles()
        .map(value => path.relative(baseFolderStructurePath, value))
        // Filter out file generation script.
        .filter(value => value !== "populator.mjs" && value !== "depopulator.mjs");

    // Write the file structure into mock file system.
    FsProvider.provide(() => new InMemoryFsProvider());
    const cachePkgRoot = path.join(PathResolver.MOD_ROOT, "cache", pkg.getName(), pkg.getVersionNumber().toString());

    for (const value of testFiles) {
        await FsProvider.instance.mkdirs(path.join(cachePkgRoot, path.dirname(value.trim())));
        await FsProvider.instance.writeFile(path.join(cachePkgRoot, value.trim()), "placeholder");
    }
}

type SourceAndTargetPaths = [string, string];  // [package_path, install_dir_relative_to_profile_folder]

function convertPath(path: string) {
    return path.replace(/[\/\\]/g, "_");
}

// For testing file installation with the contents of folder-structure-testing folder.
export async function testStateTrackedFileStructure(pkg: ManifestV2, paths: SourceAndTargetPaths[]) {
    for (const [packagePath, installDir] of paths) {
        const targetPath = Profile.getActiveProfile().joinToProfilePath(
            installDir,
            path.basename(packagePath),
            `${convertPath(packagePath)}_Files`,
            `${convertPath(packagePath)}_file.txt`
        );
        expect(await FsProvider.instance.exists(targetPath)).toBeTruthy();
    }
    const stateFile = Profile.getActiveProfile().joinToProfilePath("_state", `${pkg.getName()}-state.yml`);
    expect(await FsProvider.instance.exists(stateFile)).toBeTruthy();
}

/**
 * Return file tree of the target path as an array.
 *
 * Purely to make debugging easier if & when the test fails.
 */
async function getTree(target: string) {
    const fs = FsProvider.instance;
    const result: string[] = [];

    for (const entry of (await fs.readdir(target))) {
        const fullPath = path.join(target, entry);
        if ((await fs.stat(fullPath)).isDirectory()) {
            for (const subPath of (await getTree(fullPath))) {
                result.push(subPath);
            }
        } else {
            result.push(fullPath);
        }
    }
    return result;
}

/**
 * Assert all files exists on the expected destination paths after
 * package installation.
 */
export async function expectFilesToBeCopied(sourceToExpectedDestination: Record<string, string>) {
    const fs = FsProvider.instance;
    const profilePath = Profile.getActiveProfile().getProfilePath();

    for (const destPath of Object.values(sourceToExpectedDestination)) {
        const fullPath = path.join(profilePath, destPath);
        const result = await fs.exists(fullPath);
        if (!result) {
            console.log(`Expected ${fullPath} to exist but it DOES NOT! All files:`);
            console.log(JSON.stringify(await getTree(profilePath), null, 2));
        }
        expect(result).toBeTruthy();
    }
}

/**
 * Assert intendend and only intended files are removed from
 * destionation paths after package uninstallation.
 */
export async function expectFilesToBeRemoved(
    sourceToExpectedDestination: Record<string, string>,
    expectedAfterUninstall: string[]
) {
    const fs = FsProvider.instance;
    const profilePath = Profile.getActiveProfile().getProfilePath();

    for (const destPath of Object.values(sourceToExpectedDestination)) {
        const fullPath = path.join(profilePath, destPath);
        const doesExist = await fs.exists(fullPath);
        const shouldExist = expectedAfterUninstall.includes(destPath);

        if (doesExist && !shouldExist) {
            console.log(`Expected ${fullPath} to NOT exist but it DOES! All files:`);
            console.log(JSON.stringify(await getTree(profilePath), null, 2));
        } else if (shouldExist && !doesExist) {
            console.log(`Expected ${fullPath} to exist but it DOES NOT! All files:`);
            console.log(JSON.stringify(await getTree(profilePath), null, 2));
        }

        expect(doesExist).toEqual(shouldExist);
    }
}

export async function createFilesIntoProfile(filePaths: string[]) {
    const fs = FsProvider.instance;
    const profilePath = Profile.getActiveProfile().getProfilePath();

    for (const filePath of filePaths) {
        const destPath = path.join(profilePath, ...filePath.split('/'));
        await fs.mkdirs(path.dirname(destPath));
        await fs.writeFile(destPath, "");
        expect(await fs.exists(destPath));
    }
}

export async function expectFilesToExistInProfile(filePaths: string[]) {
    const fs = FsProvider.instance;
    const profilePath = Profile.getActiveProfile().getProfilePath();

    for (const filePath of filePaths) {
        const fullPath = path.join(profilePath, filePath);
        const doesExist = await fs.exists(fullPath);

        if (!doesExist) {
            console.log(`Expected ${fullPath} to exist but it DOES NOT! All files:`);
            console.log(JSON.stringify(await getTree(profilePath), null, 2));
        }

        expect(doesExist).toBeTruthy();
    }
}
