import * as path from 'path';

import InMemoryFsProvider from '../__tests__/stubs/providers/InMemory.FsProvider';
import GameManager from '../../../src/model/game/GameManager';
import ManifestV2 from '../../../src/model/ManifestV2';
import Profile from '../../../src/model/Profile';
import VersionNumber from '../../../src/model/VersionNumber';
import FsProvider from '../../../src/providers/generic/file/FsProvider';
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
    inMemoryFs.mkdirs(PathResolver.MOD_ROOT);

    const game = GameManager.findByFolderName(internalFolderName);
    if (game === undefined) {
        throw new Error(`GameManager has no record of ${internalFolderName}`);
    }
    GameManager.activeGame = game;

    ProfileProvider.provide(() => new ProfileProviderImpl());
    new Profile('TestProfile');
    inMemoryFs.mkdirs(Profile.getActiveProfile().getProfilePath());

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
